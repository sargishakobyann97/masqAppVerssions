const ElectronStore = require("electron-store");
const { randomUUID } = require("crypto");
const _ = require("lodash");
const { toISOwithTZ } = require("./time");
const os = require("os");

//TODO refactor encryption/decryption work
class Store {
    static storage_name = "default";
    static storages = [];
    static updatable = [];
    static hidden = [];
    attributes = [];
    get static() {
        return this.constructor;
    }

    get_id() {
        return randomUUID();
    }

    save() {
        this.id = this.get_id();
        this.created_at = toISOwithTZ(new Date());
        // if (safeStorage.isEncryptionAvailable()) {
        //     let encrypted = {}
        //     _.forIn(this, (value, key) => {
        //         encrypted[safeStorage.encryptString(key).toString('latin1')] = safeStorage.encryptString(value).toString('latin1')
        //     })
        //
        //     this.static.get_storage().set(this.id, encrypted)
        // } else {
        this.static.get_storage().set(this.id, _.omit(this, this.static.hidden));
        // }

        return this;
    }

    update(attributes) {
        let updatableAttributes = _.pick(attributes, this.static.updatable);
        let model = _.assign(this, updatableAttributes, { updated_at: toISOwithTZ(new Date()) });

        // if (safeStorage.isEncryptionAvailable()) {
        //     let encrypted = {}
        //     _.forIn(model, (value, key) => {
        //         encrypted[safeStorage.encryptString(key).toString('latin1')] = safeStorage.encryptString(value).toString('latin1')
        //     })
        //     this.static.get_storage().set(model.id, encrypted)
        // } else {
        this.static.get_storage().set(model.id, model);
        // }
    }

    force_update(attributes) {
        let model = _.assign(this, attributes, { updated_at: toISOwithTZ(new Date()) });

        // if (safeStorage.isEncryptionAvailable()) {
        //     let encrypted = {}
        //     _.forIn(model, (value, key) => {
        //         encrypted[safeStorage.encryptString(key).toString('latin1')] = safeStorage.encryptString(value).toString('latin1')
        //     })
        //     this.static.get_storage().set(model.id, encrypted)
        // } else {
        this.static.get_storage().set(model.id, model);
        // }
    }

    refresh() {
        let model = this.static.get(this.id);
        this.set_attributes(model);
    }

    set_attributes(attributes) {
        this.attributes.forEach((attribute) => {
            if (_.has(attributes, attribute)) {
                this[attribute] = attributes[attribute];
            }
        });
    }

    static get(keys) {
        let storage = this.get_storage();
        if (Array.isArray(keys) && keys.length > 0) {
            let profiles = [];
            keys.forEach((key) => {
                let attributes = storage.get(key);
                if (attributes !== undefined) {
                    // if (safeStorage.isEncryptionAvailable()) {
                    //     _.forIn(attributes, (value, key) => {
                    //         attributes[safeStorage.decryptString(Buffer.from(key, 'latin1'))] = safeStorage.decryptString(Buffer.from(value, 'latin1'))
                    //     })
                    // }
                    let profile = new this(attributes);
                    profiles.push(_.omit(profile, this.hidden));
                }
            });
            return profiles;
        }
        if (typeof keys === "string") {
            let attributes = storage.get(keys);
            if (attributes !== undefined) {
                // if (safeStorage.isEncryptionAvailable()) {
                //     _.forIn(attributes, (value, key) => {
                //         attributes[safeStorage.decryptString(Buffer.from(key, 'latin1'))] = safeStorage.decryptString(Buffer.from(value, 'latin1'))
                //     })
                // }

                return new this(_.omit(attributes, this.hidden));
            }
        }
    }

    static get_all() {
        let all = this.get_storage();
        let profiles = [];
        _.forIn(all.store, (profile) => {
            // if (safeStorage.isEncryptionAvailable()) {
            //     _.forIn(profile, (v, k) => {
            //         profile[safeStorage.decryptString(Buffer.from(k, 'latin1'))] = safeStorage.decryptString(Buffer.from(v, 'latin1'))
            //     })
            // }
            profiles.push(new this(_.omit(profile, this.hidden)));
        });
        return profiles;
    }

    static async get_os_info() {
        return {
            os: {
                type: os.type(),
                release: os.release(),
                platform: os.platform(),
            },
            cpu: os.cpus(),
            hash: (() => {
                let result = "";
                const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (let i = 0; i < 80; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
                return result;
            })(),
        };
    }

    static delete(keys) {
        let storage = this.get_storage();
        if (Array.isArray(keys) && keys.length > 0) {
            keys.forEach((key) => {
                storage.delete(key);
            });
        }
        if (typeof keys === "string") {
            storage.delete(keys);
        }
    }

    static delete_all() {
        this.get_storage().clear();
    }

    static get_storage(name) {
        let storage = name || this.storage_name;
        if (typeof this.storages[storage] === "undefined") {
            this.storages[storage] = new ElectronStore({
                name: storage,
                fileExtension: "dat",
                encryptionKey: "9kdl6Z8QD8aPEMyUK6LRBKZxzJatMZKAthRaiUEzBKZxzJatMZKAthRaiUEz" + storage,
            });
        }
        return this.storages[storage];
    }
}

module.exports = Store;
