import { useTranslation } from "react-i18next";
import BackToSomePage from "../../../../helpersComponents/BackToSomePage";
import { constants } from "../../../../../assets/constants";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import YouAreNotTeamMember from "../../../../../assets/images/svg/account/YouAreNoteTeamMemberLogo";
import { Link, useNavigate } from "react-router-dom";
import { setHelperModalTypeRedux } from "../../../../../store/features/helperModalSlice";
import styles from "./teams.module.scss";
import CrownIcon from "../../../../../assets/images/svg/teams/CrownIcon";

function TeamsInfo() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        account: {
            user: { name, type },
            teams,
        },
    } = useAppSelector((state) => state);

    const navigate = useNavigate();

    const { paths, helperModalTypes, userRoleTypes } = constants;

    const manageOrLeaveTeam = (isStandardUser: boolean, teamName: string, id: string) => {
        isStandardUser
            ? dispatch(setHelperModalTypeRedux({ type: helperModalTypes.leaveTeam, configs: { id } }))
            : navigate(paths.account + "/" + paths.teams + "/" + id);
    };

    return (
        <div className={styles.teams_wrapper}>
            <h2 className={styles.teams_header}>{t("sundry.teams")}</h2>
            <BackToSomePage path={paths.account} page={t("mainAside.account")} />
            {teams.length ? (
                <div className={styles.teams_main_wrapper}>
                    <div className={styles.teams_main_header_text}>
                        <p className={styles.your_team}>{t("account.teams.your_teams")}</p>
                        <p className={styles.your_team_text}>
                            {t("account.teams.your_team_text")} {teams.length} {t("account.teams.teams_lowercase")}
                        </p>
                    </div>
                    <div className={styles.all_teams_items_wrapper}>
                        {teams.map((item) => {
                            let userRole;
                            switch (item.role) {
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
                                <div className={styles.team_item} key={item._id}>
                                    <div className={styles.team_item_main_wrapper}>
                                        <div className={styles.team_item_logo}>
                                            <PersonOutlineOutlinedIcon />
                                            {item.role === userRoleTypes.leader && (
                                                <div className={styles.crown_wrapper}>
                                                    <CrownIcon />
                                                </div>
                                            )}
                                        </div>
                                        <p className={styles.team_item_name}>{item.name}</p>
                                        <p className={styles.team_item_status}>{userRole} </p>
                                        <p className={styles.team_item_user_count}>
                                            {item.userCount} {t("sundry.of")} {item.userLimit} {t("account.buy_subscription.users")}
                                        </p>
                                    </div>
                                    <button
                                        className={styles.team_item_btn}
                                        onClick={() => manageOrLeaveTeam(item.role === userRoleTypes.member, item.name, item._id)}
                                    >
                                        {item.role !== userRoleTypes.member ? t("sundry.manage") : t("account.teams.leave_team")}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className={styles.you_arent_team_member}>
                    <YouAreNotTeamMember />
                    <p className={styles.you_arent_team_text}>{t("account.teams.you_arent_team_member")}</p>
                    <Link to={paths.account + "/" + paths.buySubscriptionPlan} className={styles.you_arent_team_btn}>
                        {t("account.teams.create_team")}
                    </Link>
                </div>
            )}
        </div>
    );
}

export default TeamsInfo;
