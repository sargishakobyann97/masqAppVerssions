import { useTranslation } from "react-i18next";
import end_sessions_logo from "../../../../../assets/images/settings/security/end_sessions_logo.png";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./end_all_sessions_modal.module.scss";

const EndAllSessionsModal = ({ removeAllSessionFn, closePage }: { removeAllSessionFn: Function; closePage: Function }) => {
    const { t } = useTranslation();

    const handleModalClickToClose = (e: React.MouseEvent<HTMLElement>) => {
        const targetId = (e.target as HTMLElement)?.id;
        targetId === "close_" && closePage("isEndAllSessionsModalOpen", false);
    };

    return (
        <div className={styles.end_all_sessions_wrapper} id="close_" onClick={handleModalClickToClose}>
            <div className={styles.end_all_sessions_main_wrapper}>
                <div className={styles.end_all_sessions_close_btn}>
                    <CloseIcon id="close_" />
                </div>
                <div className={styles.sessions_icon_text}>
                    <img src={end_sessions_logo} alt="Logo" />
                    <h2>{t("settings.security.end_sessions_modal.end_sessions_modal_header")}</h2>
                    <p>{t("settings.security.end_sessions_modal.end_sessions_modal_text")}</p>
                </div>
                <div className={styles.sessions_btns}>
                    <button className={styles.sessions_confirm_btn} onClick={() => removeAllSessionFn()}>
                        {t("settings.security.end_sessions_modal.end_sessions_accept_btn")}
                    </button>
                    <button className={styles.sessions_cancel_btn} id="close_">
                        {t("sundry.cancel")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EndAllSessionsModal;
