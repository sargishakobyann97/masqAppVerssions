// Typescript checking was disabled due to windows.api

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    AppSettingsTypes,
    DeviceInfoTypes,
    ExportProfileOrCookiesAsyncTypes,
    ExportProfilesAsyncTypes,
    GetNotificationsSettingsAsyncTypes,
    GetOneProfileTypes,
    InitialNotificationsSettingsTypes,
    MainInitialStateTypes,
    SendInviteCodeAsyncTypes,
    SetAppSettingsAsyncTypes,
    SetNotificationsSettingsAsyncTypes,
    TokenDeviceInfoHashTypes,
} from "../../types";
import { constants } from "../../assets/constants";
import { showNotifyRedux } from "./notifySlice";
import _ from "lodash";
import { t } from "i18next";
import { resetHelperModalTypeRedux, setHelperModalTypeRedux } from "./helperModalSlice";

const {
    endpoints,
    notifyTypes: { error, success, invite },
    helperModalTypes: { foundLocalProfiles },
    appVersionStatusTypes,
} = constants;

export const getDeviceInfoAsync = createAsyncThunk("main/getDeviceInfoAsync", async () => {
    /// @ts-ignore
    const deviceInfoData = await window.api.profile.get_os_info();
    return deviceInfoData;
});

export const getLocalProfilesAsync = createAsyncThunk(
    "main/getLocalProfilesAsync",
    async ({ clickedFromSettings }: { clickedFromSettings: boolean }, { dispatch }) => {
        /// @ts-ignore
        const localProfilesData = await window.api.profile.get_all();
        const finalData = localProfilesData.filter((item: { cookies: string | {} }) => typeof item.cookies === "object");
        if (finalData.length) {
            dispatch(setHelperModalTypeRedux({ type: foundLocalProfiles }));
        } else if (!finalData.length && clickedFromSettings) {
            dispatch(showNotifyRedux({ type: invite, title: t("notifyMessages.there_is_not_local_profiles") }));
        }
        return finalData;
    }
);

export const getTariffListAsync = createAsyncThunk("account/getTariffListAsync", async ({ deviceInfo, token, hash }: TokenDeviceInfoHashTypes) => {
    const response = await fetch(process.env.REACT_APP_API_URL + endpoints.tariffList, {
        method: "GET",
        credentials: "same-origin",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
            os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
            cpu: deviceInfo.cpu[0].model,
            app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
            hash: hash,
        },
    });
    const data = await response.json();
    if (data.message) throw new Error(data.message);
    return data;
});

export const getAppSettingsAsync = createAsyncThunk("main/getAppSettingsAsync", async ({ deviceInfo, token, hash }: TokenDeviceInfoHashTypes) => {
    const response = await fetch(process.env.REACT_APP_API_URL + endpoints.appSettings, {
        method: "GET",
        headers: {
            Authorization: token,
            os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
            cpu: deviceInfo.cpu[0].model,
            app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
            hash: hash,
        },
    });
    const data = await response.json();
    if (data.message) throw new Error(data.message);
    const finalData: AppSettingsTypes = data;
    return finalData;
});

export const sendInviteCodeAsync = createAsyncThunk(
    "main/sendInviteCodeAsync",
    async ({ deviceInfo, token, hash, userName, team }: SendInviteCodeAsyncTypes, { dispatch }) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.sendInviteCode + userName, {
            method: "GET",
            headers: {
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
                team,
            },
        });
        const data = await response.json();
        if (data.message) {
            dispatch(showNotifyRedux({ type: error, title: data.message }));
            throw new Error(data.message);
        }
        dispatch(showNotifyRedux({ type: success, title: t("event_modals.success"), subTitle: t("account.teams.invite_success") }));

        return data;
    }
);

export const setAppSettingsAsync = createAsyncThunk(
    "main/setAppSettingsAsync",
    async ({ token, deviceInfo, hash, appSettings }: SetAppSettingsAsyncTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.appSettings, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(appSettings),
        });
        const data = await response.json();
        if (data.message || data.error) throw new Error(data.message || data.error);
        return data;
    }
);

export const getNotificationsSettingsAsync = createAsyncThunk(
    "main/getNotificationsSettingsAsync",
    async ({ deviceInfo, token, hash }: GetNotificationsSettingsAsyncTypes) => {
        const appFetch = fetch(process.env.REACT_APP_API_URL + endpoints.notificationsSettings + "app", {
            method: "GET",
            headers: {
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
            },
        });

        const emailFetch = fetch(process.env.REACT_APP_API_URL + endpoints.notificationsSettings + "email", {
            method: "GET",
            headers: {
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
            },
        });

        const [appResponse, emailResponse] = await Promise.all([appFetch, emailFetch]);

        const [appData, emailData] = await Promise.all([appResponse.json(), emailResponse.json()]);

        if (!appResponse.ok || !emailResponse.ok) throw new Error(appData.message || emailData.message);
        return { appData, emailData };
    }
);

