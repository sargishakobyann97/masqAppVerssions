import { useTranslation } from "react-i18next";
import HelperSwitch from "../../../helpersComponents/HelperSwitch";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { setInvitesAccessAsync } from "../../../../store/features/accountSlice";
import { Link } from "react-router-dom";
import { constants } from "../../../../assets/constants";
import styles from "./team.module.scss";

const SettingsTeam = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        main: { deviceInfo },
        account: {
            token,
            hash,
            user: { invitesDisabled },
            teams,
        },
    } = useAppSelector((state) => state);

    const { paths } = constants;

    const changeInvitesStatus = () => {
        dispatch(setInvitesAccessAsync({ deviceInfo, token, hash, enable: !invitesDisabled }));
    };

    return (
        <div className={styles.settings_team_wrapper}>
            <div className={styles.settings_team_item}>
                <div className={styles.team_text_place}>
                    <h2>{t("settings.team.your_team")}</h2>
                    <p>
                        <span>{t("settings.team.your_team_text")}</span> <span>{teams.length}</span> <span>{t("settings.team.teams")}</span>
                    </p>
                </div>
                <div className={styles.team_btn_place}>
                    <Link to={paths.account + "/" + paths.teams}>{t("settings.team.view_your_team")}</Link>
                </div>
            </div>
            <div className={styles.settings_team_item}>
                <div className={styles.team_text_place}>
                    <h2>{t("settings.team.invite_access")}</h2>
                    <p>{t("settings.team.can_invite_you")}</p>
                </div>
                <div className={styles.team_btn_place}>
                    <HelperSwitch checked={invitesDisabled} onChange={changeInvitesStatus} />
                </div>
            </div>
        </div>
    );
};

export default SettingsTeam;
