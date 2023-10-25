import { useState, useEffect } from "react";
import BackToSomePage from "../../../../helpersComponents/BackToSomePage";
import VerificationInput from "react-verification-input";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import CheckedIcon from "../../../../../assets/images/svg/settings/security/ChechkedIcon";
import HelperInput from "../../../../helpersComponents/HelperInput";
import { constants } from "../../../../../assets/constants";
import { ChangeEmailInitialStateTypes } from "../../../../../types";
import {
    changeEmailSendConfirmCodeAsync,
    confirmCurrentEmailAsync,
    confirmNewEmailAsync,
    resetByDefaultSettingsRedux,
    resetInvalidConfirmCodeRedux,
    setNewEmailAsync,
} from "../../../../../store/features/settingsSlice";
import { checkNameFreeAsync, resetFormErrorsRedux } from "../../../../../store/features/signUpSlice";
import { resetPasswordStatusRedux } from "../../../../../store/features/settingsSlice";
import { useNavigate } from "react-router-dom";
import { setEventsMessageRedux } from "../../../../../store/features/eventsModalSlice";
import styles from "./change_email.module.scss";

const changeEmailInitialState: ChangeEmailInitialStateTypes = {
    email: "",
    password: "",
    isPasswordConfirmed: false,
    passwordLocalError: "",
    newEmail: "",
    newEmailLocalError: "",
    confirmActualEmail: "",
    confirmNewEmail: "",
};