export const setNotificationsSettingsAsync = createAsyncThunk(
    "main/setNotificationsSettingsAsync",
    async ({ token, deviceInfo, hash, receiverType, notificationsSettings }: SetNotificationsSettingsAsyncTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.notificationsSettings + receiverType, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(notificationsSettings),
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || data.error);
        return { type: receiverType, data };
    }
);

export const exportProfileOrCookiesAsync = createAsyncThunk(
    "main/exportProfileOrCookiesAsync",
    async ({ deviceInfo, token, hash, teamInfo, profileId, exportType }: ExportProfileOrCookiesAsyncTypes) => {
        const { teamId } = teamInfo;

        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getProfile + profileId + `${teamId && "?team=true"}`, {
            method: "GET",
            headers: {
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
                team: teamId,
            },
        });
        const data = await response.json();
        if (data.message) {
            throw new Error(data.message);
        }
        let file = data;
        let fileName = data.info.name;
        if (exportType === "cookies") {
            file = data.info.cookies;
            fileName += " cookies";
        }
        const element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify([file])));
        element.setAttribute("download", fileName);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return data;
    }
);

export const exportProfilesAsync = createAsyncThunk(
    "main/exportProfilesAsync",
    async ({ deviceInfo, token, hash, teamInfo, profileIds }: ExportProfilesAsyncTypes, { dispatch }) => {
        const { teamId } = teamInfo;
        let allProfiles: GetOneProfileTypes[] = [];
        await Promise.all(
            profileIds.map(async (profileId) => {
                const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getProfile + profileId + `${teamId && "?team=true"}`, {
                    method: "GET",
                    headers: {
                        Authorization: token,
                        os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                        cpu: deviceInfo.cpu[0].model,
                        app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                        hash: hash,
                        team: teamId,
                    },
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
        ).then((resp) => {
            allProfiles = resp;
        });

        let file = allProfiles;
        const element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(file)));
        element.setAttribute("download", "Exported profiles");
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        // dispatch(showNotifyRedux({ type: success, title: t("helper_modal.profiles_exported_successfully") }));
        dispatch(resetHelperModalTypeRedux());
        return allProfiles;
    }
);

export const getAppVersionAsync = createAsyncThunk("main/getAppVersionAsync", async (_, { dispatch }) => {
    const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getAppVersion);
    const data = await response.json();

    if (data.message) {
        dispatch(showNotifyRedux({ type: error, title: data.message }));
        throw new Error(data.message);
    }
    return data;
});

const initialNotificationsSettings: InitialNotificationsSettingsTypes = {
    all: false,
    message: false,
    invite: false,
    share_profile: false,
    share_profile_folder: false,
    update: false,
    subscription: false,
    marketing: false,
    gifts: false,
    news: false,
};

const initialState: MainInitialStateTypes = {
    mainLoading: false,
    appVersion: "",
    appVersionStatus: appVersionStatusTypes.checking,
    tariffList: [],
    localProfiles: [],
    deviceInfo: {
        os: {
            type: "",
            release: "",
            platform: "",
        },
        cpu: [
            {
                model: "",
                speed: NaN,
                times: {
                    user: NaN,
                    nice: NaN,
                    sys: NaN,
                    idle: NaN,
                    irq: NaN,
                },
            },
        ],
        hash: "",
    },
    appSettings: {
        currency: "",
        sidebar: {
            home: false,
            profiles: true,
            proxy: false,
            account: true,
            cookies: false,
            store: false,
            notifications: false,
            settings: true,
        },
        sidebarOder: [],
        sidebarMenuStyle: "",
        defaultScreen: "",
        language: "",
        createAt: 0,
    },
    emailNotificationsSettings: initialNotificationsSettings,
    appNotificationsSettings: initialNotificationsSettings,
};

