import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import HelperInput from "../../helpersComponents/HelperInput";
import { constants } from "../../../assets/constants";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { InitialFormDateTypes } from "../../../types";
import { useAppDispatch, useAppSelector } from "../../../store";
import styles from "./passwordPage.module.scss";
import { registrationAsync } from "../../../store/features/signUpSlice";
import { helpers } from "../../../assets/helpers";

const PasswordPage = ({
    backToSignUpPage,
    formData,
    setFormData,
}: {
    backToSignUpPage: React.Dispatch<React.SetStateAction<boolean>>;
    formData: InitialFormDateTypes;
    setFormData: React.Dispatch<React.SetStateAction<InitialFormDateTypes>>;
}) => {
    const dispatch = useAppDispatch();
    const {
        main: { deviceInfo },
    } = useAppSelector((state) => state);
    const { paths } = constants;
    const { t } = useTranslation();

    const [isPasswordPageOpen, setIsPasswordPageOpen] = useState(true);

    const handleGoBack = () => {
        setIsPasswordPageOpen(false);
        setTimeout(() => {
            backToSignUpPage(false);
        }, 200);
    };

    const changeFormValues = (type: string, value: string) => {
        setFormData({ ...formData, [type]: value });
    };
    const isPasswordCharacterCorrect = formData.password.length > 7;
    const isPasswordContainSymbol = helpers.isPasswordContainSymbolOrNumber(formData.password);
    const isPasswordCorrect = isPasswordCharacterCorrect && isPasswordContainSymbol;
    const canCreateAccount = formData.password && formData.password === formData.confirmPassword;

    const register = () => {
        setIsPasswordPageOpen(false);
        setTimeout(() => {
            backToSignUpPage(false);
            dispatch(registrationAsync({ formData: { name: formData.name, email: formData.email, password: formData.password }, deviceInfo }));
        }, 200);
    };

    return (
        <div className={styles.password_page_wrapper}>
            <div className={`${styles.password_page_main} ${!isPasswordPageOpen && styles.password_page_is_closing}`}>
                <div className={styles.password_page}>
                    <button className={styles.back_btn} onClick={handleGoBack}>
                        <ArrowBackIosIcon /> <span>{t("sundry.back")}</span>
                    </button>
                    <div className={styles.password_page_form}>
                        <h2 className={styles.password_page_header}>{t("signUp.choose_a_password")}</h2>
                        <div className={styles.password_page_input_place}>
                            <label htmlFor="password">{t("signUp.password")}</label>
                            <HelperInput type={"password"} name={"password"} value={formData.password} onChange={changeFormValues} />
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
                        <div className={styles.password_page_input_place}>
                            <label htmlFor="confirm_password">
                                {t("sundry.confirm")} {t("signUp.password")}
                            </label>
                            <HelperInput
                                type={"password"}
                                name={"confirmPassword"}
                                value={formData.confirmPassword}
                                onChange={changeFormValues}
                                isDisable={!isPasswordCorrect}
                            />
                        </div>
                        <button className={styles.create_an_account_btn} disabled={!canCreateAccount} onClick={register}>
                            {t("signUp.create_account_btn")}
                        </button>
                        <div className={styles.already_have_an_account}>
                            <span>{t("signUp.already_have_an_account")}</span>
                            <Link to={paths.home}>{t("sundry.signIn")}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordPage;
