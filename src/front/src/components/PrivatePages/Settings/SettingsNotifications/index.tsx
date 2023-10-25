import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { constants } from "../../../../assets/constants";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import styles from "./notifications.module.scss";

const SettingsNotifications = () => {
    const { t } = useTranslation();
    const { paths } = constants;
    return (
        <div className={styles.settings_notifications_wrapper}>
            <Link to={paths.via_email} className={styles.notifications_item}>
                <div className={styles.notifications_item_text_arrow_place}>
                    <div className={styles.notifications_item_text}>
                        <h2>{t("settings.notifications.via_email")}</h2>
                        <p>{t("settings.notifications.all_notifications_turned_on")}</p>
                    </div>
                    <ArrowForwardIosIcon />
                </div>
            </Link>
            <Link to={paths.via_masq_panel} className={styles.notifications_item}>
                <div className={styles.notifications_item_text_arrow_place}>
                    <div className={styles.notifications_item_text}>
                        <h2>{t("settings.notifications.via_masq_panel")}</h2>
                        <p>{t("settings.notifications.all_notifications_turned_off")}</p>
                    </div>
                    <ArrowForwardIosIcon />
                </div>
            </Link>
        </div>
    );
};

export default SettingsNotifications;
