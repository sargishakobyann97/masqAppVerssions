import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CheckNameFreeTypes, NameDeviceInfoTypes, RegistrationAsyncTypes, SignUpInitialStateTypes } from "../../types";
import { constants } from "../../assets/constants";
import { t } from "i18next";

const { endpoints } = constants;

export const checkNameFreeAsync = createAsyncThunk("signUp/checkNameFreeAsync", async ({ deviceInfo, name, email }: CheckNameFreeTypes) => {
    let nameResponse;
    if (name) {
        nameResponse = await fetch(process.env.REACT_APP_API_URL + endpoints.checkNameFree + name, {
            method: "GET",
            headers: {
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: deviceInfo.hash,
            },
        });
    }
    let emailResponse;
    if (email) {
        emailResponse = await fetch(process.env.REACT_APP_API_URL + endpoints.checkNameFree + email, {
            method: "GET",
            headers: {
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: deviceInfo.hash,
            },
        });
    }

    const nameData = name ? await nameResponse?.json() : { isFree: true };
    const emailData = email ? await emailResponse?.json() : { isFree: true };
    if (nameData.message || emailData.message) throw new Error(nameData.message || emailData.message);
    return {
        nameError: nameData.isFree ? "" : t("signUp.name_error"),
        emailError: emailData.isFree ? "" : t("signUp.email_error"),
    };
});

export const sendConfirmCodeAsync = createAsyncThunk("signUp/sendConfirmCodeAsync", async ({ name, deviceInfo }: NameDeviceInfoTypes) => {
    const response = await fetch(process.env.REACT_APP_API_URL + endpoints.sendConfirmCode, {
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

export const registrationAsync = createAsyncThunk(
    "signUp/registrationAsync",
    async ({ formData: { name, email, password }, deviceInfo }: RegistrationAsyncTypes) => {
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.registration, {
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
                email,
                password,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return data;
    }
);

const initialState: SignUpInitialStateTypes = {
    signUpLoading: false,
    isFree: false,
    nameError: "",
    emailError: "",
    isCodeSentAgain: "",
    confirmCodeSent: false,
};

const signUpSlice = createSlice({
    name: "signUp",
    initialState,
    reducers: {
        resetFormErrorsRedux(state, action) {
            switch (action.payload.type) {
                case "all":
                    state.nameError = "";
                    state.emailError = "";
                    break;
                case "name":
                    state.nameError = "";
                    break;
                case "email":
                    state.emailError = "";
                    break;
            }
        },
        resetSignUpStateToInitialRedux(state) {
            state.signUpLoading = initialState.signUpLoading;
            state.isFree = initialState.isFree;
            state.nameError = initialState.nameError;
            state.emailError = initialState.emailError;
            state.isCodeSentAgain = initialState.isCodeSentAgain;
            state.confirmCodeSent = initialState.confirmCodeSent;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registrationAsync.pending, (state) => {
                state.signUpLoading = true;
            })
            .addCase(registrationAsync.fulfilled, (state, action) => {
                state.signUpLoading = false;
                state.confirmCodeSent = action.payload;
            })
            .addCase(registrationAsync.rejected, (state, action) => {
                state.signUpLoading = false;
            })
            .addCase(checkNameFreeAsync.fulfilled, (state, action) => {
                state.nameError = action.payload.nameError;
                state.emailError = action.payload.emailError;
            })
            .addCase(sendConfirmCodeAsync.pending, (state) => {
                state.signUpLoading = true;
            })
            .addCase(sendConfirmCodeAsync.fulfilled, (state, action) => {
                state.signUpLoading = false;
                state.isCodeSentAgain = action.payload;
            })
            .addCase(sendConfirmCodeAsync.rejected, (state) => {
                state.signUpLoading = false;
            });
    },
});
export const { resetFormErrorsRedux, resetSignUpStateToInitialRedux } = signUpSlice.actions;
export default signUpSlice.reducer;
