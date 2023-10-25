import { useRef, useState, useEffect } from "react";
import VerificationInput from "react-verification-input";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store";
import { checkRecoveryCodeAsync, confirmEmailAsync, resetInvalidConfirmCodeRedux, sendRecoveryCodeAsync } from "../../../store/features/accountSlice";
import { sendConfirmCodeAsync } from "../../../store/features/signUpSlice";
import { ConfirmCodePropsTypes } from "../../../types";
import styles from "./confirmation_code.module.scss";

function ConfirmCodeSent({ name, email, confirmTitle, confirmText, setRecoveryData, backToSignIn }: ConfirmCodePropsTypes) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        main: { deviceInfo },
        account: { recoveryEmail, isConfirmCodeValid, isConfirmCodeInvalid },
    } = useAppSelector((state) => state);

    const codeAgainBtn = useRef<HTMLDivElement>(null);
    const [confirmCode, setConfirmCode] = useState("");
    const [isConfirmPageOpen, setIsConfirmPageOpen] = useState(true);
    const [isSendCodeAgain, setIsSendCodeAgain] = useState(false);

    const confirmConfirmationCode = () => {
        dispatch(confirmEmailAsync({ confirmCode: confirmCode.trim().toUpperCase(), deviceInfo }));
    };
    const checkRecoveryCode = () => {
        setRecoveryData && setRecoveryData((state) => ({ ...state, recoveryCode: confirmCode }));
        dispatch(checkRecoveryCodeAsync({ deviceInfo, name, recoveryCode: confirmCode }));
    };

    const backToMainPage = () => {
        setIsConfirmPageOpen(false);
        backToSignIn();
    };

    const sendConfirmCodeAgain = () => {
        setConfirmCode("");
        setIsSendCodeAgain(false);
        dispatch(sendConfirmCodeAsync({ name, deviceInfo }));
    };
    const sendRecoveryConfirmCodeAgain = () => {
        dispatch(sendRecoveryCodeAsync({ deviceInfo, name }));
    };

    const toggleConfirmCode = (value: string) => {
        dispatch(resetInvalidConfirmCodeRedux());
        setConfirmCode(value);
    };

    useEffect(() => {
        if (!isSendCodeAgain) {
            let timer = 60;
            const timeoutId: NodeJS.Timer = setInterval(() => {
                codeAgainBtn.current && (codeAgainBtn.current.innerText = timer + "");
                if (timer) {
                    timer--;
                } else {
                    clearTimeout(timeoutId);
                    setIsSendCodeAgain(true);
                }
            }, 1000);
        }
    }, [isSendCodeAgain]);

    return (
        <div className={styles.confirmation_code_wrapper} style={{ opacity: +!isConfirmCodeValid }}>
            <div className={`${styles.confirm_code_wrapper_main} ${!isConfirmPageOpen && styles.confirm_page_is_closing}`}>
                <div className={styles.confirm_content_wrapper}>
                    <h2 className={styles.confirmation_title}>{confirmTitle}</h2>
                    <p className={styles.confirmation_clue_text}>{confirmText + (email || (name.includes("@") ? name : recoveryEmail))}</p>
                    <span className={styles.invalid_confirm_code}>{isConfirmCodeInvalid && t("signUp.invalid_confirm_code")}</span>
                    <VerificationInput
                        length={10}
                        autoFocus={true}
                        onChange={toggleConfirmCode}
                        value={confirmCode}
                        onFocus={() => dispatch(resetInvalidConfirmCodeRedux())}
                        classNames={{
                            container: styles.vf_container,
                            character: `${styles.vf_character} ${isConfirmCodeInvalid && styles.active}`,
                            characterInactive: styles.vf_character_inactive,
                            characterSelected: `${styles.vf_character_selected} ${isConfirmCodeInvalid && styles.active}`,
                        }}
                    />
                    <button
                        disabled={!(confirmCode.length === 10)}
                        className={styles.confirmation_confirm_btn}
                        onClick={recoveryEmail ? checkRecoveryCode : confirmConfirmationCode}
                    >
                        {t("sundry.confirm")}
                    </button>
                    <div>
                        <p onClick={backToMainPage}>
                            <ArrowBackIosIcon sx={{ fontSize: "12px" }} />
                            {recoveryEmail ? t("signUp.confirmation.back_to_signIn") : t("signUp.confirmation.back_to_signUp")}
                        </p>
                        <button onClick={recoveryEmail ? sendRecoveryConfirmCodeAgain : sendConfirmCodeAgain} disabled={!isSendCodeAgain}>
                            {t("signUp.confirmation.send_code_again")} {!isSendCodeAgain && <span ref={codeAgainBtn}></span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmCodeSent;
