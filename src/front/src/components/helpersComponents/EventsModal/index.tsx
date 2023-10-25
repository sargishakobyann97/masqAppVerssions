import locker_media from "../../../assets/images/eventsModal/locker_media.png";
import email_logo from "../../../assets/images/eventsModal/email_icon.png";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useTranslation } from "react-i18next";
import { constants } from "../../../assets/constants";
import { setEventsMessageRedux } from "../../../store/features/eventsModalSlice";
import styles from "./events_modal.module.scss";

const HelperSuccessModal = () => {
    const { type, header, message, customMessage, iconName } = useAppSelector((state) => state.eventsModal.isEventsMessage);
    const dispatch = useAppDispatch();
    const {
        eventsMsg: { types },
    } = constants;
    const typeInConstants = types;
    const { t } = useTranslation();

    const handleModalClickToClose = (e: React.MouseEvent<HTMLElement>) => {
        const targetId = (e.target as HTMLElement)?.id;
        targetId === "close_" && dispatch(setEventsMessageRedux(null));
    };
    const handleCloseModal = () => dispatch(setEventsMessageRedux(null));

    let src;

    if (type === typeInConstants.passwordChangeSuccess || type === typeInConstants.recoveryPasswordSuccess) {
        src = locker_media;
    } else if (type === typeInConstants.emailChangeSuccess) {
        src = email_logo;
    }

    if (!type) return <></>;

    return (
        <div className={styles.success_modal_wrapper} id="close_" onClick={(e) => handleModalClickToClose(e)}>
            <div className={styles.modal_main}>
                {iconName ? <div className={`${iconName} ${styles.icon_wrapper}`} /> : <img src={src} alt="locker_media" />}

                <div className={styles.modal_info_place}>
                    <p className={styles.modal_header}>{t(`event_modals.${header}`)}</p>
                    <p className={styles.modal_text}>{customMessage || t(`event_modals.${message}`)}</p>
                </div>
                <p className={styles.close_success_modal} onClick={handleCloseModal}>
                    <CloseIcon />
                </p>
            </div>
        </div>
    );
};

export default HelperSuccessModal;
