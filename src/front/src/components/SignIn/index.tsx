import React, { useEffect, useState, KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import masq_logo_and_name from "../../assets/images/masq_logo_and_name.svg";
import { useAppDispatch, useAppSelector } from "../../store";
import { resetByDefaultAccountRedux, loginAsync } from "../../store/features/accountSlice";
import { Link } from "react-router-dom";
import { constants } from "../../assets/constants";
import ConfirmCodeSent from "../helpersComponents/ConfirmationCode";
import ResetPasswordMailPage from "./ResetPasswordMailPage";
import ResetPasswordInputsPage from "./ResetPasswordInputsPage";
import { RecoveryDateTypes, SignInInitialFormDataTypes } from "../../types";
import HelperInput from "../helpersComponents/HelperInput";
import TwoFactorAuthentication from "./TwoFactorAuthentication";
import styles from "./sign_in.module.scss";

const initialFormDate: SignInInitialFormDataTypes = {
    name: "",
    password: "",
    isSigned: false,
    tfaToken: "",
};

const initialRecoveryDate = {
    name: "",
    recoveryCode: "",
    password: "",
    confirmPassword: "",
};

function SignIn() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        main: { deviceInfo },
        account: {
            user: { email, emailConfirmed },
            user,
            recoveryEmail,
            isConfirmCodeValid,
            signInError,
            requiredTfa,
        },
    } = useAppSelector((state) => state);

    const { paths } = constants;

    const [signInData, setSignInData] = useState(initialFormDate);
    const [recoveryData, setRecoveryData] = useState<RecoveryDateTypes>(initialRecoveryDate);

    const [isPasswordResetPageOpen, setIsPasswordResetPageOpen] = useState(false);
    const [isUnConfirmed, setIsUnConfirmed] = useState(false);

    const changeFormValues = (type: string, value: string) => {
        setSignInData({ ...signInData, [type]: value });
    };
    const changeSignedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignInData({ ...signInData, isSigned: e.target.checked });
    };

    const signInHandleClick = () => {
        dispatch(loginAsync({ formData: signInData, deviceInfo }));
    };

    const keyListener = (e: KeyboardEvent) => e.key === "Enter" && signInHandleClick();

    const resetInputs = () => {
        setSignInData(initialFormDate);
        setRecoveryData(initialRecoveryDate);
    };

    const openPasswordResetPage = () => setIsPasswordResetPageOpen(true);

    const closeOpenedPage = () => {
        resetInputs();
        setIsUnConfirmed(false);
        setIsPasswordResetPageOpen(false);
        dispatch(resetByDefaultAccountRedux());
    };

    useEffect(() => {
        email && !emailConfirmed && setIsUnConfirmed(true);
    }, [user]);

    return (
        <div className={styles.sign_in_wrapper}>
            <div className={styles.masq_logo_wrapper}>
                <div>
                    <img src={masq_logo_and_name} alt="masq_logo_and_name" />
                </div>
            </div>
            <div className={styles.sign_in_content_wrapper}>
                {isPasswordResetPageOpen && <ResetPasswordMailPage setRecoveryData={setRecoveryData} backToSignIn={closeOpenedPage} />}
                {((email && !emailConfirmed && isUnConfirmed) || recoveryEmail) && (
                    <ConfirmCodeSent
                        name={recoveryEmail ? recoveryData.name : email}
                        confirmTitle={recoveryEmail ? t("resetPassword.confirm_email") : t("signUp.confirmation.title")}
                        confirmText={t("signUp.confirmation.clue_text")}
                        setRecoveryData={setRecoveryData}
                        backToSignIn={closeOpenedPage}
                    />
                )}
                {isConfirmCodeValid && (
                    <ResetPasswordInputsPage
                        resetFormData={resetInputs}
                        backToSignIn={closeOpenedPage}
                        recoveryData={recoveryData}
                        setRecoveryData={setRecoveryData}
                    />
                )}
                {requiredTfa && <TwoFactorAuthentication formData={signInData} />}
                <div className={styles.sign_in_form_wrapper}>
                    <h2 className={styles.sign_in_title}>{t("sundry.signIn")}</h2>
                    {signInError && <span className={styles.sign_in_error_message}>{signInError}</span>}
                    <label htmlFor="email_or_name">{t("signIn.nickOrEmail")}</label>
                    <HelperInput
                        type={"text"}
                        name={"name"}
                        value={signInData.name}
                        onChange={changeFormValues}
                        keyDow={keyListener}
                        errorWithoutMessage={signInError && signInError}
                    />
                    <label htmlFor="password">{t("signIn.password")}</label>
                    <HelperInput
                        type={"password"}
                        name={"password"}
                        value={signInData.password}
                        onChange={changeFormValues}
                        keyDow={keyListener}
                        errorWithoutMessage={signInError && signInError}
                    />
                    <div className={styles.forgot_password_wrapper}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    checked={signInData.isSigned}
                                    onChange={changeSignedValue}
                                    value={signInData.isSigned}
                                    style={{ color: "#808080" }}
                                />
                            }
                            label={t("signIn.stay_signed_in")}
                        />
                        <p onClick={openPasswordResetPage}>{t("signIn.forgot_your_password")}</p>
                    </div>
                    <p className={styles.sign_in_btn} onClick={signInHandleClick}>
                        {t("sundry.signIn")}
                    </p>
                    <p className={styles.have_an_account_wrapper}>
                        <span>{t("signIn.don't_have_an_account")}</span>
                        <Link to={paths.sign_up}>{t("sundry.signUp")}</Link>
                        <span></span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
