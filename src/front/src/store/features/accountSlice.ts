import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { constants } from "../../assets/constants";
import {
    AccountInitialStateTypes,
    BuySubscriptionPlanAsyncTypes,
    ChangeRoleAsyncTypes,
    ChangeTariffAsyncTypes,
    ChangeTeamNameAsyncTypes,
    CheckPromoCodeAsyncTypes,
    CheckRecoveryCodeAsyncTypes,
    ConfirmEmailAsyncTypes,
    DeleteManageTeamItemAsyncTypes,
    GetManageTeamsInfoAsyncTypes,
    GetMemberSessionsAsyncTypes,
    LeaveFromTeamAsyncTypes,
    LoginAsyncTypes,
    NameDeviceInfoTypes,
    PaymentsAsyncAsync,
    PaymentsTariffAsyncAsync,
    RecoveryPasswordAsyncTypes,
    RemoveSessionAsyncTypes,
    SetInvitesAccessAsyncTypes,
    TokenDeviceInfoHashTypes,
    TokenDeviceInfoTypes,
    VerifyTwoFactorAuthenticationAsyncTypes,
} from "../../types";
import { resetEventsModalStateToInitialRedux, setEventsMessageRedux } from "./eventsModalSlice";
import { resetMainStateToInitialRedux } from "./mainSlice";
import { resetNotificationsStateToInitialRedux } from "./notificationsSlice";
import { resetProfilesStateToInitialRedux } from "./profilesSlice";
import { resetSettingsStateToInitialRedux } from "./settingsSlice";
import { resetSignUpStateToInitialRedux } from "./signUpSlice";
import { resetHelperModalStateToInitialRedux } from "./helperModalSlice";
import { showNotifyRedux } from "./notifySlice";
import { t } from "i18next";
import _ from "lodash";

const {
    endpoints,
    eventsMsg,
    bearer,
    create_new_team,
    notifyTypes: { error, success, invite },
} = constants;

export const loginAsync = createAsyncThunk(
    "account/loginAsync",
    async ({ formData: { name, password, isSigned }, deviceInfo, tfaToken }: LoginAsyncTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.userLogin, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: deviceInfo.hash,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                name,
                password,
                tfaToken,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        data.isSigned = isSigned;
        data.hash = deviceInfo.hash;
        return data;
    }
);

