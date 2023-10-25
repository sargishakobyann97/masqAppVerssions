const profile = require("./../api/profile");

/*
    type: 'on' - Only unidirectional communication method. It only sends data and does not wait for a response.
    type: 'handle' - Bidirectional communication method. It sends data and wait for a response.
*/
exports.routes = [
    {
        name: "profile:save",
        handler: profile.save,
        type: "handle",
    },
    {
        name: "profile:get",
        handler: profile.get,
        type: "handle",
    },
    {
        name: "profile:get_all",
        handler: profile.get_all,
        type: "handle",
    },
    {
        name: "profile:get_os_info",
        handler: profile.get_os_info,
        type: "handle",
    },
    {
        name: "profile:delete",
        handler: profile.delete,
        type: "on",
    },
    {
        name: "profile:delete_all",
        handler: profile.delete_all,
        type: "on",
    },
    {
        name: "profile:update",
        handler: profile.update,
        type: "on",
    },
    {
        name: "profile:execute",
        handler: profile.execute,
        type: "on",
    },
    {
        name: "profile:close",
        handler: profile.close,
        type: "on",
    },
];
