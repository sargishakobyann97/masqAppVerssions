const os = require("os");
const config = require("electron-node-config");
const path = require("path");
const { app } = require("electron");
const fsPromises = require("fs/promises");
const { spawnSync } = require("node:child_process");

class AgentManifest {
    #format = "json";

    get_agent_name() {
        return "browser_agent-" + os.platform() + "-" + os.arch();
    }

    get() {
        let manifest = config.get("agent_manifest");
        manifest.path = this.get_agent_path();
        return manifest;
    }

    get_agent_path() {
        let agent_path = path.join(app.getPath("userData"), "apps", "agent", this.get_agent_name());

        if (os.platform() === "win32") {
            agent_path = `${agent_path}.exe`;
        }

        return agent_path;
    }

    get_path() {
        let manifest_path,
            manifest_name = config.get("agent_manifest.name");
        switch (os.platform()) {
            case "darwin":
                manifest_path = path.join(app.getPath("appData"), "Mozilla", "NativeMessagingHosts");
                break;
            case "win32":
                manifest_path = path.join(app.getPath("userData"), "Manifests");
                break;
        }

        return path.join(manifest_path, manifest_name + "." + this.#format);
    }

    create() {
        let manifest_path = this.get_path();
        return fsPromises.mkdir(path.dirname(manifest_path), { recursive: true }).then(() => {
            fsPromises.writeFile(manifest_path, JSON.stringify(this.get()));
        });
    }

    save() {
        this.create().then(() => {
            if (os.platform() === "win32") {
                let args = [
                    "ADD",
                    "HKCU\\SOFTWARE\\Mozilla\\NativeMessagingHosts\\" + config.get("agent_manifest.name"),
                    "/f",
                    "/t",
                    "REG_SZ",
                    "/d",
                    this.get_path(),
                ];
                spawnSync("reg", args);
            }
        });
    }
}

module.exports = AgentManifest;