export const logOutAsync = createAsyncThunk("account/logOutAsync", async ({ token, deviceInfo, hash }: TokenDeviceInfoHashTypes, { dispatch }) => {
    const response = await fetch(process.env.REACT_APP_API_URL + endpoints.logOut, {
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
    dispatch(resetAccountStateToInitialRedux());
    dispatch(resetEventsModalStateToInitialRedux());
    dispatch(resetMainStateToInitialRedux());
    dispatch(resetNotificationsStateToInitialRedux());
    dispatch(resetProfilesStateToInitialRedux());
    dispatch(resetSettingsStateToInitialRedux());
    dispatch(resetSignUpStateToInitialRedux());
    return data;
});

export const loginByTokenAsync = createAsyncThunk("account/loginByTokenAsync", async ({ token, deviceInfo }: TokenDeviceInfoTypes) => {
    const hash: string = localStorage.getItem("hash") || "";
    const response = await fetch(process.env.REACT_APP_API_URL + endpoints.userAuth, {
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
    data.token = token;
    data.hash = hash;
    return data;
});

export const confirmEmailAsync = createAsyncThunk("account/confirmEmailAsync", async ({ confirmCode, deviceInfo }: ConfirmEmailAsyncTypes) => {
    const response = await fetch(process.env.REACT_APP_API_URL + endpoints.confirmEmail + confirmCode, {
        method: "GET",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
            cpu: deviceInfo.cpu[0].model,
            app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
            hash: deviceInfo.hash,
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    });
    const data = await response.json();
    if (data.message) throw new Error(data.message);
    data.hash = deviceInfo.hash;
    return data;
});

export const removeSessionAsync = createAsyncThunk(
    "account/removeSessionAsync",
    async ({ token, deviceInfo, hashToDelete, myHash }: RemoveSessionAsyncTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.removeSession, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: myHash,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                hash: hashToDelete,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return data;
    }
);

export const getSessionsAsync = createAsyncThunk("account/getSessionsAsync", async ({ deviceInfo, token, hash }: TokenDeviceInfoHashTypes) => {
    const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getSessions, {
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
    return data;
});

export const sendRecoveryCodeAsync = createAsyncThunk("account/sendRecoveryCodeAsync", async ({ deviceInfo, name }: NameDeviceInfoTypes) => {
    const response = await fetch(process.env.REACT_APP_API_URL + endpoints.sendRecoveryCode, {
        method: "POST",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
            cpu: deviceInfo.cpu[0].model,
            app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
            hash: deviceInfo.hash,
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            name,
        }),
    });
    const data = await response.json();
    if (data.message) throw new Error(data.message);
    return data;
});

export const checkRecoveryCodeAsync = createAsyncThunk(
    "account/checkRecoveryCodeAsync",
    async ({ deviceInfo, name, recoveryCode }: CheckRecoveryCodeAsyncTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.checkRecoveryCode, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: deviceInfo.hash,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                name,
                recoveryCode,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return data;
    }
);

export const recoveryPasswordAsync = createAsyncThunk(
    "account/recoveryPasswordAsync",
    async ({ deviceInfo, name, recoveryCode, password, goToSignIn }: RecoveryPasswordAsyncTypes, { dispatch }) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.recoveryPassword, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: deviceInfo.hash,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                name,
                recoveryCode,
                password,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        goToSignIn && goToSignIn();
        dispatch(
            setEventsMessageRedux({
                type: eventsMsg.types.passwordChangeSuccess,
                header: eventsMsg.headers.success,
                message: eventsMsg.messages.haveNewPassword,
            })
        );
        dispatch(resetAccountStateToInitialRedux());
        return data;
    }
);

export const setInvitesAccessAsync = createAsyncThunk(
    "account/setInvitesAccessAsync",
    async ({ token, hash, deviceInfo, enable }: SetInvitesAccessAsyncTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.setInvitesAccess, {
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
                enable,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return enable;
    }
);

export const setupTwoFactorAuthenticationAsync = createAsyncThunk(
    "account/setupTwoFactorAuthenticationAsync",
    async ({ deviceInfo, token, hash }: TokenDeviceInfoHashTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.setupTfa, {
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
        if (!response.ok) throw new Error(data.message);
        return data;
    }
);

export const verifyTwoFactorAuthenticationAsync = createAsyncThunk(
    "account/verifyTwoFactorAuthenticationAsync",
    async ({ token, hash, deviceInfo, confirmCode, closeModalFn }: VerifyTwoFactorAuthenticationAsyncTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.verifyTfa, {
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
                token: confirmCode,
            }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        closeModalFn();
        return true;
    }
);

export const removeTwoFactorAuthenticationAsync = createAsyncThunk(
    "account/removeTwoFactorAuthenticationAsync",
    async ({ deviceInfo, token, hash }: TokenDeviceInfoHashTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.removeTfa, {
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
        if (!response.ok) throw new Error(data.message);
        return false;
    }
);

export const paymentsAsync = createAsyncThunk("account/paymentsAsync", async ({ deviceInfo, token, hash, price, currency }: PaymentsAsyncAsync) => {
    const response = await fetch(process.env.REACT_APP_API_URL + endpoints.payments + price + `${currency && "?currency=" + currency}`, {
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

export const paymentsTariffAsync = createAsyncThunk(
    "account/paymentsTariffAsync",
    async ({ deviceInfo, token, hash, tariffId, teamId, currency, promoCode }: PaymentsTariffAsyncAsync) => {
        const team = teamId !== create_new_team && teamId ? teamId : "";
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.paymentsTariff + tariffId + `${currency && "?currency=" + currency}`, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
                team,
            },
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return data;
    }
);

export const checkPromoCodeAsync = createAsyncThunk(
    "account/checkPromoCodeAsync",
    async ({ deviceInfo, token, hash, promocode }: CheckPromoCodeAsyncTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.promoCode + promocode, {
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
    }
);

export const buySubscriptionPlanAsync = createAsyncThunk(
    "account/buySubscriptionPlanAsync",
    async (
        { token, hash, deviceInfo, subId, isTeam, promoCode, closePaymentPageFn, renewTeamId, subName }: BuySubscriptionPlanAsyncTypes,
        { dispatch }
    ) => {
        const team = renewTeamId !== create_new_team && renewTeamId ? renewTeamId : "";
        const response = await fetch(
            process.env.REACT_APP_API_URL +
                endpoints.buySubscriptionPlan +
                (promoCode ? `?promoCode=${promoCode}` : "") +
                (isTeam ? "?team=true" : ""),
            {
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
                    team,
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify({
                    subId,
                }),
            }
        );
        const data = await response.json();
        if (data.message || data.error) throw new Error(data.message);
        closePaymentPageFn();
        dispatch(
            showNotifyRedux({
                type: invite,
                title: t("notifyMessages.subscription_has_been_activated"),
                subTitle: `${t("notifyMessages.now_you_have")} ${subName} ${t("notifyMessages.subscription_on_account")}`,
            })
        );
        return data;
    }
);

export const changeTariffAsync = createAsyncThunk(
    "account/changeTariffAsync",
    async ({ token, hash, deviceInfo, subId, tariffId, subName }: ChangeTariffAsyncTypes, { dispatch }) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.changeTariff, {
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
                subId,
                tariffId,
            }),
        });
        const data = await response.json();
        if (data.message || data.error) throw new Error(data.message);
        dispatch(resetHelperModalStateToInitialRedux());
        dispatch(
            showNotifyRedux({
                type: invite,
                title: t("notifyMessages.subscription_has_been_activated"),
                subTitle: `${t("notifyMessages.now_you_have")} ${subName} ${t("notifyMessages.subscription_on_account")}`,
            })
        );
        return data;
    }
);

export const changeTeamNameAsync = createAsyncThunk(
    "account/changeTeamNameAsync",
    async ({ token, hash, deviceInfo, teamId, newName }: ChangeTeamNameAsyncTypes, { dispatch }) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.changeTeamName, {
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
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                name: newName,
            }),
        });
        const data = await response.json();
        if (data.message || data.error) {
            dispatch(showNotifyRedux({ type: error, title: data.message || data.error }));
            throw new Error(data.message);
        }

        return data;
    }
);

export const getMemberSessionsAsync = createAsyncThunk(
    "account/getMemberSessionsAsync",
    async ({ deviceInfo, token, hash, team }: GetMemberSessionsAsyncTypes, { dispatch }) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getMemberSession, {
            method: "GET",
            headers: {
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team,
            },
        });
        const data = await response.json();
        if (data.message) {
            dispatch(showNotifyRedux({ type: error, title: data.message || data.error }));
            throw new Error(data.message);
        }
        return data;
    }
);

