import { useState, useMemo } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store";
import { resetByDefaultAccountRedux, sendRecoveryCodeAsync } from "../../../store/features/accountSlice";
import { RecoveryDateTypes } from "../../../types";
import styles from "./reset_password_mail_page.module.scss";
import { constants } from "../../../assets/constants";

const ResetPasswordMailPage = ({
    setRecoveryData,
    backToSignIn,
}: {
    setRecoveryData: React.Dispatch<React.SetStateAction<RecoveryDateTypes>>;
    backToSignIn: Function;
}) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        main: { deviceInfo },
        account: { recoveryEmail },
    } = useAppSelector((state) => state);

    const { emailPattern } = constants;

    const [isPasswordResetPageOpen, setIsPasswordResetPageOpen] = useState(true);
    const [recoveryName, setRecoveryName] = useState("");

    const sendRecoveryCode = () => {
        dispatch(sendRecoveryCodeAsync({ deviceInfo, name: recoveryName }));
        setRecoveryData((state) => ({ ...state, name: recoveryName }));
    };
    const changeNameEmailValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRecoveryName(e.target.value);
    };

    const backToMainPage = () => {
        setIsPasswordResetPageOpen(false);
        dispatch(resetByDefaultAccountRedux());
        setTimeout(backToSignIn, 200);
    };

    return (
        <div className={styles.reset_pass_wrapper} style={{ opacity: +!recoveryEmail }}>
            <div className={`${styles.reset_pass_wrapper_main} ${!isPasswordResetPageOpen && styles.reset_pass_is_closing}`}>
                <div className={styles.reset_pass_content_wrapper}>
                    <h2 className={styles.reset_pass_header}>{t("resetPassword.resetPassword")}</h2>
                    <p className={styles.reset_pass_text}>{t("resetPassword.enter_your_email")}</p>
                    <input className={styles.reset_pass_input} type="text" onChange={changeNameEmailValue} value={recoveryName} />
                    <button
                        className={styles.reset_pass_send_btn}
                        onClick={sendRecoveryCode}
                        disabled={!(recoveryName.includes("@") ? emailPattern.test(recoveryName) : recoveryName.length > 2)}
                    >
                        {t("sundry.send_code")}
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

export default ResetPasswordMailPage;
