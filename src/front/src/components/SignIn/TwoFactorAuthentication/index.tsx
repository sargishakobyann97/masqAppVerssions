import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import VerificationInput from "react-verification-input";
import { useAppDispatch, useAppSelector } from "../../../store";
import { loginAsync, resetTfaCodeData, resetTfaConfirmCode } from "../../../store/features/accountSlice";
import { SignInInitialFormDataTypes } from "../../../types";
import styles from "./two_factor_authentication.module.scss";

const TwoFactorAuthentication = ({ formData }: { formData: SignInInitialFormDataTypes }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        account: { isTfaConfirmCodeInvalid, requiredTfa },
        main: { deviceInfo },
    } = useAppSelector((state) => state);

    const [tfaToken, setTfaToken] = useState<string>("");
    const [tfaPageClosing, setTfaPageClosing] = useState<boolean>(false);

    const toggleConfirmCode = (value: string) => {
        dispatch(resetTfaConfirmCode());
        (new RegExp("[0-9]").test(value) || !value) && setTfaToken(value);
    };

    const handleLoginFromTfa = () => dispatch(loginAsync({ formData, deviceInfo, tfaToken }));
    const backToSignIn = () => {
        setTfaPageClosing(true);
        setTimeout(() => {
            dispatch(resetTfaCodeData());
            setTfaPageClosing(false);
        }, 300);
    };
    const resetInvalidTfa = () => dispatch(resetTfaConfirmCode());

    return (
        <div className={styles.confirmation_code_wrapper}>
            <div className={`${styles.confirm_code_wrapper_main} ${tfaPageClosing && styles.confirm_page_is_closing}`}>
                <div className={styles.confirm_content_wrapper}>
                    <h2 className={styles.confirmation_title}>{t("signUp.confirmation.title")}</h2>
                    <p className={styles.confirmation_clue_text}>{t("signIn.enter_google_code")}</p>
                    <VerificationInput
                        length={6}
                        autoFocus={true}
                        onChange={toggleConfirmCode}
                        value={tfaToken}
                        onFocus={resetInvalidTfa}
                        classNames={{
                            container: styles.vf_container,
                            character: `${styles.vf_character} ${isTfaConfirmCodeInvalid && styles.active}`,
                            characterInactive: styles.vf_character_inactive,
                            characterSelected: `${styles.vf_character_selected} ${isTfaConfirmCodeInvalid && styles.active}`,
                        }}
                    />
                    <button disabled={!(tfaToken.length === 6)} className={styles.confirmation_confirm_btn} onClick={handleLoginFromTfa}>
                        {t("sundry.confirm")}
                    </button>
                    <div>
                        <p onClick={backToSignIn}>
                            <ArrowBackIosIcon sx={{ fontSize: "12px" }} />
                            {t("signUp.confirmation.back_to_signIn")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoFactorAuthentication;