export const leaveFromTeamAsync = createAsyncThunk(
    "account/leaveFromTeamAsync",
    async ({ deviceInfo, token, hash, teamId }: LeaveFromTeamAsyncTypes, { dispatch }) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.leaveFromTeam + teamId, {
            method: "GET",
            headers: {
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
            },
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        dispatch(resetHelperModalStateToInitialRedux());
        return data;
    }
);

export const getManageTeamsInfoAsync = createAsyncThunk(
    "account/getManageTeamsInfoAsync",
    async ({ deviceInfo, token, hash, team }: GetManageTeamsInfoAsyncTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getTeamsInfo, {
            method: "GET",
            headers: {
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team,
            },
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return data;
    }
);

export const changeRoleAsync = createAsyncThunk(
    "account/changeRoleAsync",
    async ({ token, hash, deviceInfo, teamId, userId, role }: ChangeRoleAsyncTypes, { dispatch }) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.changeRole, {
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
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                id: userId,
                role,
            }),
        });
        const data = await response.json();
        if (data.message || data.error) {
            dispatch(showNotifyRedux({ type: error, title: data.message || data.error }));
            throw new Error(data.message);
        }
        return data;
    }
);

export const deleteManageTeamItemAsync = createAsyncThunk(
    "account/deleteManageTeamItemAsync",
    async ({ deviceInfo, token, hash, teamId, userId }: DeleteManageTeamItemAsyncTypes, { dispatch }) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.removeUserForTeam + userId, {
            method: "GET",
            headers: {
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team: teamId,
            },
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        dispatch(resetHelperModalStateToInitialRedux());
        return data;
    }
);

