const profile_model = require("./../models/profile");

// TODO maybe we need to move common methods to some parent class
class Profile {
    save(event, attributes) {
        let profile = new profile_model(attributes);
        return profile.save();
    }

    get(event, key) {
        let profile = profile_model.get(key);
        if (typeof profile === "undefined") {
            console.error(`Profile with id ${key} not found`);
        } else {
            return profile;
        }
    }

    get_all() {
        return profile_model.get_all();
    }

    get_os_info() {
        return profile_model.get_os_info();
    }

    delete(event, key) {
        profile_model.delete(key);
    }

    delete_all() {
        profile_model.delete_all();
    }

    update(event, key, attributes) {
        let profile = profile_model.get(key);
        if (typeof profile === "undefined") {
            console.error(`Profile with id ${key} not found`);
        } else {
            profile.update(attributes);
        }
    }

    execute(event, key) {
        let model = profile_model.get(key);
        if (model === undefined) {
            throw `Profile with key ${key} doesn't exists`;
        }

        model.execute();
    }

    close(event, key) {
        let profile = profile_model.get(key);
        if (typeof profile === "undefined") {
            console.error(`Profile with id ${key} not found`);
        } else {
            profile.close();
        }
    }
}

module.exports = new Profile();
