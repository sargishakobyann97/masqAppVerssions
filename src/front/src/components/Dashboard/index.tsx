import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { constants } from "../../assets/constants";
import { useTranslation } from "react-i18next";
import AsideHomeLogo from "../../assets/images/svg/AsideHomeLogo";
import AsideProfilesLogo from "../../assets/images/svg/AsideProfilesLogo";
import AsideProxyLogo from "../../assets/images/svg/AsideProxyLogo";
import AsideAccountLogo from "../../assets/images/svg/AsideAccountLogo";
import AsideCookiesLogo from "../../assets/images/svg/AsideCookiesLogo";
import AsideStoreLogo from "../../assets/images/svg/AsideStoreLogo";
import AsideNotificationsLogo from "../../assets/images/svg/AsideNotificationsLogo";
import AsideSettingsLogo from "../../assets/images/svg/AsideSettingsLogo";
import MasqLogo from "../../assets/images/svg/MasqLogo";
import styles from "./dashboard.module.scss";
import { useAppDispatch, useAppSelector } from "../../store";
import { getTariffListAsync } from "../../store/features/mainSlice";
import { resetByDefaultAccountRedux } from "../../store/features/accountSlice";
import { resetByDefaultSettingsRedux } from "../../store/features/settingsSlice";
import { resetByDefaultProfiles } from "../../store/features/profilesSlice";

type BoxProps = {
    children: React.ReactNode;
};

function Dashboard(props: BoxProps) {
    const dispatch = useAppDispatch();
    const {
        main: {
            appSettings: { sidebarOder, sidebar, sidebarMenuStyle, defaultScreen },
        },
        notifications: { isUnread },
    } = useAppSelector((state) => state);
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const full = sidebarMenuStyle === "long";

    const { paths } = constants;

    const items = useMemo(
        () => ({
            // home: {
            //     logo: (fill: boolean) => <AsideHomeLogo fill={fill} />,
            //     path: paths.dashboardHome,
            //     name: t("mainAside.dashboardHome"),
            //     visible: false,
            // },
            profiles: {
                logo: (fill: boolean) => <AsideProfilesLogo fill={fill} />,
                path: paths.profiles,
                name: t("mainAside.profiles"),
                visible: false,
            },
            // proxy: {
            //     logo: (fill: boolean) => <AsideProxyLogo fill={fill} />,
            //     path: paths.proxy,
            //     name: t("mainAside.proxy"),
            //     visible: false,
            // },
            account: {
                logo: (fill: boolean) => <AsideAccountLogo fill={fill} />,
                path: paths.account,
                name: t("mainAside.account"),
                visible: false,
            },
            // cookies: {
            //     logo: (fill: boolean) => <AsideCookiesLogo fill={fill} />,
            //     path: paths.cookies,
            //     name: t("mainAside.cookies"),
            //     visible: false,
            // },
            // store: {
            //     logo: (fill: boolean) => <AsideStoreLogo fill={fill} />,
            //     path: paths.store,
            //     name: t("mainAside.store"),
            //     visible: false,
            // },
            notifications: {
                logo: (fill: boolean) => <AsideNotificationsLogo fill={fill} />,
                path: paths.notifications,
                name: t("mainAside.notifications"),
                visible: false,
            },
            settings: {
                logo: (fill: boolean) => <AsideSettingsLogo fill={fill} />,
                path: paths.settings,
                name: t("mainAside.settings"),
                visible: false,
            },
        }),
        [t]
    );

    const asideItems = sidebarOder.map((order) => ({
        ...items[order as keyof typeof items],
        visible: sidebar[order as keyof typeof sidebar],
    }));

    const clickToAsideLink = (i: number, path: string) => {
        dispatch(resetByDefaultAccountRedux());
        dispatch(resetByDefaultSettingsRedux());
        dispatch(resetByDefaultProfiles());
        if (path === pathname) {
            setTimeout(() => {
                navigate("/none");
            }, 0);
            setTimeout(() => {
                navigate(path);
            }, 1);
        }
    };

    useEffect(() => {
        navigate("/" + defaultScreen);
    }, []);

    return (
        <div className={styles.dashboard_wrapper} style={{ gridTemplateColumns: `${sidebarMenuStyle === "long" ? 280 : 105}px 1fr` }}>
            <div className={styles.main_aside}>
                <div className={styles.masq_logo_wrapper}>
                    <MasqLogo full={full} />
                </div>
                {asideItems.map(
                    (el, i) =>
                        el.visible && (
                            <div key={el.path} className={styles.aside_item}>
                                <Link to={el.path} onClick={() => clickToAsideLink(i, el.path)}>
                                    {el.logo(
                                        "/" + pathname.split("/")[1] === el.path ||
                                            (el.path === paths.profiles && pathname.search(paths.createNewProfile) > -1)
                                    )}
                                    {full && (
                                        <span
                                            className={`${
                                                ("/" + pathname.split("/")[1] === el.path ||
                                                    (el.path === paths.profiles && pathname.search(paths.createNewProfile) > -1)) &&
                                                styles.selected_aside_item
                                            }`}
                                        >
                                            {el.name}
                                        </span>
                                    )}
                                    {el.path === paths.notifications && isUnread && <span className={styles.notifications_is_unread_info}></span>}
                                </Link>
                            </div>
                        )
                )}
                <p>
                    <span>
                        {new Date().getFullYear()} MASQ
                        <span className={styles.aside_shows_the_app_version}>
                            {t("sundry.version")} {process.env.REACT_APP_APP_VERSION}
                        </span>
                    </span>
                </p>
            </div>
            <main className={styles.main_container}>{props.children}</main>
        </div>
    );
}

export default Dashboard;
