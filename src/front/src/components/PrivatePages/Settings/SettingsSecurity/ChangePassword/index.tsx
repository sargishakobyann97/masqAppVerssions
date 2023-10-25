import { useState } from "react";
import BackToSomePage from "../../../../helpersComponents/BackToSomePage";
import { constants } from "../../../../../assets/constants";
import { useTranslation } from "react-i18next";
import HelperInput from "../../../../helpersComponents/HelperInput";
import CheckedIcon from "../../../../../assets/images/svg/settings/security/ChechkedIcon";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import VerificationInput from "react-verification-input";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { ChangePasswordInitialStateTypes } from "../../../../../types";
import {
    checkRecoveryCodeAsync,
    recoveryPasswordAsync,
    resetInvalidConfirmCodeRedux,
    sendRecoveryCodeAsync,
} from "../../../../../store/features/accountSlice";
import { changePasswordAsync, resetPasswordStatusRedux } from "../../../../../store/features/settingsSlice";
import styles from "./change_password.module.scss";
import { helpers } from "../../../../../assets/helpers";

const changePasswordInitialState: ChangePasswordInitialStateTypes = {
    oldPassword: "",
    oldPasswordLocalError: "",
    isOldPasswordConfirmed: false,
    newPassword: "",
    newPasswordConfirm: "",
    isForgotPassword: false,
    confirmEmail: "",
};

