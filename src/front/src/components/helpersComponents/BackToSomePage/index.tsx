import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import { useAppDispatch } from "../../../store";
import styles from "./back_to_some_page.module.scss";
import { resetByDefaultAccountRedux } from "../../../store/features/accountSlice";
import { resetByDefaultEventsMessageRedux } from "../../../store/features/eventsModalSlice";
import { resetByDefaultSettingsRedux } from "../../../store/features/settingsSlice";
import { resetByDefaultProfiles } from "../../../store/features/profilesSlice";

const BackToSomePage = ({ page, path, color }: { page: string; path: string; color?: string }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const resetByInitial = () => {
        dispatch(resetByDefaultAccountRedux());
        dispatch(resetByDefaultEventsMessageRedux());
        dispatch(resetByDefaultSettingsRedux());
        dispatch(resetByDefaultProfiles());
    };

    return (
        <div>
            <Link to={path} className={styles.back_btn} onClick={resetByInitial}>
                <ArrowBackIosOutlinedIcon sx={{ color }} />
                <span style={{ color }}>
                    {t("sundry.back_to")} {page}
                </span>
            </Link>
        </div>
    );
};

export default BackToSomePage;
