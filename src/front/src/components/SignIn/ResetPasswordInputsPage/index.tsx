import { useState } from "react";
import { useTranslation } from "react-i18next";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import HelperInput from "../../helpersComponents/HelperInput";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../../store";
import { resetByDefaultAccountRedux, recoveryPasswordAsync } from "../../../store/features/accountSlice";
import { RecoveryDateTypes } from "../../../types";
import { constants } from "../../../assets/constants";
import { helpers } from "../../../assets/helpers";
import styles from "./reset_password_inputs_page.module.scss";

const ResetPasswordInputsPage = ({
    resetFormData,
    backToSignIn,
    recoveryData,
    setRecoveryData,
}: {
    resetFormData: Function;
    backToSignIn: Function;
    recoveryData: RecoveryDateTypes;
    setRecoveryData: React.Dispatch<React.SetStateAction<RecoveryDateTypes>>;
}) => {
    const {
        main: { deviceInfo },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();

    const { t } = useTranslation();

    const [isThePageOpen, setIsThePageOpen] = useState(true);

    const isPasswordCharacterCorrect = recoveryData.password.length > 7;
    const isPasswordContainSymbol = helpers.isPasswordContainSymbolOrNumber(recoveryData.password);
    const isPasswordCorrect = isPasswordCharacterCorrect && isPasswordContainSymbol;
    const canChangePassword = recoveryData.password && recoveryData.password === recoveryData.confirmPassword;

    const changeFormValues = (type: string, value: string) => {
        setRecoveryData({ ...recoveryData, [type]: value });
    };
    const backToMainPage = () => {
        resetFormData();
        setIsThePageOpen(false);
        dispatch(resetByDefaultAccountRedux());
        setTimeout(backToSignIn, 200);
    };

    const changePassword = () => {
        const goToSignIn = () => backToMainPage();
        dispatch(
            recoveryPasswordAsync({
                deviceInfo,
                name: recoveryData.name,
                recoveryCode: recoveryData.recoveryCode,
                password: recoveryData.password,
                goToSignIn,
            })
        );
    };

    return (
        <div className={styles.reset_pass_wrapper}>
            <div className={`${styles.reset_pass_wrapper_main} ${!isThePageOpen && styles.reset_pass_is_closing}`}>
                <div className={styles.reset_pass_content_wrapper}>
                    <h2 className={styles.reset_pass_header}>{t("resetPassword.password_changing")}</h2>
                    <p className={styles.reset_pass_text}>{t("resetPassword.set_new_password")}</p>
                    <div className={styles.reset_pass_inp_place}>
                        <div className={styles.reset_pass_inp_div}>
                            <HelperInput
                                type={"password"}
                                name={"password"}
                                value={recoveryData.password}
                                onChange={changeFormValues}
                                placeholder={t("resetPassword.enter_new_password") + ""}
                            />
                        </div>
                        <div className={styles.check_new_password_valid}>
                            <div className={styles.correct_password_info_place}>
                                {isPasswordCharacterCorrect ? (
                                    <DoneIcon className={styles.done_icon} />
                                ) : (
                                    <CloseIcon className={styles.reject_icon} />
                                )}
                                <span className={styles.correct_password_info}>{t("signUp.correct_password_length")}</span>
                            </div>
                            <div className={styles.correct_password_info_place}>
                                {isPasswordContainSymbol ? <DoneIcon className={styles.done_icon} /> : <CloseIcon className={styles.reject_icon} />}
                                <span className={styles.correct_password_info}>{t("signUp.correct_password_should_contain")}</span>
                            </div>
                        </div>
                        <div className={styles.reset_pass_inp_div}>
                            <HelperInput
                                type={"password"}
                                name={"confirmPassword"}
                                value={recoveryData.confirmPassword}
                                onChange={changeFormValues}
                                isDisable={!isPasswordCorrect}
                                placeholder={t("resetPassword.re_enter_new_password") + ""}
                            />
                        </div>
                    </div>
                    <button className={styles.reset_pass_confirm_btn} disabled={!canChangePassword} onClick={changePassword}>
                        {t("sundry.confirm")}
                    </button>
                    <p className={styles.reset_pass_back_signIn_btn} onClick={backToMainPage}>
                        <ArrowBackIosIcon sx={{ fontSize: "12px" }} />
                        {t("signUp.confirmation.back_to_signIn")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordInputsPage;
