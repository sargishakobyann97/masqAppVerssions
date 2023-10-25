module.exports = {
    packagerConfig: {
        name: "MASQ Panel",
        appVersion: "1.0.0",
        icon: "./icons/masq-panel.ico",
        extendInfo: {
            CFBundleIdentifier: "com.masqad.panel-app",
        },
        asar: true,
        junk: true,
        ignore: [
            ".git",
            ".idea",
            "src/front/node_modules",
            "src/front/public",
            "src/front/src",
            "src/front/.env",
            "src/front/.gitignore",
            "src/front/package.json",
            "src/front/package-lock.json",
            "src/front/README.md",
        ],
        osxSign: {
            type: "development",
            identity: process.env.IDENTITY,
            gatekeeperAssess: false,
            hardenedRuntime: true,
        },
        osxNotarize: {
            appBundleId: process.env.APP_BUNDLE_ID,
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_ID_PASSWORD,
        },
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            platforms: ["win32"],
            config: {
                name: "MASQPanel",
                setupIcon: "./icons/disk.ico",
            },
        },
        {
            name: "@electron-forge/maker-dmg",
            platforms: ["darwin"],
            config: {
                name: "MASQ Panel",
                overwrite: true,
                icon: "./icons/disk.icns",
            },
        },
    ],
};
