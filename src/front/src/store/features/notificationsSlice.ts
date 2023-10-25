import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    AcceptShareAsyncTypes,
    NotificationsInitialStateTypes,
    NotificationsTypes,
    ReadNotificationAsyncTypes,
    TokenDeviceInfoHashTypes,
    UseInviteCodeAsyncTypes,
} from "../../types";
import { constants } from "../../assets/constants";
import { showNotifyRedux } from "./notifySlice";
import { changeAccountInfoRedux } from "./accountSlice";
import { t } from "i18next";
import { changeProfilesCustomData } from "./profilesSlice";

const {
    endpoints,
    notifyTypes: { error, success },
    notificationTypes: { invite, share_profile, share_profile_folder },
} = constants;

export const getAllNotificationsAsync = createAsyncThunk(
    "notifications/getAllNotificationsAsync",
    async ({ token, deviceInfo, hash }: TokenDeviceInfoHashTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getAllNotifications, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
            },
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return data;
    }
);

export const readAllNotificationsAsync = createAsyncThunk(
    "notifications/readAllNotificationsAsync",
    async ({ token, deviceInfo, hash }: TokenDeviceInfoHashTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.readAllNotifications, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
            },
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return data;
    }
);

export const inviteCodeUseAsync = createAsyncThunk(
    "notifications/inviteCodeUseAsync",
    async ({ token, deviceInfo, hash, code, teamName }: UseInviteCodeAsyncTypes, { dispatch }) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.useInviteCode + code, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
            },
        });
        const data = await response.json();
        if (data.message) {
            dispatch(showNotifyRedux({ type: "#560BAD", title: data.message }));
            throw new Error(data.message);
        }
        dispatch(changeAccountInfoRedux(data));
        dispatch(showNotifyRedux({ type: success, title: t("sundry.success"), subTitle: t("event_modals.joined_the_team") + teamName }));
        return code;
    }
);

export const acceptShareAsync = createAsyncThunk(
    "notifications/acceptShareAsync",
    async ({ token, deviceInfo, hash, id, acceptType }: AcceptShareAsyncTypes, { dispatch }) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.acceptShare + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
            },
        });
        const data = await response.json();
        if (data.message) {
            dispatch(showNotifyRedux({ type: error, title: data.message }));
            throw new Error(data.message);
        }
        if (acceptType === share_profile_folder) {
            dispatch(changeProfilesCustomData(data));
        }
        dispatch(showNotifyRedux({ type: success, title: t("sundry.success") }));
        return id;
    }
);

export const readNotificationAsync = createAsyncThunk(
    "notifications/readNotificationAsync",
    async ({ token, deviceInfo, hash, ids }: ReadNotificationAsyncTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.readNotification, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({ ids }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return ids;
    }
);

const initialState: NotificationsInitialStateTypes = {
    notificationsLoading: false,
    isUnread: false,
    notificationsList: [],
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        resetNotificationsStateToInitialRedux(state) {
            state.notificationsLoading = initialState.notificationsLoading;
            state.isUnread = initialState.isUnread;
            state.notificationsList = initialState.notificationsList;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllNotificationsAsync.fulfilled, (state, action) => {
                state.notificationsLoading = false;
                state.isUnread = action.payload.some(
                    ({ isRead, type }: { isRead: boolean; type: string }) =>
                        !isRead && type !== invite && type !== share_profile && type !== share_profile_folder
                );
                state.notificationsList = action.payload.sort(
                    (a: NotificationsTypes, b: NotificationsTypes) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
                );
            })
            .addCase(getAllNotificationsAsync.rejected, (state, action) => {
                state.notificationsLoading = false;
            })
            .addCase(readAllNotificationsAsync.pending, (state) => {
                state.notificationsLoading = true;
            })
            .addCase(readAllNotificationsAsync.fulfilled, (state, action) => {
                state.notificationsLoading = false;
                state.isUnread = false;
                state.notificationsList = JSON.parse(JSON.stringify(state.notificationsList).replaceAll(`"isRead":false`, `"isRead": true`)) || [];
            })
            .addCase(readAllNotificationsAsync.rejected, (state) => {
                state.notificationsLoading = false;
            })
            .addCase(readNotificationAsync.pending, (state) => {
                state.notificationsLoading = true;
            })
            .addCase(readNotificationAsync.fulfilled, (state, action) => {
                state.notificationsLoading = false;
                const newList = state.notificationsList.map((notify) => {
                    if (action.payload.some((el) => el === notify._id)) notify.isRead = true;
                    return notify;
                });
                const sortedList = newList.sort((a: NotificationsTypes, b: NotificationsTypes) => {
                    return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
                });
                state.isUnread = JSON.stringify(sortedList).includes(`"isRead":false`);
                state.notificationsList = sortedList;
            })
            .addCase(readNotificationAsync.rejected, (state) => {
                state.notificationsLoading = false;
            })
            .addCase(inviteCodeUseAsync.pending, (state) => {
                state.notificationsLoading = true;
            })
            .addCase(inviteCodeUseAsync.fulfilled, (state, action) => {
                state.notificationsLoading = false;
                state.notificationsList = state.notificationsList.filter((el) => el.code !== action.payload);
                state.isUnread = state.notificationsList.reduce((unread, n) => {
                    if ([invite, share_profile, share_profile_folder].some((e) => e !== n.type) && !n.isRead) unread = true;
                    return unread;
                }, false);
            })
            .addCase(inviteCodeUseAsync.rejected, (state) => {
                state.notificationsLoading = false;
            })
            .addCase(acceptShareAsync.pending, (state) => {
                state.notificationsLoading = true;
            })
            .addCase(acceptShareAsync.fulfilled, (state, action) => {
                state.notificationsLoading = false;
                state.notificationsList = state.notificationsList.filter((el) => el.id !== action.payload);
                state.isUnread = state.notificationsList.reduce((unread, n) => {
                    if ([invite, share_profile, share_profile_folder].some((e) => e === n.type) || !n.isRead) unread = true;
                    return unread;
                }, false);
            })
            .addCase(acceptShareAsync.rejected, (state) => {
                state.notificationsLoading = false;
            });
    },
});

export const { resetNotificationsStateToInitialRedux } = notificationsSlice.actions;

export default notificationsSlice.reducer;
