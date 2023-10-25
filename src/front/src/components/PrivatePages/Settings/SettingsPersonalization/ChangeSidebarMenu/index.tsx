import { useState, useMemo, useEffect, memo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { setAppSettingsAsync } from "../../../../../store/features/mainSlice";
import { useTranslation } from "react-i18next";
import { constants } from "../../../../../assets/constants";
import AsideHomeLogo from "../../../../../assets/images/svg/AsideHomeLogo";
import AsideProfilesLogo from "../../../../../assets/images/svg/AsideProfilesLogo";
import AsideProxyLogo from "../../../../../assets/images/svg/AsideProxyLogo";
import AsideAccountLogo from "../../../../../assets/images/svg/AsideAccountLogo";
import AsideCookiesLogo from "../../../../../assets/images/svg/AsideCookiesLogo";
import AsideStoreLogo from "../../../../../assets/images/svg/AsideStoreLogo";
import AsideNotificationsLogo from "../../../../../assets/images/svg/AsideNotificationsLogo";
import AsideSettingsLogo from "../../../../../assets/images/svg/AsideSettingsLogo";
import BackToSomePage from "../../../../helpersComponents/BackToSomePage";
import HelperSwitch from "../../../../helpersComponents/HelperSwitch";
import SwitchLockerLogo from "../../../../../assets/images/svg/SwitchLockerLogo";
import _ from "lodash";
import styles from "./change_sidebar_menu.module.scss";

const ChangeSidebarMenu = () => {
    const dispatch = useAppDispatch();
    const {
        main: {
            appSettings,
            appSettings: { sidebarOder, sidebar, defaultScreen },
            deviceInfo,
        },
        account: { token, hash },
    } = useAppSelector((state) => state);
    const { t } = useTranslation();

    const { paths } = constants;

    const items = useMemo(
        () => ({
            // home: {
            //     id: "home",
            //     logo: (fill: boolean) => <AsideHomeLogo fill={fill} />,
            //     name: t("mainAside.dashboardHome"),
            //     checked: false,
            //     cantChange: false,
            // },
            profiles: {
                id: "profiles",
                logo: (fill: boolean) => <AsideProfilesLogo fill={fill} />,
                name: t("mainAside.profiles"),
                checked: false,
                cantChange: true,
            },
            proxy: {
                id: "proxy",
                logo: (fill: boolean) => <AsideProxyLogo fill={fill} />,
                name: t("mainAside.proxy"),
                checked: false,
                cantChange: false,
            },
            account: {
                id: "account",
                logo: (fill: boolean) => <AsideAccountLogo fill={fill} />,
                name: t("mainAside.account"),
                checked: false,
                cantChange: true,
            },
            cookies: {
                id: "cookies",
                logo: (fill: boolean) => <AsideCookiesLogo fill={fill} />,
                name: t("mainAside.cookies"),
                checked: false,
                cantChange: false,
            },
            store: {
                id: "store",
                logo: (fill: boolean) => <AsideStoreLogo fill={fill} />,
                name: t("mainAside.store"),
                checked: false,
                cantChange: false,
            },
            notifications: {
                id: "notifications",
                logo: (fill: boolean) => <AsideNotificationsLogo fill={fill} />,
                name: t("mainAside.notifications"),
                checked: false,
                cantChange: false,
            },
            settings: {
                id: "settings",
                logo: (fill: boolean) => <AsideSettingsLogo fill={fill} />,
                name: t("mainAside.settings"),
                checked: false,
                cantChange: true,
            },
        }),
        [t]
    );

    const initialAsideItems = sidebarOder.map((order) => ({
        ...items[order as keyof typeof items],
        checked: sidebar[order as keyof typeof sidebar],
    }));

    const [asideItems, setAsideItems] = useState(initialAsideItems);

    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = _.cloneDeep(asideItems);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setAsideItems(items);
    };

    const changeSidebarMenuItemVisible = (id: string, cantChange: boolean) => {
        if (!cantChange && id !== defaultScreen) {
            const newSidebar = { ...sidebar, [id]: !sidebar[id as keyof typeof sidebar] };
            dispatch(setAppSettingsAsync({ deviceInfo, token, hash, appSettings: { ...appSettings, sidebar: newSidebar } }));
        }
    };

    useEffect(() => {
        if (JSON.stringify(initialAsideItems) !== JSON.stringify(asideItems)) setAsideItems(initialAsideItems);
    }, [appSettings]);

    useEffect(() => {
        if (JSON.stringify(asideItems.map(({ id }) => id)) !== JSON.stringify(sidebarOder)) {
            dispatch(setAppSettingsAsync({ deviceInfo, token, hash, appSettings: { ...appSettings, sidebarOder: asideItems.map(({ id }) => id) } }));
        }
    }, [asideItems]);

    return (
        <div className={styles.change_sidebar_wrapper}>
            <BackToSomePage path={`${paths.settings}/${paths.settings_personalization}`} page={t("settings.settings_main_page.personalization")} />
            <div className={styles.sidebar_element_text_wrapper}>
                <div className={styles.sidebar_text_place}>
                    <h2>{t("settings.personalization.side_menu_elements")}</h2>
                    <p>{t("settings.personalization.change_sidebar_menu.choose_elements_order")}</p>
                </div>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="characters">
                        {(provided) => (
                            <div className={styles.sidebar_elements_place} {...provided.droppableProps} ref={provided.innerRef}>
                                {asideItems.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                            <div
                                                className={styles.sidebar_element}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                            >
                                                <div className={styles.sidebar_element_text_switch}>
                                                    <div className={styles.sidebar_element_text_logo}>
                                                        {item.logo(true)}
                                                        <p>{item.name}</p>
                                                    </div>
                                                    <div className={styles.sidebar_element_switch_locker}>
                                                        <HelperSwitch
                                                            checked={item.checked}
                                                            onChange={() => changeSidebarMenuItemVisible(item.id, item.cantChange)}
                                                        />
                                                        {(item.cantChange || item.id === defaultScreen) && <SwitchLockerLogo />}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
};

export default memo(ChangeSidebarMenu);
