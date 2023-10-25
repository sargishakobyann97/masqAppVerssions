const { BrowserWindow, app } = require("electron");
const path = require("path");

class Window {
    get() {
        if (this.box === undefined) {
            this.box = new BrowserWindow({
                title: "MASQ Panel",
                icon: path.join(app.getAppPath(), "icons", "masq-panel.ico"),
                width: 1116,
                height: 689,
                minWidth: 1116,
                minHeight: 709,
                webPreferences: {
                    preload: path.join(__dirname, "preload.js"),
                },
            });
            this.box.setMenu(null);
        }

        return this.box;
    }
    event(channel, name, message) {
        this.box.webContents.send(`${channel}:${name}`, message);
    }
}

module.exports = new Window();