const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        resetMainStateToInitialRedux(state) {
            state.mainLoading = initialState.mainLoading;
            state.tariffList = initialState.tariffList;
            state.appSettings = initialState.appSettings;
            state.emailNotificationsSettings = initialState.emailNotificationsSettings;
            state.appNotificationsSettings = initialState.appNotificationsSettings;
            state.localProfiles = initialState.localProfiles;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDeviceInfoAsync.fulfilled, (state, action) => {
                state.deviceInfo = action.payload;
            })
            .addCase(getLocalProfilesAsync.fulfilled, (state, action) => {
                state.localProfiles = action.payload;
            })
            .addCase(getAppSettingsAsync.pending, (state) => {
                state.mainLoading = true;
            })
            .addCase(getAppSettingsAsync.fulfilled, (state, action) => {
                const disabledSidebarItems = ["proxy", "cookies", "store", "home"];
                state.mainLoading = false;
                state.appSettings = action.payload;
                state.appSettings.sidebarMenuStyle = state.appSettings.sidebarMenuStyle || "long";
                state.appSettings.defaultScreen = state.appSettings.defaultScreen || "account";
                state.appSettings.language = state.appSettings.language || "en";
                state.appSettings.currency = state.appSettings.currency || "usd";
                state.appSettings.sidebarOder = action.payload.sidebarOder.filter((item) => !disabledSidebarItems.some((el) => el === item));
            })
            .addCase(getAppSettingsAsync.rejected, (state, action) => {
                state.mainLoading = false;
            })
            .addCase(setAppSettingsAsync.pending, (state) => {
                state.mainLoading = true;
            })
            .addCase(setAppSettingsAsync.fulfilled, (state, action) => {
                state.mainLoading = false;
                state.appSettings = action.payload;
            })
            .addCase(setAppSettingsAsync.rejected, (state, action) => {
                state.mainLoading = false;
                state.appSettings = _.cloneDeep(state.appSettings);
            })
            .addCase(getNotificationsSettingsAsync.pending, (state) => {
                state.mainLoading = true;
            })
            .addCase(getNotificationsSettingsAsync.fulfilled, (state, action) => {
                state.mainLoading = false;
                state.appNotificationsSettings = action.payload.appData;
                state.emailNotificationsSettings = action.payload.emailData;
            })
            .addCase(getNotificationsSettingsAsync.rejected, (state, action) => {
                state.mainLoading = false;
            })
            .addCase(setNotificationsSettingsAsync.pending, (state) => {
                state.mainLoading = true;
            })
            .addCase(setNotificationsSettingsAsync.fulfilled, (state, action) => {
                state.mainLoading = false;
                action.payload.type === "app"
                    ? (state.appNotificationsSettings = action.payload.data)
                    : (state.emailNotificationsSettings = action.payload.data);
            })
            .addCase(setNotificationsSettingsAsync.rejected, (state, action) => {
                state.mainLoading = false;
            })
            .addCase(getTariffListAsync.pending, (state) => {
                state.mainLoading = true;
            })
            .addCase(getTariffListAsync.fulfilled, (state, action) => {
                state.mainLoading = false;
                state.tariffList = action.payload;
            })
            .addCase(getTariffListAsync.rejected, (state) => {
                state.mainLoading = false;
            })
            .addCase(sendInviteCodeAsync.pending, (state) => {
                state.mainLoading = true;
            })
            .addCase(sendInviteCodeAsync.fulfilled, (state, action) => {
                state.mainLoading = false;
            })
            .addCase(sendInviteCodeAsync.rejected, (state) => {
                state.mainLoading = false;
            })
            .addCase(exportProfileOrCookiesAsync.pending, (state) => {
                state.mainLoading = true;
            })
            .addCase(exportProfileOrCookiesAsync.fulfilled, (state, action) => {
                state.mainLoading = false;
            })
            .addCase(exportProfileOrCookiesAsync.rejected, (state) => {
                state.mainLoading = false;
            })
            .addCase(getAppVersionAsync.fulfilled, (state, action) => {
                if (process.env.REACT_APP_APP_VERSION === action.payload.version || action.payload.version === "no check") {
                    state.appVersionStatus = appVersionStatusTypes.valid;
                } else {
                    state.appVersionStatus = appVersionStatusTypes.invalid;
                    state.appVersion = action.payload.version;
                }
                state.appVersion = action.payload.version;
            })
            .addCase(getAppVersionAsync.rejected, (state) => {
                state.appVersionStatus = appVersionStatusTypes.invalid;
            })
            .addCase(exportProfilesAsync.pending, (state) => {
                state.mainLoading = true;
            })
            .addCase(exportProfilesAsync.fulfilled, (state, action) => {
                state.mainLoading = false;
            })
            .addCase(exportProfilesAsync.rejected, (state) => {
                state.mainLoading = false;
            });
    },
});

export const { resetMainStateToInitialRedux } = mainSlice.actions;
export default mainSlice.reducer;
