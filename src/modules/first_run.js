const firstRun = require("electron-first-run");
const config = require("electron-node-config");
const agent_manifest = require("./agent_manifest");

class FirstRun {
    constructor(box) {
        this.box = box;
    }
    check() {
        return firstRun();
    }

    clear() {
        firstRun.clear();
    }

    init() {
        if (this.check()) {
            this.install_add_apps();
            this.install_agent_manifest();
        }
    }

    install_add_apps() {
        this.box.event("panel", "first_run", { status: "started" });
        const apps_config = config.get("apps");
        const apps = Object.keys(apps_config.packages);
        const add_app = require("./add_app");
        apps.forEach((app) => {
            let success_callback = () =>
                this.box.event("panel", "get_add_app", {
                    app: app,
                    status: "ready",
                });
            let error_callback = (error) =>
                this.box.event("panel", "get_add_app", {
                    app: app,
                    status: "error",
                    error: `Add app error: ${error}`,
                });

            new add_app(app, apps_config, success_callback, error_callback).get();
        });
    }

    install_agent_manifest() {
        new agent_manifest().save();
    }
}

module.exports = FirstRun;
