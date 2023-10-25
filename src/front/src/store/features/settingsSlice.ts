import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    ChangeNameAsyncTypes,
    ChangePasswordAsyncTypes,
    ConfirmCurrentEmailTypes,
    ConfirmNewEmailAsyncTypes,
    DeleteAccountAsyncTypes,
    SetNewEmailAsyncTypes,
    SettingsSliceTypes,
    TokenDeviceInfoHashTypes,
} from "../../types";
import { constants } from "../../assets/constants";
import { resetEventsModalStateToInitialRedux, setEventsMessageRedux } from "./eventsModalSlice";
import { changeEmailRedux, changeNameRedux, changePasswordRedux, resetAccountStateToInitialRedux } from "./accountSlice";
import { resetMainStateToInitialRedux } from "./mainSlice";
import { resetNotificationsStateToInitialRedux } from "./notificationsSlice";
import { resetProfilesStateToInitialRedux } from "./profilesSlice";
import { resetSignUpStateToInitialRedux } from "./signUpSlice";
import { resetHelperModalStateToInitialRedux } from "./helperModalSlice";

const { endpoints, eventsMsg } = constants;

export const removeOtherSessionAsync = createAsyncThunk(
    "settings/removeOtherSessionAsync",
    async ({ token, hash, deviceInfo }: TokenDeviceInfoHashTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.removeOtherSessions, {
            method: "GET",
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
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return data;
    }
);

export const changeNameAsync = createAsyncThunk(
    "settings/changeNameAsync",
    async ({ deviceInfo, token, hash, name }: ChangeNameAsyncTypes, { dispatch }) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.changeName, {
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
            body: JSON.stringify({
                name,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        dispatch(changeNameRedux({ data }));
        return data;
    }
);

export const changePasswordAsync = createAsyncThunk(
    "settings/changePasswordAsync",
    async ({ token, hash, deviceInfo, oldPassword, newPassword }: ChangePasswordAsyncTypes, { dispatch }) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.changePassword, {
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
            body: JSON.stringify({
                oldPassword,
                newPassword,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        dispatch(
            setEventsMessageRedux({
                type: eventsMsg.types.passwordChangeSuccess,
                header: eventsMsg.headers.success,
                message: eventsMsg.messages.haveNewPassword,
            })
        );
        dispatch(changePasswordRedux(data));
        return data;
    }
);

export const changeEmailSendConfirmCodeAsync = createAsyncThunk(
    "settings/changeEmailSendConfirmCodeAsync",
    async ({ deviceInfo, token, hash }: TokenDeviceInfoHashTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.changeEmailSendConfirmCode, {
            method: "GET",
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
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return data;
    }
);

export const confirmCurrentEmailAsync = createAsyncThunk(
    "settings/confirmCurrentEmailAsync",
    async ({ deviceInfo, token, hash, currentEmailConfirmCode }: ConfirmCurrentEmailTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.confirmCurrentEmail + currentEmailConfirmCode, {
            method: "GET",
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
        });
        const data = await response.json();
        if (data.message || data.error) throw new Error(data.message || data.error);
        return data;
    }
);

export const setNewEmailAsync = createAsyncThunk(
    "settings/setNewEmailAsync",
    async ({ token, hash, deviceInfo, email, password }: SetNewEmailAsyncTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.setNewEmail, {
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
            body: JSON.stringify({
                email,
                password,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return data;
    }
);

export const confirmNewEmailAsync = createAsyncThunk(
    "settings/confirmNewEmailAsync",
    async ({ deviceInfo, token, hash, newEmailConfirmCode, email, fn }: ConfirmNewEmailAsyncTypes, { dispatch }) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.confirmNewEmail + newEmailConfirmCode, {
            method: "GET",
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
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        dispatch(changeEmailRedux(email));
        fn();
        return data;
    }
);

export const deleteAccountAsync = createAsyncThunk(
    "settings/deleteAccountAsync",
    async ({ token, hash, deviceInfo, password }: DeleteAccountAsyncTypes, { dispatch }) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.deleteAccount, {
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
            body: JSON.stringify({
                password,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        dispatch(resetAccountStateToInitialRedux());
        dispatch(resetEventsModalStateToInitialRedux());
        dispatch(resetMainStateToInitialRedux());
        dispatch(resetNotificationsStateToInitialRedux());
        dispatch(resetProfilesStateToInitialRedux());
        dispatch(resetSettingsStateToInitialRedux());
        dispatch(resetSignUpStateToInitialRedux());
        dispatch(resetHelperModalStateToInitialRedux());
        return data;
    }
);

const initialState: SettingsSliceTypes = {
    settingsLoading: false,
    passwordStatus: "",
    currentEmailConfirmCodeSent: false,
    isConfirmCodeValid: false,
    isConfirmCodeInvalid: false,
    confirmCodeSent: false,
    sidebarMenuStyle: "long",
    nameError: "",
    nameSaved: false,
    isPasswordForDeleteAccountIncorrect: false,
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        changeSidebarMenuStyleRedux(state, action) {
            state.sidebarMenuStyle = action.payload ? "short" : "long";
        },
        resetPasswordStatusRedux(state) {
            state.passwordStatus = "";
        },
        resetByDefaultSettingsRedux(state) {
            state.passwordStatus = "";
            state.confirmCodeSent = false;
            state.currentEmailConfirmCodeSent = false;
            state.isConfirmCodeValid = false;
            state.isConfirmCodeInvalid = false;
            state.isPasswordForDeleteAccountIncorrect = false;
        },
        resetNameErrorRedux(state) {
            state.nameError = "";
        },
        resetInvalidConfirmCodeRedux(state) {
            state.isConfirmCodeInvalid = false;
        },
        resetSettingsStateToInitialRedux(state) {
            state = initialState;
        },
        resetPasswordForDeleteError(state) {
            state.isPasswordForDeleteAccountIncorrect = false;
        },
        resetNameSaved(state) {
            state.nameSaved = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(removeOtherSessionAsync.pending, (state) => {
                state.settingsLoading = true;
            })
            .addCase(removeOtherSessionAsync.fulfilled, (state) => {
                state.settingsLoading = false;
                localStorage.removeItem("hash");
            })
            .addCase(removeOtherSessionAsync.rejected, (state) => {
                state.settingsLoading = false;
            })
            .addCase(changePasswordAsync.pending, (state) => {
                state.settingsLoading = true;
            })
            .addCase(changePasswordAsync.fulfilled, (state) => {
                state.settingsLoading = false;
            })
            .addCase(changePasswordAsync.rejected, (state, action) => {
                state.settingsLoading = false;
                state.passwordStatus = action.error.message + "";
            })
            .addCase(changeNameAsync.pending, (state) => {
                state.settingsLoading = true;
            })
            .addCase(changeNameAsync.fulfilled, (state, action) => {
                state.settingsLoading = false;
                state.nameError = "";
                state.nameSaved = true;
            })
            .addCase(changeNameAsync.rejected, (state, action) => {
                state.settingsLoading = false;
                state.nameError = action.error.message || "";
            })
            .addCase(changeEmailSendConfirmCodeAsync.pending, (state) => {
                state.settingsLoading = true;
            })
            .addCase(changeEmailSendConfirmCodeAsync.fulfilled, (state) => {
                state.settingsLoading = false;
                state.currentEmailConfirmCodeSent = true;
            })
            .addCase(changeEmailSendConfirmCodeAsync.rejected, (state) => {
                state.settingsLoading = false;
            })
            .addCase(confirmCurrentEmailAsync.pending, (state) => {
                state.settingsLoading = true;
            })
            .addCase(confirmCurrentEmailAsync.fulfilled, (state) => {
                state.settingsLoading = false;
                state.isConfirmCodeValid = true;
            })
            .addCase(confirmCurrentEmailAsync.rejected, (state) => {
                state.settingsLoading = false;
                state.isConfirmCodeInvalid = true;
            })
            .addCase(setNewEmailAsync.pending, (state) => {
                state.settingsLoading = true;
            })
            .addCase(setNewEmailAsync.fulfilled, (state) => {
                state.settingsLoading = false;
                state.confirmCodeSent = true;
            })
            .addCase(setNewEmailAsync.rejected, (state, action) => {
                state.settingsLoading = false;
                state.passwordStatus = action.error.message + "";
            })
            .addCase(confirmNewEmailAsync.pending, (state) => {
                state.settingsLoading = true;
            })
            .addCase(confirmNewEmailAsync.fulfilled, (state) => {
                state.settingsLoading = false;
                state.isConfirmCodeInvalid = false;
            })
            .addCase(confirmNewEmailAsync.rejected, (state) => {
                state.settingsLoading = false;
                state.isConfirmCodeInvalid = true;
            })
            .addCase(deleteAccountAsync.pending, (state) => {
                state.settingsLoading = true;
            })
            .addCase(deleteAccountAsync.fulfilled, (state) => {
                state.settingsLoading = false;
                state.isPasswordForDeleteAccountIncorrect = false;
                localStorage.removeItem("hash");
                localStorage.removeItem("token");
            })
            .addCase(deleteAccountAsync.rejected, (state) => {
                state.settingsLoading = false;
                state.isPasswordForDeleteAccountIncorrect = true;
            });
    },
});

export const {
    changeSidebarMenuStyleRedux,
    resetPasswordStatusRedux,
    resetByDefaultSettingsRedux,
    resetInvalidConfirmCodeRedux,
    resetNameErrorRedux,
    resetSettingsStateToInitialRedux,
    resetPasswordForDeleteError,
    resetNameSaved,
} = settingsSlice.actions;

export default settingsSlice.reducer;
