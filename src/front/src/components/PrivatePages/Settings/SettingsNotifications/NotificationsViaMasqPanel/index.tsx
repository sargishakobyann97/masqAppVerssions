import { useMemo } from "react";
import BackToSomePage from "../../../../helpersComponents/BackToSomePage";
import { constants } from "../../../../../assets/constants";
import { useTranslation } from "react-i18next";
import HelperSwitch from "../../../../helpersComponents/HelperSwitch";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { setNotificationsSettingsAsync } from "../../../../../store/features/mainSlice";
import styles from "./notifications_via_masq_panel.module.scss";

const NotificationsViaMasqPanel = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        account: { token, hash },
        main: { deviceInfo, appNotificationsSettings },
    } = useAppSelector((state) => state);

    const { paths } = constants;

    const viaMasqItems = useMemo(
        () => [
            { id: "all", header: t("settings.notifications.via_email_steps.via_email_all_emails"), checked: appNotificationsSettings.all },
            {
                id: "update",
                header: t("settings.notifications.via_email_steps.via_email_updates"),
                text: t("settings.notifications.via_email_steps.via_email_updates_text"),
                checked: appNotificationsSettings.update,
                disabled: true,
            },
            {
                id: "invite",
                header: t("settings.notifications.via_email_steps.via_email_team_invite"),
                text: t("settings.notifications.via_email_steps.via_email_team_invite_text"),
                checked: appNotificationsSettings.invite,
            },
            {
                id: "subscription",
                header: t("settings.notifications.via_email_steps.via_email_subscription"),
                text: t("settings.notifications.via_email_steps.via_email_subscription_text"),
                checked: appNotificationsSettings.subscription,
            },
            {
                id: "marketing",
                header: t("settings.notifications.via_email_steps.via_email_marketing"),
                text: t("settings.notifications.via_email_steps.via_email_marketing_text"),
                checked: appNotificationsSettings.marketing,
            },
            {
                id: "gifts",
                header: t("settings.notifications.via_email_steps.via_email_gifts"),
                text: t("settings.notifications.via_email_steps.via_email_gifts_text"),
                checked: appNotificationsSettings.gifts,
            },
            {
                id: "news",
                header: t("settings.notifications.via_email_steps.via_email_news"),
                text: t("settings.notifications.via_email_steps.via_email_news_text"),
                checked: appNotificationsSettings.news,
            },
        ],
        [t, appNotificationsSettings]
    );

    const changeGetNotificationsStatus = (id: string) => {
        dispatch(
            setNotificationsSettingsAsync({
                deviceInfo,
                token,
                hash,
                receiverType: "app",
                notificationsSettings: {
                    ...appNotificationsSettings,
                    [id]: !appNotificationsSettings[id as keyof typeof appNotificationsSettings],
                },
            })
        );
    };

    return (
        <div className={styles.via_masq_wrapper}>
            <BackToSomePage path={`${paths.settings}/${paths.settings_notifications}`} page={t("settings.settings_main_page.notifications")} />
            <div className={styles.via_masq_elements_text_wrapper}>
                <div className={styles.via_masq_text_place}>
                    <h2>{t("settings.notifications.via_masq_panel")}</h2>
                    <p>{t("settings.notifications.all_notifications_turned_off")}</p>
                </div>
                <div className={styles.via_masq_elements_place}>
                    {viaMasqItems.map(({ id, header, text, checked }) => (
                        <div className={styles.via_masq_element} key={id}>
                            <div className={styles.via_masq_element_text_switch}>
                                <div className={styles.via_masq_element_text}>
                                    <h2>{header}</h2>
                                    {text && <p>{text}</p>}
                                </div>
                                <div className={styles.via_masq_element_switch_locker}>
                                    <HelperSwitch
                                        checked={checked}
                                        onChange={() => changeGetNotificationsStatus(id)}
                                        disabled={id !== "all" && !appNotificationsSettings.all}
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

export default NotificationsViaMasqPanel;
