import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store";
import { loginByTokenAsync } from "../../../store/features/accountSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { constants } from "../../../assets/constants";
import { AccountPageInitialStateTypes } from "../../../types";
import { getAllNotificationsAsync } from "../../../store/features/notificationsSlice";
import { getAppSettingsAsync } from "../../../store/features/mainSlice";
import { getFoldersAsync, getProfilesAsync } from "../../../store/features/profilesSlice";
import { motion } from "framer-motion";
import { helpers } from "../../../assets/helpers";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RefreshIcon from "../../../assets/images/svg/RefreshIcon";
import SearchModal from "./accountPages/SearchModal";
import UsernameBalance from "./accountPages/UsernameBalance";
import styles from "./account.module.scss";

const accountInitialState: AccountPageInitialStateTypes = {
    isSearchOpen: false,
    isAccountMoreOptionOpen: false,
    searchValue: "",
};

const account_pages_first_row_animation = {
    hidden: {
        x: 50,
        opacity: 0,
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: { delay: 0.2 },
    },
};
const account_pages_second_row_animation = {
    hidden: {
        x: -50,
        opacity: 0,
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: { delay: 0.2 },
    },
};

function Account() {
    const { t } = useTranslation();
    const { teamInfo } = helpers.convertTeamInfo(useLocation().pathname);
    const dispatch = useAppDispatch();
    const {
        account: { activeSub, token, hash, teams },
        main: { deviceInfo },
        profiles: { foldersList },
    } = useAppSelector((state) => state);

    const { paths } = constants;
    const navigate = useNavigate();

    const [accountFormData, setAccountFormData] = useState(accountInitialState);

    const modalRef = useRef<HTMLDivElement | null>(null);

    const changeFormDataValues = (type: string, value: string | boolean) => {
        setAccountFormData({ ...accountFormData, [type]: value });
    };

    const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            changeFormDataValues("isAccountMoreOptionOpen", false);
        }
    };

    const handleRefreshPage = () => {
        dispatch(loginByTokenAsync({ token, deviceInfo }));
        dispatch(getAllNotificationsAsync({ token, deviceInfo, hash }));
        dispatch(getAppSettingsAsync({ deviceInfo, token, hash }));
        dispatch(getFoldersAsync({ token, deviceInfo, hash, teamInfo }));
        foldersList.allProfilesFolder._id &&
            dispatch(
                getProfilesAsync({
                    deviceInfo,
                    token,
                    hash,
                    id: foldersList.allProfilesFolder._id,
                    type: "all",
                    teamInfo,
                })
            );
    };

    const navigateToSubscription = () => {
        navigate(activeSub.activated ? paths.account + "/" + paths.subscription : paths.account + "/" + paths.buySubscriptionPlan);
    };

    return (
        <motion.div initial="hidden" whileInView="visible" className={styles.account_wrapper} onClick={(e) => handleModalClick(e)}>
            <div className={styles.account_wrapper_main}>
                {accountFormData.isSearchOpen && <SearchModal close={changeFormDataValues} />}
                <div className={styles.account_pages_wrapper}>
                    <div className={styles.us_balance_wrapper}>
                        <UsernameBalance modalRef={modalRef} isOpen={accountFormData.isAccountMoreOptionOpen} changeOpen={changeFormDataValues} />
                    </div>
                    <div className={styles.subscription_sec_wrapper} onClick={navigateToSubscription}>
                        <div className={styles.subscription_sec_text_wrapper}>
                            <h2 className={styles.subscription_title}> {t("account.subscription")}</h2>
                            <p className={styles.subscription_sub_title}>
                                {activeSub.activated ? t("account.your_active_subscription") : t("account.you_don_t_have_sub")}
                                {activeSub.activated && <span>{activeSub.type}</span>}
                            </p>
                        </div>
                        <div className={styles.subscription_btn_wrapper}>
                            <span className={`${styles.subscription_active_btn} ${!activeSub.activated && styles.subscription_not_active_btn}`}>
                                {activeSub.activated ? t("sundry.active") : t("sundry.note_active")}
                            </span>
                            <Link
                                to={paths.account + "/" + paths.buySubscriptionPlan}
                                className={styles.subscription_plans_btn}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {activeSub.activated ? t("sundry.manage") : t("account.subscription_plans")}
                            </Link>
                        </div>
                    </div>
                    <div className={styles.search_refresh_sec_wrapper}>
                        <div onClick={handleRefreshPage}>
                            <RefreshIcon />
                        </div>
                        <div onClick={() => changeFormDataValues("isSearchOpen", true)}>
                            <SearchOutlinedIcon />
                        </div>
                    </div>
                    <Link to={paths.account + "/" + paths.teams} className={`${styles.sec_row_item} ${styles.teams_wr}`}>
                        <div className={styles.sec_item_texts_wrapper}>
                            <h2>{t("sundry.teams")}</h2>
                            <p>{!!teams.length ? t("account.your_active_team") : t("account.your_none_active_team")}</p>
                        </div>
                        {!!teams.length ? (
                            <div className={styles.account_team_status_wrapper}>
                                <div className={`${styles.account_team_status} ${styles.active}`}>
                                    {teams.length} {t("settings.team.teams")}
                                </div>
                                <span className={styles.sec_item_btn}>{t("sundry.manage")}</span>
                            </div>
                        ) : (
                            <div className={styles.account_team_status_wrapper}>
                                <div className={styles.account_team_status}>{t("account.no_teams")}</div>
                            </div>
                        )}
                    </Link>
                    <Link to={paths.account + "/" + paths.devices} className={`${styles.sec_row_item} ${styles.device_wr}`}>
                        <div className={styles.sec_item_texts_wrapper}>
                            <h2>{t("sundry.devices")}</h2>
                            <p>{t("account.your_active_devices")}</p>
                        </div>
                        <span className={styles.sec_item_btn}>{t("sundry.manage")}</span>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

export default Account;
