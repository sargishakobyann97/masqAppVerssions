import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { getBrowserVersionAsync, getUserAgentAsync, resetUserAgentRedux } from "../../../../../../store/features/newProfileSlice";
import { useTranslation } from "react-i18next";
import { StepOnePropsTypes } from "../../../../../../types";
import { helpers } from "../../../../../../assets/helpers";
import { useLocation } from "react-router-dom";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import HelperSelect from "../../../../../helpersComponents/HelperSelect";
import styles from "./step_one.module.scss";
import { constants } from "../../../../../../assets/constants";

function StepOne({ initialValues, changeStep }: StepOnePropsTypes) {
    const { t } = useTranslation();
    const { teamInfo } = helpers.convertTeamInfo(useLocation().pathname);
    const {
        newProfileSlice: { browsers, browserVersions, userAgent },
        main: { deviceInfo },
        account: { token, hash },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const { os, changeOs, platform, changePlatform, browser, changeBrowser, browserVersion, changeBrowserVersion } = initialValues;
    const { chooseParameterTypes } = constants;

    const platformItems = browsers[os as keyof typeof browsers];
    const osList = Object.keys(browsers).map((item, i) => ({ id: i, value: item, text: item }));
    const platformsList = os ? Object.keys(browsers[os as keyof typeof browsers]).map((item, i) => ({ id: i, value: item, text: item })) : [];
    const browsersList = platform ? platformItems[platform as keyof typeof platformItems] : [];

    useEffect(() => {
        if (browser && !localStorage.getItem("randomProfile")) {
            dispatch(getBrowserVersionAsync({ deviceInfo, hash, token, info: `/${os} ${platform} ${browser}`, teamInfo }));
        }
    }, [browser]);

    useEffect(() => {
        if (browserVersion && !localStorage.getItem("randomProfile")) {
            dispatch(getUserAgentAsync({ deviceInfo, hash, token, params: `${os} ${platform} ${browser} ${browserVersion}`, teamInfo }));
        } else if (!browserVersion && userAgent) {
            dispatch(resetUserAgentRedux());
        }
    }, [browserVersion]);

    return (
        <div className={styles.step_one_wrapper}>
            <label className={styles.new_profile_item_label}>{t("newProfile.step_1.os")}</label>
            <HelperSelect
                selectValue={os}
                onChange={(type: string, value: string) => changeOs(value)}
                type="platform"
                menuItems={osList}
                customStyles={{ width: "220px" }}
                disabled={false}
                chooseParameterType={chooseParameterTypes.os}
            />
            <label className={styles.new_profile_item_label}>{t("newProfile.step_1.platform")}</label>
            <HelperSelect
                selectValue={platform}
                onChange={(type: string, value: string) => changePlatform(value)}
                type="platform"
                menuItems={platformsList}
                customStyles={{ width: "220px" }}
                disabled={!os}
                chooseParameterType={chooseParameterTypes.platform}
            />
            <label className={styles.new_profile_item_label}>{t("newProfile.step_1.browser")}</label>
            <HelperSelect
                selectValue={browser}
                onChange={(type: string, value: string) => changeBrowser(value)}
                type="platform"
                menuItems={browsersList.map((item, i) => ({ id: i, value: item, text: item }))}
                customStyles={{ width: "220px" }}
                disabled={!platform}
                chooseParameterType={chooseParameterTypes.browser}
            />
            <label className={styles.new_profile_item_label}>{t("newProfile.step_1.browser_version")}</label>
            <HelperSelect
                selectValue={browserVersion}
                onChange={(type: string, value: string) => changeBrowserVersion(value)}
                type="platform"
                menuItems={browserVersions}
                customStyles={{ width: "220px" }}
                disabled={!browser}
                chooseParameterType={chooseParameterTypes.browser_version}
            />
            <div className={styles.next_back_page_wrapper}>
                <div className={styles.back_page_btn} onClick={() => changeStep("step_0")}>
                    <WestIcon sx={{ fontSize: 15 }} />
                    <span>{t("sundry.back")}</span>
                </div>
                <div className={styles.next_page_btn} onClick={() => changeStep("step_2")}>
                    <span>{t("sundry.next")}</span>
                    <EastIcon sx={{ fontSize: 15 }} />
                </div>
            </div>
        </div>
    );
}

export default StepOne;
