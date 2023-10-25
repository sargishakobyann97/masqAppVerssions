import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StepFourPropsTypes } from "../../../../../../types";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import WestIcon from "@mui/icons-material/West";
import HelperSwitch from "../../../../../helpersComponents/HelperSwitch";
import ProxySettings from "../../../../../helpersComponents/ProxySettings";
import CookiesSettings from "../../../../../helpersComponents/CookiesSettings";
import styles from "./step_four.module.scss";

function StepFour({ initialValues, changeStep }: StepFourPropsTypes) {
    const { t } = useTranslation();

    const [showProxySettings, setShowProxySettings] = useState(false);
    const [showCookiesSettings, setShowCookiesSettings] = useState(false);

    const changeProxyShow = () => setShowProxySettings(!showProxySettings);
    const changeCookiesShow = () => setShowCookiesSettings(!showCookiesSettings);

    const { AFP, AWP, AAP, ACP, changeFingerprintValues, proxy, changeProxy, cookies, changeCookies, geo } = initialValues;

    return (
        <div className={styles.step_four_wrapper}>
            {showProxySettings && <ProxySettings close={changeProxyShow} changeProxy={changeProxy} proxy={proxy} geo={geo} />}
            {showCookiesSettings && <CookiesSettings close={changeCookiesShow} changeCookies={changeCookies} cookies={cookies} />}
            <label className={styles.new_profile_item_label}>{t("newProfile.step_4.proxy")}</label>
            <div className={styles.proxy_cookies_btn} onClick={changeProxyShow}>
                <span>{proxy.hostAndPort ? t("newProfile.step_4.edit_proxy_settings") : t("newProfile.step_4.set_proxy_settings")}</span>
                <ArrowForwardIosIcon />
            </div>
            <label className={styles.new_profile_item_label}>{t("newProfile.step_4.cookies")}</label>
            <div className={styles.proxy_cookies_btn} onClick={changeCookiesShow}>
                <span>{cookies.cookies ? t("newProfile.step_4.edit_cookie_settings") : t("newProfile.step_4.set_cookie_settings")}</span>
                <ArrowForwardIosIcon />
            </div>
            <label className={styles.new_profile_item_label}>{t("newProfile.step_4.fingerprint_system")}</label>
            <div className={styles.fingerprints_wrapper}>
                <div className={styles.finger_item}>
                    <span>Font</span>
                    <HelperSwitch checked={AFP} onChange={() => changeFingerprintValues("AFP")} />
                </div>
                <div className={styles.finger_item}>
                    <span>WebGL</span>
                    <HelperSwitch checked={AWP} onChange={() => changeFingerprintValues("AWP")} />
                </div>
                <div className={styles.finger_item}>
                    <span>Audio</span>
                    <HelperSwitch checked={AAP} onChange={() => changeFingerprintValues("AAP")} />
                </div>
                <div className={styles.finger_item}>
                    <span>Canvas</span>
                    <HelperSwitch checked={ACP} onChange={() => changeFingerprintValues("ACP")} />
                </div>
            </div>
            <div className={styles.next_back_page_wrapper}>
                <div className={styles.back_page_btn} onClick={() => changeStep("step_3")}>
                    <WestIcon sx={{ fontSize: 15 }} />
                    <span>{t("sundry.back")}</span>
                </div>
            </div>
        </div>
    );
}

export default StepFour;