const ChangePassword = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        main: { deviceInfo },
        account: {
            user: { name },
            hash,
            isConfirmCodeValid,
            isConfirmCodeInvalid,
            token,
        },
        settings: { passwordStatus },
    } = useAppSelector((state) => state);

    const [settingsFormData, setSettingsFormData] = useState(changePasswordInitialState);

    const { paths } = constants;

    const isOldPasswordValid = settingsFormData.oldPassword.length > 2;
    const isNewPasswordCharacterCorrect = settingsFormData.newPassword.length > 7;
    const isNewPasswordContainSymbol = helpers.isPasswordContainSymbolOrNumber(settingsFormData.newPassword);
    const isNewPasswordCorrect = isNewPasswordCharacterCorrect && isNewPasswordContainSymbol;
    const isNewPasswordConfirmed = settingsFormData.newPassword && settingsFormData.newPassword === settingsFormData.newPasswordConfirm;

    const changeInitialStateValues = (type: string, val: string) => {
        let err;
        if (type === "newPasswordConfirm" && val !== settingsFormData.newPassword && val.length > 0) {
            err = t("signUp.password_confirm_password_not_match");
        } else if (!helpers.isPasswordContainSymbolOrNumber(val.trim()) && val.length > 0) {
            err = t("signUp.invalid_password_err_message");
        }

        setSettingsFormData({ ...settingsFormData, [type]: val, [type + "LocalError"]: err });
    };

    const confirmOldPassword = () => {
        if (settingsFormData.oldPassword.trim()) {
            setSettingsFormData({ ...settingsFormData, isOldPasswordConfirmed: true });
            dispatch(resetPasswordStatusRedux());
        }
    };

    const handleForgotPassword = () => {
        setSettingsFormData({ ...settingsFormData, isForgotPassword: true });
        dispatch(sendRecoveryCodeAsync({ deviceInfo, name }));
    };

    const toggleConfirmCode = (value: string) => {
        dispatch(resetInvalidConfirmCodeRedux());
        setSettingsFormData({ ...settingsFormData, confirmEmail: value });
    };

    const checkConfirmCode = () => dispatch(checkRecoveryCodeAsync({ deviceInfo, name, recoveryCode: settingsFormData.confirmEmail }));

    const changePassword = () => {
        if (isConfirmCodeValid) {
            dispatch(
                recoveryPasswordAsync({
                    deviceInfo,
                    name: name,
                    recoveryCode: settingsFormData.confirmEmail,
                    password: settingsFormData.newPassword,
                })
            );
        } else {
            dispatch(
                changePasswordAsync({
                    token,
                    hash,
                    deviceInfo,
                    oldPassword: settingsFormData.oldPassword,
                    newPassword: settingsFormData.newPassword,
                })
            );
        }
    };

    return (
        <div className={styles.change_password_wrapper}>
            <BackToSomePage path={`${paths.settings}/${paths.settings_security}`} page={t("settings.settings_main_page.security")} />
            <div className={styles.change_parts}>
                <div className={styles.change_part}>
                    {(!settingsFormData.isOldPasswordConfirmed && !isConfirmCodeValid) || passwordStatus ? (
                        <>
                            {!passwordStatus && settingsFormData.isForgotPassword ? (
                                <div className={styles.confirm_code_part}>
                                    <div className={styles.confirm_code_text_place}>
                                        <h2>{t("settings.security.change_password_steps.confirm_u_have_access")}</h2>
                                        <p>{t("settings.security.change_password_steps.we_sent_verify_code")}</p>
                                    </div>
                                    <div className={styles.confirm_code_input_place} onClick={() => dispatch(resetInvalidConfirmCodeRedux())}>
                                        <VerificationInput
                                            length={10}
                                            autoFocus={true}
                                            onChange={toggleConfirmCode}
                                            value={settingsFormData.confirmEmail}
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
                                <div className={`${styles.input_confirm_part}`}>
                                    <div className={styles.input_confirm_text_place}>
                                        <h2>{t("settings.security.change_password_steps.password_changing")}</h2>
                                        <p>{t("settings.security.change_password_steps.password_changing_text")}</p>
                                    </div>
                                    <div className={styles.input_confirm_inp_btn_place}>
                                        <HelperInput
                                            type={"password"}
                                            name={"oldPassword"}
                                            value={settingsFormData.oldPassword}
                                            onChange={changeInitialStateValues}
                                            placeholder={t("resetPassword.enter_your_password") + ""}
                                            onlyErrorInfo={true}
                                            errorMessage={passwordStatus}
                                            style={{
                                                width: 257,
                                                height: 35,
                                                borderRadius: 4,
                                                borderColor: "#560BAD",
                                                top: "15%",
                                                errorInfoLeft: -70,
                                            }}
                                        />
                                        <button onClick={confirmOldPassword} disabled={!isOldPasswordValid}>
                                            {t("sundry.confirm")}
                                        </button>
                                    </div>
                                    <div className={styles.forgetPassword_btn}>
                                        <button onClick={handleForgotPassword}>{t("signIn.forget_password")}</button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.header_part}>
                            <h2 className={`${styles.disabled_part_header} ${styles.confirmed}`}>
                                <span>{t("settings.security.change_password_steps.set_new_password")}</span>
                            </h2>
                            <CheckedIcon />
                        </div>
                    )}
                </div>
                <div className={styles.change_part}>
                    {settingsFormData.isOldPasswordConfirmed || isConfirmCodeValid ? (
                        <div className={`${styles.input_confirm_part}`}>
                            <div className={styles.input_confirm_text_place}>
                                <h2>{t("settings.security.change_password_steps.password_changing")}</h2>
                                <p>{t("settings.security.change_password_steps.to_continue_set_new_password")}</p>
                            </div>
                            <div className={styles.new_password_input_place}>
                                <HelperInput
                                    type={"password"}
                                    name={"newPassword"}
                                    value={settingsFormData.newPassword}
                                    onChange={changeInitialStateValues}
                                    placeholder={t("resetPassword.enter_new_password") + ""}
                                    style={{ width: 404, height: 35, borderRadius: 4, borderColor: "#560BAD", top: "15%" }}
                                />
                                <div className={styles.new_password_is_correct_wrapper}>
                                    <div className={styles.correct_password_info_place}>
                                        {isNewPasswordCharacterCorrect ? (
                                            <DoneIcon className={styles.done_icon} />
                                        ) : (
                                            <CloseIcon className={styles.reject_icon} />
                                        )}
                                        <span className={styles.correct_password_info}>{t("signUp.correct_password_length")}</span>
                                    </div>
                                    <div className={styles.correct_password_info_place}>
                                        {isNewPasswordContainSymbol ? (
                                            <DoneIcon className={styles.done_icon} />
                                        ) : (
                                            <CloseIcon className={styles.reject_icon} />
                                        )}
                                        <span className={styles.correct_password_info}>{t("signUp.correct_password_should_contain")}</span>
                                    </div>
                                </div>
                                <HelperInput
                                    type={"password"}
                                    name={"newPasswordConfirm"}
                                    value={settingsFormData.newPasswordConfirm}
                                    onChange={changeInitialStateValues}
                                    placeholder={t("resetPassword.enter_new_password") + ""}
                                    style={{ width: 404, height: 35, borderRadius: 4, borderColor: "#560BAD", top: "15%" }}
                                    isDisable={!isNewPasswordCorrect}
                                />
                            </div>
                            <div className={styles.confirm_new_password_text_btn}>
                                <p>{t("settings.security.change_password_steps.after_password_changing_info")}</p>
                                <button onClick={changePassword} disabled={!isNewPasswordConfirmed || !!passwordStatus}>
                                    {t("sundry.confirm")}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.header_part}>
                            <h2 className={`${styles.disabled_part_header} `}>
                                <span>{t("settings.security.change_password_steps.set_new_password")}</span>
                            </h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
