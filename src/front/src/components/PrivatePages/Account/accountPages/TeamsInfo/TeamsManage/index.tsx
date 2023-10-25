import { MutableRefObject, useRef, useState, useEffect } from "react";
import BackToSomePage from "../../../../../helpersComponents/BackToSomePage";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import teams_media from "../../../../../../assets/images/teams_media.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { constants } from "../../../../../../assets/constants";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { changeRoleAsync, changeTeamNameAsync, getManageTeamsInfoAsync } from "../../../../../../store/features/accountSlice";
import { sendInviteCodeAsync } from "../../../../../../store/features/mainSlice";
import { setHelperModalTypeRedux } from "../../../../../../store/features/helperModalSlice";
import styles from "./teams_manage.module.scss";
import CrownIcon from "../../../../../../assets/images/svg/teams/CrownIcon";

const initialRole = { id: "", role: "", open: false };

const TeamsManage = () => {
    const { t } = useTranslation();
    const { paths, userRoleTypes, helperModalTypes } = constants;
    const {
        account: { teams, token, hash, manageTeamInfo, user },
        main: { deviceInfo },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const id = useLocation().pathname.split("/account/teams/")[1];
    const team = teams.find((t) => t._id === id) || teams[0];

    const [inviteName, setInviteName] = useState<string>("");
    const [role, setRole] = useState(initialRole);
    const [isNameEdit, setIsNameEdit] = useState<boolean>(false);
    const [newTeamName, setNewTeamName] = useState<string>(team?.name || "");
    const nameInp = useRef() as MutableRefObject<HTMLInputElement>;

    const changeNameEdit = (type: string, isOpen: boolean) => {
        if (type === "save") {
            if (newTeamName && newTeamName !== team?.name) {
                dispatch(changeTeamNameAsync({ token, hash, deviceInfo, teamId: team?._id + "", newName: newTeamName }));
            } else {
                setNewTeamName(team.name);
            }
        }
        setIsNameEdit(isOpen);
    };
    // const saveNameChanges = () => {
    //     setIsNameEdit(false);
    //     if (newTeamName && newTeamName !== team?.name) {
    //         dispatch(changeTeamNameAsync({ token, hash, deviceInfo, teamId: team?._id + "", newName: newTeamName }));
    //     }
    // };

    const changeRoleId = (id: string, role: string, open: boolean) => {
        setRole({ role, open, id });
    };

    const sendIndite = () => {
        inviteName && dispatch(sendInviteCodeAsync({ token, hash, deviceInfo, team: id, userName: inviteName }));
        setInviteName("");
    };
    const deleteTeamItem = (userId: string, userName: string) => {
        dispatch(setHelperModalTypeRedux({ type: helperModalTypes.deleteTeamItem, configs: { userId, userName, teamId: id } }));
    };

    useEffect(() => {
        isNameEdit && nameInp.current.focus();
    }, [isNameEdit]);

    useEffect(() => {
        dispatch(getManageTeamsInfoAsync({ token, hash, deviceInfo, team: id }));
    }, []);

    useEffect(() => {
        if (!role.open && role.id && role.role) {
            dispatch(changeRoleAsync({ token, hash, deviceInfo, teamId: id, userId: role.id, role: role.role }));
        }
    }, [role]);

    return (
        <div
            className={styles.teams_manage_wrapper}
            id="teams_manage_wrapper"
            onClick={(e) => {
                const elem = e.target as HTMLElement;
                role.id && elem.id !== "role_item" && elem.id !== "role_item_wrapper" && setRole(initialRole);
            }}
        >
            <BackToSomePage path={paths.account + "/" + paths.teams} page={t("mainAside.account")} />
            <div className={styles.page_main_info_wrapper}>
                <div className={styles.manage_team_name_wrapper}>
                    <div className={styles.manage_user_logo}>
                        <PersonOutlineOutlinedIcon />
                    </div>
                    <input
                        className={`${isNameEdit && styles.inp_bottom_border}`}
                        type="text"
                        ref={nameInp}
                        value={newTeamName}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (new RegExp("^[a-zA-Z0-9]+$").test(v) || v === "") setNewTeamName(v);
                        }}
                        readOnly={!isNameEdit}
                    />
                    <h3
                        onClick={(e) => {
                            changeNameEdit(isNameEdit ? "save" : "", !isNameEdit);
                        }}
                    >
                        {!isNameEdit ? t("account.teams.edit_team_name") : t("sundry.save")}
                    </h3>
                </div>
                <div className={styles.team_members_wrapper}>
                    <div className={styles.team_members_header}>
                        <img src={teams_media} alt="teams_media" />
                        <p>
                            <span>
                                {t("account.teams.add_members_title")}
                                <span className={styles.point_icon}> • </span>
                            </span>
                            <span>{manageTeamInfo?.userLimit - manageTeamInfo?.users.length}</span>
                            <span>{t("account.teams.more_left")}</span>
                        </p>
                        <p>{t("account.teams.add_members_sub_title")}</p>
                    </div>
                    <div className={styles.manage_user_items_wrapper}>
                        {manageTeamInfo.users.map((manageUser) => {
                            let userRole;
                            switch (manageUser.role) {
                                case userRoleTypes.leader:
                                    userRole = t("account.teams.group_leader");
                                    break;
                                case userRoleTypes.moder:
                                    userRole = t("account.teams.moderator");
                                    break;
                                default:
                                    userRole = t("account.teams.standard_user");
                                    break;
                            }
                            return (
                                <div key={manageUser.name} className={styles.manage_user_item}>
                                    <div className={styles.manage_user_logo}>
                                        <PersonOutlineOutlinedIcon />
                                        {manageUser.role === userRoleTypes.leader && (
                                            <div className={styles.crown_wrapper}>
                                                <CrownIcon />
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.manage_name_email_wrapper}>
                                        <p>{manageUser.name}</p>
                                        <p>{manageUser.email}</p>
                                    </div>
                                    <div className={styles.manage_data_added_wrapper}>
                                        <p>{t("account.teams.data_added")}</p>
                                        <p>
                                            <span>
                                                {new Intl.DateTimeFormat("en-US", {
                                                    month: "short",
                                                }).format(new Date(manageUser.dateAdded))}
                                            </span>
                                            <span> {new Date(manageUser.dateAdded).getFullYear()}</span>
                                        </p>
                                    </div>
                                    <div
                                        className={styles.manage_role_wrapper}
                                        onClick={(e) => {
                                            const elem = e.target as HTMLElement;
                                            elem.id === "role_item_wrapper" &&
                                                manageUser.role !== userRoleTypes.leader &&
                                                manageUser.name !== user.name &&
                                                changeRoleId(manageUser.id, "", !role.open);
                                        }}
                                        id="role_item_wrapper"
                                    >
                                        <p>{userRole}</p>
                                        {manageUser.role !== userRoleTypes.leader && manageUser.name !== user.name && <KeyboardArrowDownIcon />}
                                        {role.id === manageUser.id && role.open && (
                                            <div className={styles.roles_wrapper}>
                                                {manageUser.role !== userRoleTypes.moder && (
                                                    <div
                                                        className={styles.role_item}
                                                        id="role_item"
                                                        onClick={() => changeRoleId(manageUser.id, userRoleTypes.moder, false)}
                                                    >
                                                        {t("account.teams.moderator")}
                                                    </div>
                                                )}
                                                {manageUser.role !== userRoleTypes.member && (
                                                    <div
                                                        className={styles.role_item}
                                                        id="role_item"
                                                        onClick={() => changeRoleId(manageUser.id, userRoleTypes.member, false)}
                                                    >
                                                        {t("account.teams.standard_user")}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {manageUser.role !== userRoleTypes.leader && manageUser.name !== user.name && (
                                        <div className={styles.manage_item_delete_btn} onClick={() => deleteTeamItem(manageUser.id, manageUser.name)}>
                                            {t("sundry.delete")}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className={styles.invite_wrapper}>
                    <h2 className={styles.invite_title}>{t("account.teams.invite_title")}</h2>
                    <h3 className={styles.invite_sub_title}>{t("account.teams.invite_sub_title")}</h3>
                    <div className={styles.invite_inp_wrapper}>
                        <input
                            type="text"
                            placeholder={t("account.teams.nick_or_email") + ""}
                            value={inviteName}
                            onChange={(e) => setInviteName(e.target.value)}
                        />
                        <button onClick={sendIndite}>{t("sundry.send_invite")}</button>
                        {/* <p
                            onClick={() => {
                                window.navigator.clipboard.writeText(manageTeamInfo.inviteCode);
                            }}
                        >
                            {t("account.teams.copy_code")}
                            <InsertLinkIcon />
                        </p> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamsManage;
