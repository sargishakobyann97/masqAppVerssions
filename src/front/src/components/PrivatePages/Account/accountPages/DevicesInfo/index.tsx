import { useEffect, useState } from "react";
import devices_media from "../../../../../assets/images/devices_media.png";
import windows_media from "../../../../../assets/images/windows_media.png";
import apple_media from "../../../../../assets/images/apple_media.png";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { getMemberSessionsAsync, getSessionsAsync, removeSessionAsync, resetMemberSessionsList } from "../../../../../store/features/accountSlice";
import BackToSomePage from "../../../../helpersComponents/BackToSomePage";
import { constants } from "../../../../../assets/constants";
import { motion } from "framer-motion";
import styles from "./devices.module.scss";

const devices_wrapper_animation = {
    hidden: {
        x: 50,
        opacity: 0,
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: { delay: 0.1 },
    },
};

function DevicesInfo() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        account: {
            user: { sessions, name },
            activeSub: { type },
            token,
            hash,
            teams,
            memberSessionsList,
        },
        main: { deviceInfo },
    } = useAppSelector((state) => state);
    const { paths } = constants;

    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChangeExpanded = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const isCurrentDevice = (hash: string): boolean => localStorage.getItem("hash") === hash;
    const unMatchDevice = (hash: string): void => {
        if (!isCurrentDevice(hash)) {
            dispatch(removeSessionAsync({ token, deviceInfo, hashToDelete: hash, myHash: localStorage.getItem("hash") || "" }));
        }
    };
    const getMembersSessions = (team: string) => dispatch(getMemberSessionsAsync({ deviceInfo, hash, token, team }));

    useEffect(() => {
        dispatch(getSessionsAsync({ deviceInfo, token, hash }));
    }, []);

    useEffect(() => {
        return () => {
            dispatch(resetMemberSessionsList());
        };
    }, [expanded]);

    return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ amount: 0.5 }} className={styles.devices_wrapper}>
            <motion.div variants={devices_wrapper_animation} className={styles.devices_content_bg}>
                <div className={styles.devices_content_wrapper}>
                    <div className={styles.back_to_account_btn}>
                        <BackToSomePage path={paths.account} page={t("mainAside.account")} />
                    </div>
                    <div className={styles.devices_list_wrapper}>
                        <div className={styles.your_devices_wrapper}>
                            <Accordion
                                sx={{
                                    overflow: "hidden",
                                    minHeight: 84,
                                    background: "#fff",
                                    width: "541px",
                                    boxShadow: "-1px 1px 5px 0px rgba(0, 0, 0, 0.30)",
                                }}
                                style={{ borderRadius: 16 }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="devices_"
                                    sx={{ display: "flex", alignItems: "center", maxHeight: 77 }}
                                >
                                    <div className={styles.devices_list_header}>
                                        <img src={devices_media} alt="devices_media" className={styles.devices_media} />
                                        <div className={styles.header_text_wrapper}>
                                            <h2 className={styles.your_devices_header}>
                                                {t("sundry.your_devices")}
                                                {/* <span className={styles.point_icon}> • </span> */}
                                                {/* <span>
                                                    {type} {t("account.subscription")}
                                                    {t("sundry.your_devices")}
                                                </span> */}
                                            </h2>
                                            <p className={styles.your_devices_text}>{t("account.devices.your_active_devices_text")}</p>
                                        </div>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div className={styles.devices_items_wrapper}>
                                        <div style={{ height: "1px", background: "#e8ebed", width: "100%" }} />
                                        {sessions.map(({ os, cpu, app, hash }) => (
                                            <div key={hash} className={styles.device_item}>
                                                <div className={styles.device_icon}>
                                                    {os.toLowerCase().includes("window") ? (
                                                        <img className={styles.devices_item_media} src={windows_media} alt="windows_media" />
                                                    ) : ["darwin", "macos"].some((os) => os.toLowerCase().includes(os)) ? (
                                                        <img className={styles.devices_item_media} src={apple_media} alt="apple_media" />
                                                    ) : (
                                                        <div className={styles.indefinite_system}>?</div>
                                                    )}
                                                </div>
                                                <div className={styles.device_info_wrapper}>
                                                    {isCurrentDevice(hash) && (
                                                        <span className={styles.device_current}>{t("account.devices.current_device")}</span>
                                                    )}
                                                    <p className={styles.device_os}>{os}</p>
                                                    <p className={styles.devices_cpu_app}>
                                                        {cpu}, {app}
                                                    </p>
                                                </div>
                                                <div className={styles.devices_un_match_btn_wrapper}>
                                                    {!isCurrentDevice(hash) && (
                                                        <button className={styles.unmatch_btn} onClick={() => unMatchDevice(hash)}>
                                                            {t("sundry.unmatch")}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <div className={styles.team_devices_wrapper}>
                            {teams
                                .filter((i) => i.role !== "member")
                                .map((item) => (
                                    <Accordion
                                        sx={{
                                            overflow: "hidden",
                                            minHeight: 84,
                                            background: "#fff",
                                            width: "541px",
                                            boxShadow: "-1px 1px 5px 0px rgba(0, 0, 0, 0.30)",
                                        }}
                                        style={{ borderRadius: 16 }}
                                        key={item._id}
                                        expanded={expanded === item._id}
                                        onChange={handleChangeExpanded(item._id)}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="devices_"
                                            sx={{ display: "flex", alignItems: "center", maxHeight: 77 }}
                                            onClick={() => getMembersSessions(item._id)}
                                        >
                                            <div className={styles.devices_list_header}>
                                                <img src={devices_media} alt="devices_media" className={styles.devices_media} />
                                                <div className={styles.header_text_wrapper}>
                                                    <h2 className={styles.your_devices_header}>
                                                        {t("sundry.devices")} <span className={styles.point_icon}> • </span>
                                                        <span>
                                                            {t("sundry.team")} {item.name}
                                                        </span>
                                                    </h2>
                                                    <p className={styles.your_devices_text}>{t("account.devices.your_active_devices_text")}</p>
                                                </div>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className={styles.team_devices_items_wrapper}>
                                                {memberSessionsList.map((item) => (
                                                    <div key={item.id} className={styles.team_device_item}>
                                                        <p className={styles.team_device_member}>
                                                            {name === item.name ? t("sundry.your") : item.name} {t("sundry.devices")}
                                                        </p>
                                                        <div className={styles.devices_items_wrapper}>
                                                            {item.sessions?.map(({ os, cpu, app, hash }) => (
                                                                <div key={hash} className={styles.device_item}>
                                                                    <div className={styles.device_icon}>
                                                                        {os.toLowerCase().includes("window") ? (
                                                                            <img
                                                                                className={styles.devices_item_media}
                                                                                src={windows_media}
                                                                                alt="windows_media"
                                                                            />
                                                                        ) : ["darwin", "macos"].some((os) => os.toLowerCase().includes(os)) ? (
                                                                            <img
                                                                                className={styles.devices_item_media}
                                                                                src={apple_media}
                                                                                alt="apple_media"
                                                                            />
                                                                        ) : (
                                                                            <div className={styles.indefinite_system}>?</div>
                                                                        )}
                                                                    </div>
                                                                    <div className={styles.device_info_wrapper}>
                                                                        {isCurrentDevice(hash) && (
                                                                            <span className={styles.device_current}>
                                                                                {t("account.devices.current_device")}
                                                                            </span>
                                                                        )}
                                                                        <p className={styles.device_os}>{os}</p>
                                                                        <p className={styles.devices_cpu_app}>
                                                                            {cpu}, {app}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default DevicesInfo;
