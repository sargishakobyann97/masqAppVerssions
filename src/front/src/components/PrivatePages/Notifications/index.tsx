import { useState, useMemo, useEffect, useRef } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import notificationImage from "../../../assets/images/Rectangle 218.png";
import {
    readAllNotificationsAsync,
    readNotificationAsync,
    getAllNotificationsAsync,
    inviteCodeUseAsync,
    acceptShareAsync,
} from "../../../store/features/notificationsSlice";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useTranslation } from "react-i18next";
import { constants } from "../../../assets/constants";
import styles from "./notifications.module.scss";

function Notifications() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        main: {
            deviceInfo,
            appSettings: { language },
        },
        account: {
            user: { emailConfirmed },
            token,
            hash,
        },
        notifications: { isUnread, notificationsList },
    } = useAppSelector((state) => state);

    const {
        paths,
        notificationTypes: { message, invite, share_profile, share_profile_folder },
    } = constants;
    const today = useMemo(() => new Date().toISOString().split("T")[0], []);
    const [readMore, setReadMore] = useState("");
    const currentDay = useRef("");
    const readMessagesInPending = useRef<string[]>([]);
    currentDay.current = "";
    const prefix = language === "ru" ? "Rus" : "";

    const [list, setList] = useState(notificationsList);
    const [filterValue, setFilterValue] = useState("all");

    const changeFilterValue = (event: SelectChangeEvent) => {
        const type = event.target.value;
        let newList = notificationsList;
        setFilterValue(type);
        if (type !== "all") {
            newList = notificationsList.filter((item) => (type === "read" ? item.isRead : !item.isRead));
        }
        setList(newList);
    };

    const handleReadMore = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
        if (id && id !== readMore) {
            e.stopPropagation();
            setReadMore(id);
        } else setReadMore("");
    };
    const handleReadAllNotifications = () => {
        isUnread && dispatch(readAllNotificationsAsync({ token, deviceInfo, hash }));
    };
    const handleOpenLink = (e: React.MouseEvent<HTMLDivElement>, url: string) => {
        e.stopPropagation();
        window.open(url, "_blank");
    };
    const handleReadNotification = (e: React.MouseEvent<HTMLDivElement>, id: string, isRead: boolean) => {
        handleReadMore(e, id);
        currentDay.current = "";

        if (!isRead && filterValue !== "all" && !readMessagesInPending.current.some((el) => el === id)) {
            readMessagesInPending.current.push(id);
        } else if (filterValue === "all" && !isRead) {
            dispatch(readNotificationAsync({ token, deviceInfo, hash, ids: [id] }));
        }
    };

    const joinTeam = (code: string, teamName: string) => {
        dispatch(inviteCodeUseAsync({ token, deviceInfo, hash, code, teamName }));
    };

    const acceptShare = (id: string, acceptType: string) => {
        dispatch(acceptShareAsync({ token, deviceInfo, hash, id, acceptType }));
    };

    useEffect(() => {
        emailConfirmed && dispatch(getAllNotificationsAsync({ token, deviceInfo, hash }));
    }, [emailConfirmed, deviceInfo]);

    useEffect(() => {
        notificationsList.length && setList(notificationsList);
    }, [notificationsList]);

    useEffect(() => {
        if (filterValue !== "unread" && readMessagesInPending.current.length) {
            dispatch(readNotificationAsync({ token, deviceInfo, hash, ids: readMessagesInPending.current }));
            readMessagesInPending.current = [];
        }
        return () => {
            const i = window.location.href.indexOf("#");
            const path = window.location.href.slice(i + 1);
            if (readMessagesInPending.current.length && path !== paths.notifications) {
                dispatch(readNotificationAsync({ token, deviceInfo, hash, ids: readMessagesInPending.current }));
            }
        };
    }, [filterValue]);

    return (
        <div className={styles.notifications_wrapper} onClick={(e) => handleReadMore(e, "")}>
            <div className={styles.main_central}>
                <div className={styles.up_notification}>
                    <p className={styles.header}>{t("mainAside.notifications")}</p>
                    <div className={styles.notifications_filter_and_read_all}>
                        <div className={styles.notifications_filter}>
                            <FormControl sx={{ minWidth: 180 }}>
                                <Select
                                    value={filterValue}
                                    onChange={changeFilterValue}
                                    displayEmpty
                                    variant="standard"
                                    disableUnderline
                                    inputProps={{ "aria-label": "Without label" }}
                                    style={{ backgroundColor: "none" }}
                                    sx={{ backgroundColor: "none" }}
                                >
                                    <MenuItem className={styles.filter_item} value={"all"}>
                                        {t("notifications.all_notifications")}
                                    </MenuItem>
                                    <MenuItem className={styles.filter_item} value={"read"}>
                                        {t("notifications.read_notifications")}
                                    </MenuItem>
                                    <MenuItem className={styles.filter_item} value={"unread"}>
                                        {t("notifications.unread_notifications")}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <button className={styles["notifications_read_all" + (!isUnread ? "_disabled" : "")]} onClick={handleReadAllNotifications}>
                            <DoneAllIcon />
                            <span>{t("notifications.mark_all_notifications_as_read")}</span>
                        </button>
                    </div>
                </div>
                <div className={styles.all_notifications}>
                    {list.map((el) => {
                        let isTitleExist = false;
                        const day = new Date(el.createAt).toISOString().split("T")[0];
                        if (currentDay.current !== day) {
                            isTitleExist = true;
                            currentDay.current = day;
                        }
                        return (
                            <div className={styles.notification_item} key={el.createAt}>
                                {isTitleExist && <p className={styles.notification_date}>{day === today ? t("notifications.today") : day}</p>}
                                {el.type === invite && (
                                    <div className={styles.invites_notify}>
                                        <p className={styles.invite_color}></p>
                                        <p className={styles.invite_title}>{t("notifications.team_invite")}</p>
                                        <p className={styles.invite_sub_title}>
                                            <span>{el.inviterName}</span>
                                            <span>{t("notifications.invite_message_body")}</span>
                                            <span>"{el.teamName}"</span>
                                        </p>
                                        <p className={styles.invite_button} onClick={() => joinTeam(el.code, el.teamName)}>
                                            {t("notifications.join_team")}
                                        </p>
                                    </div>
                                )}
                                {el.type === share_profile && (
                                    <div className={styles.invites_notify}>
                                        <p className={styles.invite_color}></p>
                                        <p className={styles.invite_title}>{t("sundry.profile")}</p>
                                        <p className={styles.invite_sub_title}>
                                            <span>{el.ownerName}</span>
                                            <span>{t("notifications.invite_profile_message_body")}</span>
                                            <span>"{el.name}"</span>
                                        </p>
                                        <p className={styles.invite_button} onClick={() => acceptShare(el.id, share_profile)}>
                                            {t("sundry.save_profile")}
                                        </p>
                                    </div>
                                )}
                                {el.type === share_profile_folder && (
                                    <div className={styles.invites_notify}>
                                        <p className={styles.invite_color}></p>
                                        <p className={styles.invite_title}>{t("sundry.folder")}</p>
                                        <p className={styles.invite_sub_title}>
                                            <span>{el.ownerName}</span>
                                            <span>{t("notifications.invite_folder_message_body")}</span>
                                            <span>"{el.name}"</span>
                                        </p>
                                        <p className={styles.invite_button} onClick={() => acceptShare(el.id, share_profile_folder)}>
                                            {t("sundry.save_folder")}
                                        </p>
                                    </div>
                                )}

                                {el.type === message && (
                                    <div
                                        className={`${styles.notification} ${readMore === el._id && styles.active_e}`}
                                        onClick={(e) => handleReadNotification(e, el._id, el.isRead)}
                                    >
                                        <div className={styles.notification_main}>
                                            <img src={notificationImage} alt="Loading ..." />
                                            <div className={styles.notification_text_place}>
                                                <p className={styles.notification_header}>
                                                    <span> {el[`header${prefix}`]} </span>
                                                    {!el.isRead && <span>{t("sundry.new")}</span>}
                                                </p>
                                                <p className={`${styles.notification_text_readMore} ${readMore === el._id && styles.active}`}>
                                                    {el[`text${prefix}`]}
                                                </p>
                                            </div>
                                            {el[`buttonName${prefix}`] && (
                                                <div className={styles.notification_btn}>
                                                    <p
                                                        onClick={(e) => handleOpenLink(e, el.buttonUrl)}
                                                        title={el[`buttonName${prefix}`].length > 15 ? el[`buttonName${prefix}`] : ""}
                                                    >
                                                        <span>{el[`buttonName${prefix}`]}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Notifications;
