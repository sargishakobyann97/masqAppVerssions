const Store = require("./../modules/store");
const _ = require("lodash");
const { app, dialog } = require("electron");
const fs = require("fs");
const fsx = require("fs-extra");
const { execFile, exec } = require("child_process");
const { kill } = require("node:process");
const path = require("path");
const box = require("../window");
const os = require("os");

class Profile extends Store {
    static storage_name = "profiles";
    static updatable = ["name", "proxy", "cookies", "comment", "geo", "status", "timezone"];
    static hidden = ["attributes"];
    attributes = [
        "id",
        "name",
        "comment",
        "proxy",
        "country",
        "cookies",
        "resolution",
        "ram",
        "browser",
        "browser_version",
        "cpu",
        "gpu",
        "timezone",
        "language",
        "platform",
        "user_agent",
        "created_at",
        "updated_at",
        "geo",
        "acceptEncoding",
        "acceptStr",
        "jsBaseCode",
        "jsATDCode",
        "geocode",
        "status",
        "pid",
    ];
    static #browser_profiles_directory = "browser_profiles";

    static status = { CREATED: "created", BINDING: "binding", BOUND: "bound" };

    constructor(attributes) {
        super();
        this.set_attributes(attributes);
    }

    save() {
        if (!this.status) {
            this.status = Profile.status.CREATED;
        }
        super.save();
        this.#create_browser_profile_dir();
        return this;
    }

    static get_browser_profiles_root() {
        return app.getPath("userData") + path.sep + this.#browser_profiles_directory;
    }

    get_browser_profile_dir() {
        return this.static.get_browser_profiles_root() + path.sep + this.id + ".profile";
    }

    #create_browser_profile_dir() {
        let dir = this.get_browser_profile_dir();

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    static delete(keys) {
        super.delete(keys);
        let delete_dir = (profile_id, profile) => {
            let dir = new profile({ id: profile_id }).get_browser_profile_dir();
            if (fs.existsSync(dir)) {
                fs.rmSync(dir, { recursive: true, force: true });
            }
        };

        if (Array.isArray(keys) && keys.length > 0) {
            keys.forEach((key) => {
                delete_dir(key, this);
            });
        }
        if (typeof keys === "string") {
            delete_dir(keys, this);
        }
    }

    static delete_all() {
        fsx.emptyDirSync(this.get_browser_profiles_root());
        super.delete_all();
    }

    set_status(status) {
        this.force_update({ status: status });
    }

    set_pid(pid) {
        this.force_update({ pid: pid });
    }

    clear_pid() {
        this.force_update({ pid: null });
    }

    execute() {
        let command,
            cwd = null;
        let args = ["-no-remote", "-profile", this.get_browser_profile_dir()];
        let browserPath = path.join(app.getPath("userData"), "apps", "browser");
        if (process.platform === "darwin") {
            cwd = path.join(browserPath, "MASQBrowser.app", "Contents", "MacOS");
            command = "./MASQ";
        }

        if (process.platform === "win32") {
            cwd = browserPath;
            command = "MASQ.exe";
        }

        if (command === null) {
            dialog.showErrorBox("Platform error", `No handler for ${process.platform} platform.`);
            return;
        }

        let profile_process = execFile(command, args, {
            cwd: cwd,
            shell: false,
        });

        profile_process.on("spawn", () => {
            this.refresh();
            if (this.status === Profile.status.CREATED) {
                this.set_status(Profile.status.BINDING);
            }

            this.set_pid(profile_process.pid);
            box.event("profile", "execute", { id: this.id });
        });

        profile_process.on("close", () => {
            this.refresh();
            if (this.status === Profile.status.BINDING) {
                this.set_status(Profile.status.CREATED);
            }

            this.clear_pid();
            box.event("profile", "close", { id: this.id });
        });

        profile_process.on("error", (err) => {
            this.refresh();
            if (this.status === Profile.status.BINDING) {
                this.set_status(Profile.status.CREATED);
            }

            this.clear_pid();
            box.event("profile", "error", { id: this.id, err: err });
        });
    }
    close() {
        switch (os.platform()) {
            case "darwin":
                kill(this.pid);
                break;
            case "win32":
                exec(`taskkill /PID ${this.pid} /T /F`);
                break;
        }
    }
}

module.exports = Profile;
