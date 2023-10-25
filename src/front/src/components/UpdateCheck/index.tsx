import { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import masq_logo from "../../assets/images/Logo.png";
import { constants } from "../../assets/constants";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAppVersionAsync } from "../../store/features/mainSlice";
import { UpdateCheckTypes } from "../../types";
import styles from "./update_check.module.scss";

const UpdateCheck = ({ appVersionStatus }: { appVersionStatus: string }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        main: { appVersion },
    } = useAppSelector((state) => state);

    const { appVersionStatusTypes } = constants;
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        dispatch(getAppVersionAsync());
        const timer: NodeJS.Timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) return 0;
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 500);
        return () => clearInterval(timer);
    }, []);
    const types: UpdateCheckTypes = {
        [appVersionStatusTypes.checking]: (
            <div>
                <h1>{t("updateCheck.update_check")}</h1>
                <Box sx={{ width: "300px" }}>
                    <Stack sx={{ width: "100%", color: "#560BAD" }} spacing={2}>
                        <LinearProgress variant="indeterminate" value={progress} color="inherit" />
                    </Stack>
                </Box>
            </div>
        ),
        [appVersionStatusTypes.invalid]: (
            <div>
                <h1>{t("updateCheck.old_version_text")}</h1>
                <h2>
                    <span>{process.env.REACT_APP_APP_VERSION}</span>
                    <ArrowRightAltIcon />
                    <span>{appVersion}</span>
                </h2>
                <a target="_blank" href="https://masqad.com/">
                    {t("updateCheck.dwn_now")}
                </a>
            </div>
        ),
    };
    return (
        <div className={styles.update_check_wrapper}>
            <div className={styles.update_check_main}>
                <img src={masq_logo} alt="MASQ Logo" />
                {types[appVersionStatus]}
            </div>
        </div>
    );
};

export default UpdateCheck;
