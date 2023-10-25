import { useMemo } from "react";
import BackToSomePage from "../../../../helpersComponents/BackToSomePage";
import { constants } from "../../../../../assets/constants";
import { useTranslation } from "react-i18next";
import HelperSwitch from "../../../../helpersComponents/HelperSwitch";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { setNotificationsSettingsAsync } from "../../../../../store/features/mainSlice";
import styles from "./notifications_via_email.module.scss";

const NotificationsViaEmail = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        main: { emailNotificationsSettings, deviceInfo },
        account: { token, hash },
    } = useAppSelector((state) => state);
    const { paths } = constants;

    const viaEmailItems = useMemo(
        () => [
            { id: "all", header: t("settings.notifications.via_email_steps.via_email_all_emails"), checked: emailNotificationsSettings.all },
            {
                id: "update",
                header: t("settings.notifications.via_email_steps.via_email_updates"),
                text: t("settings.notifications.via_email_steps.via_email_updates_text"),
                checked: emailNotificationsSettings.update,
            },
            {
                id: "invite",
                header: t("settings.notifications.via_email_steps.via_email_team_invite"),
                text: t("settings.notifications.via_email_steps.via_email_team_invite_text"),
                checked: emailNotificationsSettings.invite,
            },
            {
                id: "subscription",
                header: t("settings.notifications.via_email_steps.via_email_subscription"),
                text: t("settings.notifications.via_email_steps.via_email_subscription_text"),
                checked: emailNotificationsSettings.subscription,
            },
            {
                id: "marketing",
                header: t("settings.notifications.via_email_steps.via_email_marketing"),
                text: t("settings.notifications.via_email_steps.via_email_marketing_text"),
                checked: emailNotificationsSettings.marketing,
            },
            {
                id: "gifts",
                header: t("settings.notifications.via_email_steps.via_email_gifts"),
                text: t("settings.notifications.via_email_steps.via_email_gifts_text"),
                checked: emailNotificationsSettings.gifts,
            },
            {
                id: "news",
                header: t("settings.notifications.via_email_steps.via_email_news"),
                text: t("settings.notifications.via_email_steps.via_email_news_text"),
                checked: emailNotificationsSettings.news,
            },
        ],
        [t, emailNotificationsSettings]
    );

    const changeGetNotificationsStatus = (id: string) => {
        dispatch(
            setNotificationsSettingsAsync({
                deviceInfo,
                token,
                hash,
                receiverType: "email",
                notificationsSettings: {
                    ...emailNotificationsSettings,
                    [id]: !emailNotificationsSettings[id as keyof typeof emailNotificationsSettings],
                },
            })
        );
    };

    return (
        <div className={styles.via_email_wrapper}>
            <BackToSomePage path={`${paths.settings}/${paths.settings_notifications}`} page={t("settings.settings_main_page.notifications")} />
            <div className={styles.via_email_elements_text_wrapper}>
                <div className={styles.via_email_text_place}>
                    <h2>{t("settings.notifications.via_email")}</h2>
                    <p>{t("settings.notifications.some_notifications_turn_on")}</p>
                </div>
                <div className={styles.via_email_elements_place}>
                    {viaEmailItems.map(({ id, header, text, checked }) => (
                        <div className={styles.via_email_element} key={id}>
                            <div className={styles.via_email_element_text_switch}>
                                <div className={styles.via_email_element_text}>
                                    <h2>{header}</h2>
                                    {text && <p>{text}</p>}
                                </div>
                                <div className={styles.via_email_element_switch_locker}>
                                    <HelperSwitch
                                        checked={checked}
                                        onChange={() => changeGetNotificationsStatus(id)}
                                        disabled={id !== "all" && !emailNotificationsSettings.all}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationsViaEmail;
