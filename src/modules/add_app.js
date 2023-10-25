const path = require("path");
const os = require("os");
const fs = require("fs/promises");
const request = require("request");
const unzip = require("adm-zip");
const { app: app } = require("electron");

class AddApp {
    constructor(name, config, success_callback, error_callback) {
        this.name = name;
        this.config = config;
        this.success_callback = success_callback;
        this.error_callback = error_callback;
        this.path = path.join(app.getPath("userData"), "apps", name);
    }

    #get_app_url() {
        let { version, name, format } = this.config.packages[this.name];
        return `${this.config.domain}/${this.name}/${version}/${name}-${os.platform()}-${os.arch()}.${format}`;
    }

    #unzip_from_http_response(http_response) {
        let archive = new unzip(http_response);
        archive.extractAllToAsync(this.path, true, true, (error) => {
            if (error && this.error_callback) {
                this.error_callback(error);
            } else if (this.success_callback) {
                this.success_callback();
            }
        });
    }

    get() {
        let self = this;
        fs.mkdir(self.path, { recursive: true }).then(() => {
            request.get({ url: self.#get_app_url(), encoding: null }, (err, res, body) => {
                if (res.statusCode !== 200 && self.error_callback) {
                    self.error_callback(`Can\'t get app: http response status code ${res.statusCode}`);
                } else if (res.statusCode === 200) {
                    self.#unzip_from_http_response(body);
                }
            });
        });
    }
}

module.exports = AddApp;
