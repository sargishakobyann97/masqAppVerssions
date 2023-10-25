import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { constants } from "../../assets/constants";
import { InitialFormDateTypes } from "../../types";
import { checkNameFreeAsync, resetFormErrorsRedux, resetSignUpStateToInitialRedux } from "../../store/features/signUpSlice";
import masq_logo_and_name from "../../assets/images/masq_logo_and_name.svg";
import ConfirmCodeSent from "../helpersComponents/ConfirmationCode";
import HelperInput from "../helpersComponents/HelperInput";
import PasswordPage from "./PasswordPage";
import styles from "./sign_up.module.scss";

const initialFormDate: InitialFormDateTypes = {
    name: "",
    nameLocalError: "",
    email: "",
    emailLocalError: "",
    password: "",
    confirmPassword: "",
};

function SignUp() {
    const dispatch = useAppDispatch();
    const {
        main: { deviceInfo },
        signUp: { nameError, emailError, confirmCodeSent },
    } = useAppSelector((state) => state);
    const { t } = useTranslation();

    const { emailPattern, paths } = constants;

    const [signUpFormData, setSignUpFormData] = useState(initialFormDate);
    const [isPasswordPageOpen, setIsPasswordPageOpen] = useState(false);

    const changeFormValues = (type: string, val: string) => {
        (nameError || emailError) && dispatch(resetFormErrorsRedux({ type }));
        let err = "";
        if (type === "name" && val.length < 3 && val.length > 0) {
            err = t("signUp.name_local_error");
        } else if (type === "email" && !emailPattern.test(val) && val.length > 0) {
            err = t("signUp.email_local_error");
        }
        setSignUpFormData({ ...signUpFormData, [type]: val, [type + "LocalError"]: err });
    };

    const handleGoPasswordPage = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setIsPasswordPageOpen(true);
    };

    const closeOpenedPage = () => {
        setIsPasswordPageOpen(false);
        setSignUpFormData(initialFormDate);
        dispatch(resetSignUpStateToInitialRedux());
    };
    const goToSignIn = () => {
        dispatch(resetSignUpStateToInitialRedux());
    };

    const isDataCorrect = !nameError && !emailError && signUpFormData.name.length > 2 && emailPattern.test(signUpFormData.email); // && isAcceptedReceiveNews;

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (signUpFormData.name.length > 2 || emailPattern.test(signUpFormData.email)) {
            timeout = setTimeout(() => {
                dispatch(checkNameFreeAsync({ deviceInfo, name: signUpFormData.name, email: signUpFormData.email }));
            }, 300);
        }
        return () => clearTimeout(timeout);
    }, [signUpFormData.name, signUpFormData.email]);

    useEffect(() => {
        return () => {
            dispatch(resetFormErrorsRedux({ type: "all" }));
        };
    }, []);

    return (
        <div className={styles.sign_up_wrapper}>
            <div className={styles.masq_logo_wrapper}>
                <div>
                    <img src={masq_logo_and_name} alt="masq_logo_and_name" />
                </div>
            </div>
            <div className={styles.sign_up_content_wrapper}>
                {isPasswordPageOpen && (
                    <PasswordPage backToSignUpPage={setIsPasswordPageOpen} formData={signUpFormData} setFormData={setSignUpFormData} />
                )}
                {confirmCodeSent && (
                    <ConfirmCodeSent
                        name={signUpFormData.name}
                        email={signUpFormData.email}
                        confirmTitle={t("signUp.confirmation.title")}
                        confirmText={t("signUp.confirmation.clue_text")}
                        backToSignIn={closeOpenedPage}
                    />
                )}
                <div className={styles.sign_up_form_wrapper}>
                    <h2 className={styles.sign_up_title}>{t("signUp.create_an_account")}</h2>
                    <div className={styles.sign_up_inputs}>
                        <label htmlFor="name">Username</label>
                        <HelperInput
                            type={"text"}
                            name={"name"}
                            value={signUpFormData.name}
                            onChange={changeFormValues}
                            errorMessage={nameError || signUpFormData.nameLocalError}
                        />
                    </div>
                    <div className={styles.sign_up_inputs}>
                        <label htmlFor="email">Email</label>

                        <HelperInput
                            type={"email"}
                            name={"email"}
                            value={signUpFormData.email}
                            onChange={changeFormValues}
                            errorMessage={emailError || signUpFormData.emailLocalError}
                        />
                    </div>
                    <button className={styles.next_btn} onClick={handleGoPasswordPage} disabled={!isDataCorrect}>
                        {t("sundry.next")}
                    </button>
                    <p className={styles.already_have_an_account_wrapper}>
                        <span>{t("signUp.already_have_an_account")}</span>
                        <Link to={paths.home} onClick={goToSignIn}>
                            {t("sundry.signIn")}
                        </Link>
                        <span></span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
