import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";
import { constants } from "../../../assets/constants";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import styles from "./settings.module.scss";
import { useMemo } from "react";
import { useAppDispatch } from "../../../store";
import { resetByDefaultSettingsRedux } from "../../../store/features/settingsSlice";
import { resetByDefaultAccountRedux } from "../../../store/features/accountSlice";
import HelperSearch from "../../helpersComponents/HelperSearch";

function Settings() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { paths } = constants;

    const { pathname } = useLocation();

    const resetByInitial = () => {
        dispatch(resetByDefaultSettingsRedux());
        dispatch(resetByDefaultAccountRedux());
    };

    const settingsAsideItem = useMemo(
        () => [
            { id: 1, name: t("settings.settings_main_page.account"), path: paths.settings },
            { id: 2, name: t("settings.settings_main_page.security"), path: paths.settings_security },
            { id: 3, name: t("settings.settings_main_page.personalization"), path: paths.settings_personalization },
            { id: 4, name: t("settings.settings_main_page.team"), path: paths.settings_team },
            { id: 5, name: t("settings.settings_main_page.notifications"), path: paths.settings_notifications },
        ],
        []
    );

    return (
        <div className={styles.settings_wrapper}>
            <div className={styles.settings_left_side}>
                <h2>Settings</h2>
                <ul className={styles.settings_main_nav}>
                    {settingsAsideItem.map(({ id, name, path }) => (
                        <li key={id}>
                            <Link
                                to={path}
                                className={`${(pathname.split("/")[2] === path || pathname === path) && styles.active}`}
                                onClick={resetByInitial}
                            >
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.settings_right_side}>
                {pathname.split("/").length < 4 && (
                    <div className={styles.settings_input_place}>
                        <HelperSearch placeholder="settings.settings_main_page.search_settings" />
                    </div>
                )}
                <div className={styles.settings_main_wrapper}>
                    <div className={styles.settings_main_outlet}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