const ChangeEmail = () => {
    const {
        account: { token, hash },
        main: { deviceInfo },
        signUp: { emailError },
        settings: { currentEmailConfirmCodeSent, confirmCodeSent, passwordStatus, isConfirmCodeInvalid, isConfirmCodeValid },
    } = useAppSelector((state) => state);
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const [settingsFormData, setSettingsFormData] = useState(changeEmailInitialState);

    const { emailPattern, paths, eventsMsg } = constants;

    const isPasswordValid = settingsFormData.password.length > 2;
    const isNewEmailCorrect =
        !emailError && !settingsFormData.newEmailLocalError && emailPattern.test(settingsFormData.newEmail) && settingsFormData.newEmail.length > 0;

    const changeInitialStateValues = (type: string, val: string) => {
        emailError && dispatch(resetFormErrorsRedux({ type }));
        let err = "";
        if (type === "newEmail" && !emailPattern.test(val) && val.length > 0) {
            err = t("signUp.email_local_error");
        }
        setSettingsFormData({ ...settingsFormData, [type]: val, [type + "LocalError"]: err });
    };

    const confirmPassword = () => {
        if (isPasswordValid) {
            setSettingsFormData({ ...settingsFormData, isPasswordConfirmed: true });
            dispatch(resetPasswordStatusRedux());
        }
    };

    const sendConfirmCode = () => dispatch(changeEmailSendConfirmCodeAsync({ deviceInfo, token, hash }));

    const checkConfirmCode = () => {
        dispatch(confirmCurrentEmailAsync({ deviceInfo, token, hash, currentEmailConfirmCode: settingsFormData.confirmActualEmail }));
    };

    const toggleConfirmCode = (value: string) => {
        dispatch(resetInvalidConfirmCodeRedux());
        setSettingsFormData({ ...settingsFormData, confirmActualEmail: value });
    };

    const toggleNewEmailConfirmCode = (value: string) => {
        dispatch(resetInvalidConfirmCodeRedux());
        setSettingsFormData({ ...settingsFormData, confirmNewEmail: value });
    };

    const changeEmail = () =>
        dispatch(setNewEmailAsync({ token, hash, deviceInfo, email: settingsFormData.newEmail, password: settingsFormData.password }));

    const confirmNewEmailConfirmationCode = () =>
        dispatch(
            confirmNewEmailAsync({
                token,
                hash,
                deviceInfo,
                email: settingsFormData.newEmail,
                newEmailConfirmCode: settingsFormData.confirmNewEmail.trim().toUpperCase(),
                fn: emailChanged,
            })
        );

    const emailChanged = () => {
        navigate(`${paths.settings}/${paths.settings_security}`);
        dispatch(
            setEventsMessageRedux({
                type: eventsMsg.types.emailChangeSuccess,
                header: eventsMsg.headers.success,
                message: eventsMsg.messages.haveNewEmail,
            })
        );
        dispatch(resetByDefaultSettingsRedux());
    };

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (emailPattern.test(settingsFormData.newEmail)) {
            timeout = setTimeout(() => {
                dispatch(checkNameFreeAsync({ deviceInfo, name: settingsFormData.newEmail, email: settingsFormData.newEmail }));
            }, 300);
        }
        return () => clearTimeout(timeout);
    }, [settingsFormData.newEmail]);

    useEffect(() => {
        return () => {
            dispatch(resetFormErrorsRedux({ type: "all" }));
        };
    }, []);

    return (
        <div className={styles.change_email_wrapper}>
            <BackToSomePage path={`${paths.settings}`} page={t("settings.settings_main_page.account")} />
            <div className={styles.change_parts}>
                <div className={styles.change_part}>
                    {(!settingsFormData.isPasswordConfirmed && !currentEmailConfirmCodeSent) || passwordStatus ? (
                        <div className={`${styles.input_confirm_part}`}>
                            <div className={styles.input_confirm_text_place}>
                                <h2>{t("resetPassword.confirm_password")}</h2>
                                <p>{t("settings.security.change_password_steps.password_changing_text")}</p>
                            </div>
                            <div className={styles.input_confirm_inp_btn_place}>
                                <HelperInput
                                    type={"password"}
                                    name={"password"}
                                    value={settingsFormData.password}
                                    onChange={changeInitialStateValues}
                                    placeholder={t("resetPassword.enter_your_password") + ""}
                                    onlyErrorInfo={true}
                                    errorMessage={passwordStatus}
                                    style={{ width: 257, height: 35, borderRadius: 4, borderColor: "#560BAD", top: "15%", errorInfoLeft: -70 }}
                                />
                                <button onClick={confirmPassword} disabled={!isPasswordValid}>
                                    {t("sundry.confirm")}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.header_part}>
                            <h2 className={`${styles.disabled_part_header} ${styles.confirmed}`}>
                                <span>{t("resetPassword.confirm_password")}</span>
                            </h2>
                            <CheckedIcon />
                        </div>
                    )}
                </div>
                <div className={styles.change_part}>
                    {settingsFormData.isPasswordConfirmed && !currentEmailConfirmCodeSent ? (
                        <div className={styles.send_code_part}>
                            <div className={styles.send_code_part_text_place}>
                                <h2>{t("settings.security.change_email_steps.email_changing")}</h2>
                                <p>{t("settings.security.change_email_steps.email_changing_text")}</p>
                            </div>
                            <button className={styles.send_code_btn} onClick={sendConfirmCode}>
                                {t("sundry.send_code")}
                            </button>
                        </div>
                    ) : (
                        <div className={styles.header_part}>
                            <h2 className={`${styles.disabled_part_header} ${currentEmailConfirmCodeSent && styles.confirmed}`}>
                                <span>{t("settings.security.change_email_steps.email_changing")}</span>
                            </h2>
                            {currentEmailConfirmCodeSent && <CheckedIcon />}
                        </div>
                    )}
                </div>
                <div className={styles.change_part}>
                    {currentEmailConfirmCodeSent && !isConfirmCodeValid ? (
                        <div className={styles.confirm_code_part}>
                            <div className={styles.confirm_code_text_place}>
                                <h2>{t("settings.security.change_email_steps.confirm_you_have_actual_email")}</h2>
                                <p>{t("settings.security.change_email_steps.we_sent_verif_code")}</p>
                            </div>

                            <div className={styles.confirm_code_input_place} onClick={() => dispatch(resetInvalidConfirmCodeRedux())}>
                                <VerificationInput
                                    length={10}
                                    autoFocus={true}
                                    onChange={toggleConfirmCode}
                                    value={settingsFormData.confirmActualEmail}
                                    classNames={{
                                        container: styles.vf_container,
                                        character: `${styles.vf_character} ${isConfirmCodeInvalid && styles.active}`,
                                        characterInactive: styles.vf_character_inactive,
                                        characterSelected: `${styles.vf_character_selected} ${isConfirmCodeInvalid && styles.active}`,
                                    }}
                                />
                                <button className={styles.confirm_code_btn} onClick={checkConfirmCode}>
                                    {t("sundry.confirm")}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.header_part}>
                            <h2 className={`${styles.disabled_part_header} ${isConfirmCodeValid && styles.confirmed}`}>
                                <span>{t("settings.security.change_email_steps.confirm_actual_email")}</span>
                            </h2>
                            {isConfirmCodeValid && <CheckedIcon />}
                        </div>
                    )}
                </div>
                <div className={styles.change_part}>
                    {isConfirmCodeValid && !confirmCodeSent ? (
                        <div className={`${styles.input_confirm_part}`}>
                            <div className={styles.input_confirm_text_place}>
                                <h2>{t("settings.security.change_email_steps.set_new_email")}</h2>
                            </div>
                            <div className={styles.input_confirm_inp_btn_place}>
                                <HelperInput
                                    type={"email"}
                                    name={"newEmail"}
                                    value={settingsFormData.newEmail}
                                    onChange={changeInitialStateValues}
                                    placeholder={t("settings.security.change_email_steps.enter_new_email") + ""}
                                    onlyErrorInfo={true}
                                    errorMessage={emailError || settingsFormData.newEmailLocalError}
                                    style={{ width: 257, height: 35, borderRadius: 4, borderColor: "#560BAD", top: "15%", errorInfoLeft: -70 }}
                                />
                                <button onClick={changeEmail} disabled={!isNewEmailCorrect || !!passwordStatus}>
                                    {t("sundry.confirm")}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.header_part}>
                            <h2 className={`${styles.disabled_part_header} ${confirmCodeSent && styles.confirmed}`}>
                                <span>{t("settings.security.change_email_steps.set_new_email")}</span>
                            </h2>
                            {confirmCodeSent && <CheckedIcon />}
                        </div>
                    )}
                </div>
                <div className={styles.change_part}>
                    {confirmCodeSent ? (
                        <div className={styles.confirm_code_part}>
                            <div className={styles.confirm_code_text_place}>
                                <h2>{t("settings.security.change_email_steps.new_email_has_set")}</h2>
                                <p>{t("settings.security.change_email_steps.we_sent_verif_code")}</p>
                            </div>
                            <div className={styles.confirm_code_input_place} onClick={() => dispatch(resetInvalidConfirmCodeRedux())}>
                                <VerificationInput
                                    length={10}
                                    autoFocus={true}
                                    onChange={toggleNewEmailConfirmCode}
                                    value={settingsFormData.confirmNewEmail}
                                    classNames={{
                                        container: styles.vf_container,
                                        character: `${styles.vf_character} ${isConfirmCodeInvalid && styles.active}`,
                                        characterInactive: styles.vf_character_inactive,
                                        characterSelected: `${styles.vf_character_selected} ${isConfirmCodeInvalid && styles.active}`,
                                    }}
                                />
                                <button className={styles.confirm_code_btn} onClick={confirmNewEmailConfirmationCode}>
                                    {t("sundry.confirm")}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.header_part}>
                            <h2 className={`${styles.disabled_part_header}`}>
                                <span>{t("settings.security.change_email_steps.new_email_has_set")}</span>
                            </h2>
                            {confirmCodeSent && <CheckedIcon />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChangeEmail;
