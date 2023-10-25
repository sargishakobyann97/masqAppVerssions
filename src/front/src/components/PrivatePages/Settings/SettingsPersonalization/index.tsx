import React, { useMemo } from "react";
import engFlag from "../../../../assets/images/flags/us.png";
import ruFlag from "../../../../assets/images/flags/ru.png";
import { useTranslation } from "react-i18next";
import HelperSelect from "../../../helpersComponents/HelperSelect";
import styles from "./personalization.module.scss";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { Link } from "react-router-dom";
import { constants } from "../../../../assets/constants";
import { setAppSettingsAsync } from "../../../../store/features/mainSlice";

const SettingsPersonalization = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        main: {
            appSettings,
            appSettings: { sidebarMenuStyle, defaultScreen, language, sidebar },
            deviceInfo,
        },
        account: { token, hash },
    } = useAppSelector((state) => state);

    const { paths } = constants;

    const sidebarMenuStylesMenuItems = useMemo(
        () => [
            { id: 1, value: "long", text: "settings.personalization.menu_style_long", selected: true },
            { id: 2, value: "short", text: "settings.personalization.menu_style_short" },
        ],
        []
    );

    const defaultScreenMenuItems = useMemo(
        () => [
            // { id: 3, value: "home", text: "mainAside.dashboardHome", disabled: !sidebar.home },
            { id: 4, value: "profiles", text: "mainAside.profiles", disabled: !sidebar.profiles },
            // { id: 5, value: "proxy", text: "mainAside.proxy", disabled: !sidebar.proxy },
            { id: 6, value: "account", text: "mainAside.account", disabled: !sidebar.account },
            // { id: 7, value: "cookies", text: "mainAside.cookies", disabled: !sidebar.cookies },
            { id: 8, value: "notifications", text: "mainAside.notifications", disabled: !sidebar.notifications },
            { id: 9, value: "settings", text: "mainAside.settings", disabled: !sidebar.settings },
        ],
        [sidebar]
    );

    const languageMenuItems = useMemo(
        () => [
            { id: 10, value: "en", text: "countries.us", src: engFlag },
            { id: 11, value: "ru", text: "countries.ru", src: ruFlag, disabled: true },
        ],
        []
    );

    const changeLang = (type: string, value: string) => {
        dispatch(setAppSettingsAsync({ deviceInfo, token, hash, appSettings: { ...appSettings, language: value } }));
        i18n.changeLanguage(value);
    };

    const changeDashboardMenuStyle = (type: string, value: string) => {
        dispatch(setAppSettingsAsync({ deviceInfo, token, hash, appSettings: { ...appSettings, sidebarMenuStyle: value } }));
    };

    const changeDefaultScreen = (type: string, value: string) => {
        dispatch(setAppSettingsAsync({ deviceInfo, token, hash, appSettings: { ...appSettings, defaultScreen: value } }));
    };

    return (
        <div className={styles.settings_personalization_wrapper}>
            <div className={styles.personalization_item}>
                <div className={styles.personalization_item_text_place}>
                    <h2>{t("settings.personalization.side_menu_elements")}</h2>
                    <p>{t("settings.personalization.side_change_menu_elements")}</p>
                </div>
                <div className={styles.personalization_item_toggled_items_place}>
                    <Link to={paths.change_sidebar_menu}>{t("settings.personalization.change_sidebar_menu.text")}</Link>
                </div>
            </div>
            {/* <div className={styles.personalization_item}>
                <div className={styles.personalization_item_text_place}>
                    <h2>{t("settings.personalization.side_menu_style")}</h2>
                    <p>{t("settings.personalization.change_menus_style")}</p>
                </div>
                <div className={styles.personalization_item_toggled_items_place}>
                    <HelperSelect
                        type="sidebarStyle"
                        selectValue={sidebarMenuStyle}
                        menuItems={sidebarMenuStylesMenuItems}
                        onChange={changeDashboardMenuStyle}
                    />
                </div>
            </div> */}
            <div className={styles.personalization_item}>
                <div className={styles.personalization_item_text_place}>
                    <h2>{t("settings.personalization.default_screen")}</h2>
                    <p>{t("settings.personalization.set_first_screen")}</p>
                </div>
                <div className={styles.personalization_item_toggled_items_place}>
                    <HelperSelect
                        type="defaultScreen"
                        selectValue={defaultScreen}
                        menuItems={defaultScreenMenuItems}
                        onChange={changeDefaultScreen}
                    />
                </div>
            </div>
            <div className={styles.personalization_item}>
                <div className={styles.personalization_item_text_place}>
                    <h2>{t("settings.personalization.language")}</h2>
                    <p>{t("settings.personalization.set_default_language")}</p>
                </div>
                <div className={styles.personalization_item_toggled_items_place}>
                    <HelperSelect type="language" selectValue={language} menuItems={languageMenuItems} onChange={changeLang} />
                </div>
            </div>
        </div>
    );
};

export default SettingsPersonalization;
