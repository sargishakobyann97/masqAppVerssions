import { useEffect, useMemo, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useTranslation } from "react-i18next";
import { HelperSearchTypes, SearchDataTypes } from "../../../types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import styles from "./helper_search.module.scss";
import { useAppSelector } from "../../../store";

const HelperSearch = ({ style, placeholder }: HelperSearchTypes) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        account: { subs, teams, activeSub },
    } = useAppSelector((state) => state);

    const [searchText, setSearchText] = useState("");
    const allData = useMemo<SearchDataTypes[]>(
        () => [
            // Settings Account
            {
                id: uuid(),
                path: "/settings",
                name: t("settings.settings_main_page.account"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.account"),
                        path: "/settings",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            {
                id: uuid(),
                path: "/settings",
                name: t("settings.account.profile_name"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.account"),
                        path: "/settings",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            // {
            //     id: uuid(),
            //     path: "/settings",
            //     name: t("settings.account.currency"),
            //     type: "panel",
            //     road: [
            //         {
            //             id: uuid(),
            //             name: t("settings.settings_main_page.account"),
            //             path: "/settings",
            //         },
            //         {
            //             id: uuid(),
            //             name: t("mainAside.settings"),
            //             path: "/settings",
            //         },
            //     ],
            // },
            //Settings Security
            {
                id: uuid(),
                path: "/settings/security",
                name: t("settings.settings_main_page.security"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.security"),
                        path: "/settings/security",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            {
                id: uuid(),
                path: "/settings",
                name: t("settings.security.change_email"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.account"),
                        path: "/settings",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            {
                id: uuid(),
                path: "/settings/security",
                name: t("settings.security.change_password"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.security"),
                        path: "/settings/security",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            {
                id: uuid(),
                path: "/settings/security",
                name: t("settings.security.two_step_verification"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.security"),
                        path: "/settings/security",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            {
                id: uuid(),
                path: "/settings/security",
                name: t("settings.security.end_sessions"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.security"),
                        path: "/settings/security",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            {
                id: uuid(),
                path: "/settings",
                name: t("settings.security.delete_account"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.account"),
                        path: "/settings",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            // Settings Security Change Email
            {
                id: uuid(),
                path: "/settings/account/change-email",
                name: t("resetPassword.confirm_password"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("resetPassword.confirm_password"),
                        path: "/settings/account/change-email",
                    },
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.account"),
                        path: "/settings",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            {
                id: uuid(),
                path: "/settings/account/change-email",
                name: t("settings.security.change_email_steps.email_changing"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.security.change_email_steps.email_changing"),
                        path: "/settings/account/change-email",
                    },
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.account"),
                        path: "/settings",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            {
                id: uuid(),
                path: "/settings/account/change-email",
                name: t("settings.security.change_email_steps.confirm_actual_email"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.security.change_email_steps.confirm_actual_email"),
                        path: "/settings/account/change-email",
                    },
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.account"),
                        path: "/settings",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            {
                id: uuid(),
                path: "/settings/account/change-email",
                name: t("settings.security.change_email_steps.set_new_email"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.security.change_email_steps.set_new_email"),
                        path: "/settings/account/change-email",
                    },
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.account"),
                        path: "/settings",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            {
                id: uuid(),
                path: "/settings/account/change-email",
                name: t("settings.security.change_email_steps.new_email_has_set"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.security.change_email_steps.new_email_has_set"),
                        path: "/settings/account/change-email",
                    },
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.account"),
                        path: "/settings",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            //Settings Security Change Password
            {
                id: uuid(),
                path: "/settings/security/change-password",
                name: t("settings.security.change_password_steps.password_changing"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.security.change_password_steps.password_changing"),
                        path: "/settings/security/change-password",
                    },
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.security"),
                        path: "/settings/security",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            {
                id: uuid(),
                path: "/settings/security/change-password",
                name: t("settings.security.change_password_steps.set_new_password"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.security.change_password_steps.set_new_password"),
                        path: "/settings/security/change-password",
                    },
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.security"),
                        path: "/settings/security",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            //Settings personalization
            {
                id: uuid(),
                path: "/settings/personalization",
                name: t("settings.settings_main_page.personalization"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.personalization"),
                        path: "/settings/personalization",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            {
                id: uuid(),
                path: "/settings/personalization",
                name: t("settings.personalization.side_menu_elements"),
                type: "panel",
                road: [
                    { id: uuid(), name: t("settings.settings_main_page.personalization"), path: "/settings/personalization" },
                    { id: uuid(), name: t("mainAside.settings"), path: "/settings" },
                ],
            },
            // {
            //     id: uuid(),
            //     path: "/settings/personalization",
            //     name: t("settings.personalization.side_menu_style"),
            //     type: "panel",
            //     road: [
            //         { id: uuid(), name: t("settings.settings_main_page.personalization"), path: "/settings/personalization" },
            //         { id: uuid(), name: t("mainAside.settings"), path: "/settings" },
            //     ],
            // },
            {
                id: uuid(),
                path: "/settings/personalization",
                name: t("settings.personalization.default_screen"),
                type: "panel",
                road: [
                    { id: uuid(), name: t("settings.settings_main_page.personalization"), path: "/settings/personalization" },
                    { id: uuid(), name: t("mainAside.settings"), path: "/settings" },
                ],
            },
            {
                id: uuid(),
                path: "/settings/personalization",
                name: t("settings.personalization.language"),
                type: "panel",
                road: [
                    { id: uuid(), name: t("settings.settings_main_page.personalization"), path: "/settings/personalization" },
                    { id: uuid(), name: t("mainAside.settings"), path: "/settings" },
                ],
            },
            // Settings personalization Change Sidebar Menu
            {
                id: uuid(),
                path: "/settings/personalization/change-sidebar",
                name: t("settings.personalization.change_sidebar_menu.text"),
                type: "panel",
                road: [
                    { id: uuid(), name: t("settings.personalization.change_sidebar_menu.text"), path: "/settings/personalization/change-sidebar" },
                    { id: uuid(), name: t("settings.settings_main_page.personalization"), path: "/settings/personalization" },
                    { id: uuid(), name: t("mainAside.settings"), path: "/settings" },
                ],
            },
            // Settings Team
            {
                id: uuid(),
                path: "/settings/team",
                name: t("settings.settings_main_page.team"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.team"),
                        path: "/settings/team",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            {
                id: uuid(),
                path: "/settings/team",
                name: t("settings.team.your_team"),
                type: "",
                road: [
                    { id: uuid(), name: t("settings.settings_main_page.team"), path: "/settings/team" },
                    { id: uuid(), name: t("mainAside.settings"), path: "/settings" },
                ],
            },
            {
                id: uuid(),
                path: "/settings/team",
                name: t("settings.team.invite_access"),
                type: "",
                road: [
                    { id: uuid(), name: t("settings.settings_main_page.team"), path: "/settings/team" },
                    { id: uuid(), name: t("mainAside.settings"), path: "/settings" },
                ],
            },
            // Settings Notifications
            {
                id: uuid(),
                path: "/settings/notifications",
                name: t("settings.settings_main_page.notifications"),
                type: "panel",
                road: [
                    {
                        id: uuid(),
                        name: t("settings.settings_main_page.notifications"),
                        path: "/settings/notifications",
                    },
                    {
                        id: uuid(),
                        name: t("mainAside.settings"),
                        path: "/settings",
                    },
                ],
            },
            {
                id: uuid(),
                path: "/settings/notifications",
                name: t("settings.notifications.via_email"),
                type: "",
                road: [
                    { id: uuid(), name: t("settings.settings_main_page.notifications"), path: "/settings/notifications" },
                    { id: uuid(), name: t("mainAside.settings"), path: "/settings" },
                ],
            },
            {
                id: uuid(),
                path: "/settings/notifications",
                name: t("settings.notifications.via_masq_panel"),
                type: "",
                road: [
                    { id: uuid(), name: t("settings.settings_main_page.notifications"), path: "/settings/notifications" },
                    { id: uuid(), name: t("mainAside.settings"), path: "/settings" },
                ],
            },
            //Settings Notifications Via Email
            {
                id: uuid(),
                path: "/settings/notifications/via-email",
                name: t("settings.notifications.via_email"),
                type: "",
                road: [
                    { id: uuid(), name: t("settings.notifications.via_email"), path: "/settings/notifications/via-email" },
                    { id: uuid(), name: t("settings.settings_main_page.notifications"), path: "/settings/notifications" },
                    { id: uuid(), name: t("mainAside.settings"), path: "/settings" },
                ],
            },
            {
                id: uuid(),
                path: "/settings/notifications/via-masq-panel",
                name: t("settings.notifications.via_masq_panel"),
                type: "",
                road: [
                    { id: uuid(), name: t("settings.notifications.via_masq_panel"), path: "/settings/notifications/via-masq-panel" },
                    { id: uuid(), name: t("settings.settings_main_page.notifications"), path: "/settings/notifications" },
                    { id: uuid(), name: t("mainAside.settings"), path: "/settings" },
                ],
            },
            //Notifications
            {
                id: uuid(),
                path: "/notifications",
                name: t("mainAside.notifications"),
                type: "",
                road: [{ id: uuid(), name: t("mainAside.notifications"), path: "/notifications" }],
            },
            {
                id: uuid(),
                path: "/notifications",
                name: t("notifications.all_notifications"),
                type: "",
                road: [{ id: uuid(), name: t("notifications.all_notifications"), path: "/notifications" }],
            },

            // Account Subscription Info
            {
                id: uuid(),
                path: "/account/subscription",
                name: t("account.your_active_subscription_search"),
                type: "",
                road: [
                    { id: uuid(), name: t("account.subscription"), path: "/account/subscription" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            {
                id: uuid(),
                path: "/account/subscription",
                name: t("account.subscriptionSec.available_profiles_search"),
                type: "",
                road: [
                    { id: uuid(), name: t("account.subscription"), path: "/account/subscription" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            {
                id: uuid(),
                path: "/account/subscription",
                name: t("account.subscriptionSec.other_subscriptions_and_options"),
                type: "",
                road: [
                    { id: uuid(), name: t("account.subscriptionSec.other_subscriptions_and_options"), path: "/account/subscription" },
                    { id: uuid(), name: t("account.subscription"), path: "/account/subscription" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            // Account Buy Subscription
            {
                id: uuid(),
                path: "/account/buy-subscription",
                name: t("account.buy_subscription.sub_plan"),
                type: "",
                road: [
                    { id: uuid(), name: t("account.account_more_buy_subscription"), path: "/account/buy-subscription" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            {
                id: uuid(),
                path: "/account/buy-subscription",
                name: t("sundry.light"),
                type: "",
                road: [
                    { id: uuid(), name: t("account.account_more_buy_subscription"), path: "/account/buy-subscription" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            {
                id: uuid(),
                path: "/account/buy-subscription",
                name: t("sundry.pro"),
                type: "",
                road: [
                    { id: uuid(), name: t("account.account_more_buy_subscription"), path: "/account/buy-subscription" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            {
                id: uuid(),
                path: "/account/buy-subscription",
                name: t("sundry.team"),
                type: "",
                road: [
                    { id: uuid(), name: t("account.account_more_buy_subscription"), path: "/account/buy-subscription" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            {
                id: uuid(),
                path: "/account/buy-subscription",
                name: t("account.buy_subscription.renew"),
                type: "",
                road: [
                    { id: uuid(), name: t("account.account_more_buy_subscription"), path: "/account/buy-subscription" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            {
                id: uuid(),
                path: "/account/buy-subscription",
                name: t("account.buy_subscription.renew_or_create_team"),
                type: "",
                road: [
                    { id: uuid(), name: t("account.account_more_buy_subscription"), path: "/account/buy-subscription" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            {
                id: uuid(),
                path: "/account/buy-subscription",
                name: t("account.change_plan"),
                type: "",
                road: [
                    { id: uuid(), name: t("account.account_more_buy_subscription"), path: "/account/buy-subscription" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            //Account Teams
            {
                id: uuid(),
                path: "/account/teams",
                name: t("sundry.teams"),
                type: "",
                road: [
                    { id: uuid(), name: t("sundry.teams"), path: "/account/teams" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            {
                id: uuid(),
                path: "/account/teams",
                name: t("account.teams.your_teams"),
                type: "",
                road: [
                    { id: uuid(), name: t("sundry.teams"), path: "/account/teams" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            {
                id: uuid(),
                path: "/account/teams",
                name: t("account.teams.your_team_text"),
                type: "",
                road: [
                    { id: uuid(), name: t("sundry.teams"), path: "/account/teams" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            // Devices
            {
                id: uuid(),
                path: "/account/devices",
                name: t("account.devices.your_devices"),
                type: "",
                road: [
                    { id: uuid(), name: t("sundry.devices"), path: "/account/devices" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            {
                id: uuid(),
                path: "/account/devices",
                name: t("account.your_active_devices"),
                type: "",
                road: [
                    { id: uuid(), name: t("sundry.devices"), path: "/account/devices" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            {
                id: uuid(),
                path: "/account/devices",
                name: t("account.devices.current_device"),
                type: "",
                road: [
                    { id: uuid(), name: t("sundry.devices"), path: "/account/devices" },
                    { id: uuid(), name: t("mainAside.account"), path: "/account" },
                ],
            },
            //Profiles
            {
                id: uuid(),
                path: "/profiles",
                name: t("mainAside.profiles"),
                type: "",
                road: [{ id: uuid(), name: t("mainAside.profiles"), path: "/profiles" }],
            },
            {
                id: uuid(),
                path: "/profiles",
                name: t("profiles.your_profiles_title"),
                type: "",
                road: [{ id: uuid(), name: t("mainAside.profiles"), path: "/profiles" }],
            },
            {
                id: uuid(),
                path: "/profiles",
                name: t("profiles.your_profiles_text"),
                type: "",
                road: [{ id: uuid(), name: t("mainAside.profiles"), path: "/profiles" }],
            },
            {
                id: uuid(),
                path: "/profiles",
                name: t("profiles.your_profiles_all_profiles"),
                type: "",
                road: [{ id: uuid(), name: t("mainAside.profiles"), path: "/profiles" }],
            },
            {
                id: uuid(),
                path: "/profiles",
                name: t("profiles.your_profiles_favorite"),
                type: "",
                road: [{ id: uuid(), name: t("mainAside.profiles"), path: "/profiles" }],
            },
            // Profiles create folder page
            {
                id: uuid(),
                path: "/profiles/create-folder",
                name: t("profiles.create_folder"),
                type: "",
                road: [
                    { id: uuid(), name: t("profiles.create_folder"), path: "/profiles/create-folder" },
                    { id: uuid(), name: t("mainAside.profiles"), path: "/profiles" },
                ],
                disabled: !activeSub.activated,
            },
            {
                id: uuid(),
                path: "/profiles/create-folder",
                name: t("profiles.create_folder_header"),
                type: "",
                road: [
                    { id: uuid(), name: t("profiles.create_folder"), path: "/profiles/create-folder" },
                    { id: uuid(), name: t("mainAside.profiles"), path: "/profiles" },
                ],
                disabled: !activeSub.activated,
            },
        ],
        [t, activeSub, teams]
    );

    const location = useLocation().pathname.split("/")[1];

    const [foundItems, setFoundItems] = useState<[] | SearchDataTypes[]>([]);

    const searchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };
    const navigateFn = (path: string) => {
        navigate(path);
    };
    const resetByDefault = () => {
        setTimeout(() => {
            setSearchText("");
            setFoundItems([]);
        }, 100);
    };

    useEffect(() => {
        const all = ["settings", "profiles"].every((item) => item !== location);
        const arr = allData.filter(
            (item) => (all || item.path.split("/")[1] === location) && item.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFoundItems(arr);
    }, [searchText]);

    return (
        <div className={styles.search_wrapper} style={style}>
            <input
                type="search"
                className={styles.search}
                placeholder={t(placeholder) + ""}
                value={searchText}
                onChange={searchValue}
                onBlur={resetByDefault}
                style={{ fontSize: style?.fontSize, borderRadius: style?.borderRadius, paddingLeft: style?.inpPaddingLeft }}
            />
            <div className={styles.search_icon} style={{ top: style?.iconTop, left: style?.iconLeft }}>
                <SearchOutlinedIcon sx={{ width: style?.iconWidth ? style.iconWidth : 14 }} />
            </div>
            <div className={`${styles.found_items_wrapper} ${searchText.length > 0 && styles.active}`}>
                {foundItems.length ? (
                    foundItems.map(
                        (item) =>
                            !item.disabled && (
                                <div className={styles.found_item} key={item.id} onClick={() => navigateFn(item.path)}>
                                    <span title={item.name}>{item.name}</span>
                                    <div className={styles.found_item_paths_wrapper}>
                                        {item.road.map((el, i) => (
                                            <Link to={el.path} className={styles.found_item_path} key={el.id} onClick={(e) => e.stopPropagation()}>
                                                <span>{el.name}</span>
                                                {!!i && <span>/</span>}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )
                    )
                ) : (
                    <span className={styles.nothing_found_message}>{t("search.nothing_found")}</span>
                )}
            </div>
        </div>
    );
};

export default HelperSearch;
