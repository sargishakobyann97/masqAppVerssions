// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    profile: {
        save: (attributes) => ipcRenderer.invoke("profile:save", attributes),
        get: (key) => ipcRenderer.invoke("profile:get", key),
        get_all: () => ipcRenderer.invoke("profile:get_all"),
        get_os_info: () => ipcRenderer.invoke("profile:get_os_info"),
        delete: (keys) => ipcRenderer.send("profile:delete", keys),
        delete_all: () => ipcRenderer.send("profile:delete_all"),
        update: (key, attributes) => ipcRenderer.send("profile:update", key, attributes),
        execute: (key) => ipcRenderer.send("profile:execute", key),
        close: (key) => ipcRenderer.send("profile:close", key),

        events: (channel, listener) => ipcRenderer.on(`profile:${channel}`, (event, ...args) => listener(...args)),
    },
    panel: {
        events: (channel, listener) => ipcRenderer.on(`panel:${channel}`, (event, ...args) => listener(...args)),
    },
});