const initialState: AccountInitialStateTypes = {
    accountLoading: false,
    confirmCodeSent: false,
    recoveryEmail: "",
    isConfirmCodeValid: false,
    isConfirmCodeInvalid: false,
    isTfaConfirmCodeInvalid: false,
    paymentUrl: "",
    paymentTariffUrl: "",
    signInError: "",
    nameError: "",
    passwordStatus: "",
    requiredTfa: false,
    promoCodeError: "",
    discountedTariffList: [],
    tfaInfos: {
        message: "",
        dataURL: "",
        secretKey: "",
    },
    user: {
        name: "",
        email: "",
        balance: NaN,
        invitesDisabled: false,
        type: "",
        messages: [],
        emailConfirmed: false,
        tfaEnabled: false,
        passwordUpdateAt: undefined,
        sessions: [],
    },
    subs: [],
    teams: [],
    memberSessionsList: [],
    activeSub: {
        type: "",
        tariffId: "",
        tariffWeight: NaN,
        buyTime: NaN,
        duration: NaN,
        userLimit: NaN,
        profileLimit: NaN,
        users: [],
        owner: "",
        activated: false,
        ended: false,
        deactivated: false,
        createAt: NaN,
        _id: "",
        end: NaN,
        start: NaN,
    },
    teamsInfo: {
        name: "",
        users: [{ id: "", name: "", email: "", dateAdded: NaN, role: "" }],
        owner: {
            id: "",
            name: "",
            email: "",
        },
        inviteCode: "",
        createAt: NaN,
        _id: "",
        userLimit: NaN,
        subs: [
            {
                type: "",
                tariffId: "",
                tariffWeight: NaN,
                buyTime: NaN,
                duration: NaN,
                profileLimit: NaN,
                owner: "",
                activated: false,
                ended: false,
                deactivated: false,
                createAt: NaN,
                _id: "",
                end: NaN,
                start: NaN,
            },
        ],
        activeSub: {
            type: "",
            tariffId: "",
            tariffWeight: NaN,
            buyTime: NaN,
            duration: NaN,
            profileLimit: NaN,
            owner: "",
            activated: NaN,
            ended: NaN,
            deactivated: NaN,
            createAt: NaN,
            _id: "",
            end: NaN,
            start: NaN,
        },
    },
    token: "",
    hash: "",
    manageTeamInfo: {
        name: "",
        users: [],
        owner: {
            name: "",
            email: "",
        },
        inviteCode: "",
        createAt: 0,
        _id: "",
        userLimit: 0,
        subs: [
            {
                type: "",
                tariffId: "",
                tariffWeight: 0,
                buyTime: 0,
                duration: 0,
                userLimit: 0,
                profileLimit: 0,
                owner: "",
                activated: false,
                ended: false,
                deactivated: false,
                createAt: 0,
                _id: "",
                end: 0,
                start: 0,
            },
        ],
        activeSub: {
            type: "",
            tariffId: "",
            tariffWeight: 0,
            buyTime: 0,
            duration: 0,
            userLimit: 0,
            profileLimit: 0,
            owner: "",
            activated: false,
            ended: false,
            deactivated: false,
            createAt: 0,
            _id: "",
            end: 0,
            start: 0,
        },
    },
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        changeConfirmCodeSentRedux(state, action) {
            state.confirmCodeSent = action.payload;
        },
        resetByDefaultAccountRedux(state) {
            state.confirmCodeSent = false;
            state.isConfirmCodeValid = false;
            state.isConfirmCodeInvalid = false;
            state.signInError = "";
            state.recoveryEmail = "";
            state.tfaInfos = initialState.tfaInfos;
            state.isTfaConfirmCodeInvalid = false;
            state.promoCodeError = "";
            state.paymentUrl = "";
            state.discountedTariffList = [];
        },
        resetInvalidConfirmCodeRedux(state) {
            state.isConfirmCodeInvalid = false;
        },

        resetPasswordStatusRedux(state) {
            state.passwordStatus = "";
        },
        changePasswordRedux(state, action) {
            state.user = action.payload;
        },
        changeNameRedux(state, action) {
            state.user.name = action.payload.data.user.name;
        },
        resetAccountStateToInitialRedux(state) {
            state.accountLoading = initialState.accountLoading;
            state.confirmCodeSent = initialState.confirmCodeSent;
            state.recoveryEmail = initialState.recoveryEmail;
            state.isConfirmCodeValid = initialState.isConfirmCodeValid;
            state.isConfirmCodeInvalid = initialState.isConfirmCodeInvalid;
            state.isTfaConfirmCodeInvalid = initialState.isTfaConfirmCodeInvalid;
            state.signInError = initialState.signInError;
            state.nameError = initialState.nameError;
            state.passwordStatus = initialState.passwordStatus;
            state.requiredTfa = initialState.requiredTfa;
            state.tfaInfos = initialState.tfaInfos;
            state.user = initialState.user;
            state.subs = initialState.subs;
            state.teams = initialState.teams;
            state.activeSub = initialState.activeSub;
            state.token = initialState.token;
            state.hash = initialState.hash;
        },
        resetTfaConfirmCode(state) {
            state.isTfaConfirmCodeInvalid = false;
        },
        resetTfaCodeData(state) {
            state.isTfaConfirmCodeInvalid = false;
            state.requiredTfa = false;
        },
        resetTfaInfos(state) {
            state.tfaInfos = initialState.tfaInfos;
        },
        changeEmailRedux(state, action) {
            state.user.email = action.payload;
        },
        resetPromoCodeErrorRedux(state) {
            state.promoCodeError = "";
        },
        resetDiscountedTariffListRedux(state) {
            state.discountedTariffList = [];
        },
        resetMemberSessionsList(state) {
            state.memberSessionsList = initialState.memberSessionsList;
        },
        changeAccountInfoRedux(state, action) {
            state.activeSub = action.payload.activeSub || state.activeSub;
            state.subs = action.payload.subs || state.subs;
            state.teams = action.payload.teams || state.teams;
            state.token = bearer + action.payload.token;
            state.user = action.payload.user;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.signInError = "";
                state.user = action.payload.user;
                state.subs = action.payload.subs || [];
                state.activeSub = action.payload.activeSub || initialState.activeSub;
                state.teams = action.payload.teams || initialState.teams;
                state.token = bearer + action.payload.token;
                state.hash = action.payload.hash;
                state.requiredTfa = false;
                state.isTfaConfirmCodeInvalid = false;
                if (action.payload.isSigned) localStorage.setItem("token", bearer + action.payload.token);
                localStorage.setItem("hash", action.payload.hash);
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.accountLoading = false;
                if (action.error.message === "Please enter the 2FA Auth Code") {
                    state.requiredTfa = true;
                } else if (action.error.message === "Invalid 2FA Auth Code") {
                    state.isTfaConfirmCodeInvalid = true;
                } else {
                    state.signInError = t("signIn.incorrect_username_password");
                }
            })
            .addCase(logOutAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(logOutAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.confirmCodeSent = false;
                state.user = { ...initialState.user };
                state.subs = [];
                state.activeSub = { ...initialState.activeSub };
                state.token = "";
                localStorage.removeItem("hash");
                localStorage.removeItem("token");
            })
            .addCase(logOutAsync.rejected, (state, action) => {
                state.accountLoading = false;
            })
            .addCase(loginByTokenAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(loginByTokenAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.user = action.payload.user;
                state.subs = action.payload.subs || [];
                state.token = action.payload.token;
                state.activeSub = action.payload.activeSub || initialState.activeSub;
                state.teams = action.payload.teams || initialState.teams;
                state.hash = action.payload.hash;
            })
            .addCase(loginByTokenAsync.rejected, (state, action) => {
                state.accountLoading = false;
            })
            .addCase(confirmEmailAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(confirmEmailAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.isConfirmCodeInvalid = false;
                state.user = action.payload.user;
                state.subs = action.payload.subs || [];
                state.token = bearer + action.payload.token;
                state.hash = action.payload.hash;
                localStorage.setItem("token", bearer + action.payload.token);
                localStorage.setItem("hash", action.payload.hash);
            })
            .addCase(confirmEmailAsync.rejected, (state, action) => {
                state.accountLoading = false;
                state.isConfirmCodeInvalid = true;
            })
            .addCase(removeSessionAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(removeSessionAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.user.sessions = action.payload;
            })
            .addCase(removeSessionAsync.rejected, (state, action) => {
                state.accountLoading = false;
            })
            .addCase(getSessionsAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(getSessionsAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.user.sessions = action.payload;
            })
            .addCase(getSessionsAsync.rejected, (state) => {
                state.accountLoading = false;
            })
            .addCase(sendRecoveryCodeAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(sendRecoveryCodeAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.recoveryEmail = action.payload.email;
            })
            .addCase(sendRecoveryCodeAsync.rejected, (state) => {
                state.accountLoading = false;
            })
            .addCase(checkRecoveryCodeAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(checkRecoveryCodeAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.isConfirmCodeValid = action.payload.valid;
                state.isConfirmCodeInvalid = !action.payload.valid;
            })
            .addCase(checkRecoveryCodeAsync.rejected, (state) => {
                state.accountLoading = false;
            })
            .addCase(recoveryPasswordAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(recoveryPasswordAsync.fulfilled, (state) => {
                state.accountLoading = false;
                state.user = initialState.user;
                localStorage.removeItem("hash");
                localStorage.removeItem("token");
            })
            .addCase(recoveryPasswordAsync.rejected, (state) => {
                state.accountLoading = false;
            })
            .addCase(setInvitesAccessAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(setInvitesAccessAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.user.invitesDisabled = action.payload;
            })
            .addCase(setInvitesAccessAsync.rejected, (state) => {
                state.accountLoading = false;
            })
            .addCase(setupTwoFactorAuthenticationAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(setupTwoFactorAuthenticationAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.tfaInfos = action.payload;
            })
            .addCase(setupTwoFactorAuthenticationAsync.rejected, (state) => {
                state.accountLoading = false;
            })
            .addCase(verifyTwoFactorAuthenticationAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(verifyTwoFactorAuthenticationAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.isTfaConfirmCodeInvalid = false;
                state.user.tfaEnabled = action.payload;
            })
            .addCase(verifyTwoFactorAuthenticationAsync.rejected, (state) => {
                state.accountLoading = false;
                state.isTfaConfirmCodeInvalid = true;
            })
            .addCase(removeTwoFactorAuthenticationAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(removeTwoFactorAuthenticationAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.user.tfaEnabled = action.payload;
            })
            .addCase(removeTwoFactorAuthenticationAsync.rejected, (state) => {
                state.accountLoading = false;
            })
            .addCase(paymentsAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(paymentsAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.paymentUrl = action.payload.url;
            })
            .addCase(paymentsAsync.rejected, (state) => {
                state.accountLoading = false;
            })
            .addCase(paymentsTariffAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(paymentsTariffAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.paymentTariffUrl = action.payload.url;
            })
            .addCase(paymentsTariffAsync.rejected, (state) => {
                state.accountLoading = false;
            })
            .addCase(checkPromoCodeAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(checkPromoCodeAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.discountedTariffList = action.payload;
            })
            .addCase(checkPromoCodeAsync.rejected, (state, action) => {
                state.accountLoading = false;
                state.promoCodeError = action.error.message + "";
                state.discountedTariffList = initialState.discountedTariffList;
            })
            .addCase(buySubscriptionPlanAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(buySubscriptionPlanAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.user = action.payload.user;
                if (action.payload.activeSub) {
                    state.activeSub = action.payload.activeSub;
                }
                if (action.payload.teams) {
                    state.teams = action.payload.teams;
                }
                state.subs = action.payload.subs;
                state.token = bearer + action.payload.token;
                localStorage.setItem("token", bearer + action.payload.token);
            })
            .addCase(buySubscriptionPlanAsync.rejected, (state, action) => {
                state.accountLoading = false;
            })
            .addCase(changeTariffAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(changeTariffAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.user = action.payload.user;
                state.subs = action.payload.subs;
                state.activeSub = action.payload.activeSub;
            })
            .addCase(changeTariffAsync.rejected, (state, action) => {
                state.accountLoading = false;
            })
            .addCase(getMemberSessionsAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(getMemberSessionsAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.memberSessionsList = action.payload;
            })
            .addCase(getMemberSessionsAsync.rejected, (state, action) => {
                state.accountLoading = false;
            })
            .addCase(leaveFromTeamAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(leaveFromTeamAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.teams = action.payload.teams;
            })
            .addCase(leaveFromTeamAsync.rejected, (state, action) => {
                state.accountLoading = false;
            })
            .addCase(changeTeamNameAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(changeTeamNameAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.teams = _.cloneDeep(state.teams).map((team) => {
                    if (team._id === action.payload._id) team.name = action.payload.name;
                    return team;
                });
            })
            .addCase(changeTeamNameAsync.rejected, (state, action) => {
                state.accountLoading = false;
            })
            .addCase(getManageTeamsInfoAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(getManageTeamsInfoAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.manageTeamInfo = action.payload;
            })
            .addCase(getManageTeamsInfoAsync.rejected, (state, action) => {
                state.accountLoading = false;
            })
            .addCase(changeRoleAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(changeRoleAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.manageTeamInfo = action.payload;
            })
            .addCase(changeRoleAsync.rejected, (state, action) => {
                state.accountLoading = false;
            })
            .addCase(deleteManageTeamItemAsync.pending, (state) => {
                state.accountLoading = true;
            })
            .addCase(deleteManageTeamItemAsync.fulfilled, (state, action) => {
                state.accountLoading = false;
                state.manageTeamInfo = action.payload;
            })
            .addCase(deleteManageTeamItemAsync.rejected, (state, action) => {
                state.accountLoading = false;
            });
    },
});

export const {
    changeConfirmCodeSentRedux,
    resetByDefaultAccountRedux,
    resetInvalidConfirmCodeRedux,
    resetPasswordStatusRedux,
    changePasswordRedux,
    changeNameRedux,
    resetAccountStateToInitialRedux,
    resetTfaConfirmCode,
    resetTfaCodeData,
    resetTfaInfos,
    changeEmailRedux,
    resetPromoCodeErrorRedux,
    resetDiscountedTariffListRedux,
    resetMemberSessionsList,
    changeAccountInfoRedux,
} = accountSlice.actions;
export default accountSlice.reducer;
