import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useTranslation } from "react-i18next";
import { InitialProxyDataTypes, ProxySettingsPropsTypes } from "../../../types";
import { checkProxyAsync, getGeocodeAsync, resetGeocodeRedux } from "../../../store/features/proxySlice";
import { helpers } from "../../../assets/helpers";
import { useLocation } from "react-router-dom";
import WestIcon from "@mui/icons-material/West";
import HelperSelect from "../HelperSelect";
import styles from "./proxy_settings.module.scss";

const initialProxyData: InitialProxyDataTypes = {
    hostAndPort: "",
    protocol: "SOCKS5",
    login: "",
    password: "",
    geo: "",
    name: "",
    geocode: {},
    timezone: {
        daylight: "",
        location: "",
        offset: 0,
        standard: "",
    },
};

function ProxySettings({ close, proxy, changeProxy, geo }: ProxySettingsPropsTypes) {
    const { t } = useTranslation();
    const { teamInfo } = helpers.convertTeamInfo(useLocation().pathname);
    const dispatch = useAppDispatch();
    const {
        main: { deviceInfo },
        account: { hash, token },
        proxy: { geocodeRedux },
    } = useAppSelector((state) => state);
    const firstRun = useRef<boolean>(true);
    const [proxyData, setProxyData] = useState({ ...initialProxyData, ...proxy });
    const [geolocation, setGeolocation] = useState(geo || "");

    const changeGeolocation = (geolocation: string) => {
        setGeolocation(geolocation);
        setProxyData({ ...proxyData, geo: geolocation });
    };
    const changeProxyFormData = (type: string, value: string) => {
        setProxyData({ ...proxyData, [type]: value.trim() });
    };

    const checkProxy = () => {
        dispatch(checkProxyAsync({ deviceInfo, hash, token, proxyData, teamInfo }));
    };
    const saveProxy = () => {
        dispatch(checkProxyAsync({ deviceInfo, hash, token, proxyData, close, changeProxy, teamInfo }));
    };
    const deleteProxyData = () => setProxyData({ ...initialProxyData });

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (firstRun.current) {
            firstRun.current = false;
        } else {
            if (geolocation) {
                timeoutId = setTimeout(() => {
                    dispatch(getGeocodeAsync({ deviceInfo, hash, token, geolocation, teamInfo }));
                }, 500);
            } else {
                dispatch(resetGeocodeRedux());
            }
        }
        return () => {
            clearTimeout(timeoutId);
        };
    }, [geolocation]);

    useEffect(() => {
        Object.keys(geocodeRedux).length && setProxyData({ ...proxyData, geocode: geocodeRedux });
    }, [geocodeRedux]);

    return (
        <div className={styles.proxy_settings_wrapper}>
            <p className={styles.back_to_profiles_btn} onClick={() => close()}>
                <WestIcon />
                <span>{t("proxySettings.back_btn")}</span>
            </p>
            <p className={styles.delete_proxy_btn} onClick={deleteProxyData}>
                <span>{t("proxySettings.delete_proxy_btn")}</span>
            </p>
            <div className={styles.proxy_inputs_wrapper}>
                <div>
                    <label className={styles.new_profile_item_label}>{t("proxySettings.proxy")}</label>
                    <HelperSelect
                        selectValue={proxyData.protocol}
                        onChange={(type: string, value: string) => changeProxyFormData(type, value)}
                        type="protocol"
                        menuItems={["HTTP", "HTTPS", "SOCKS4", "SOCKS5"].map((item, i) => ({ id: i, value: item, text: item }))}
                        customStyles={{ width: "320px" }}
                        disabled={false}
                    />
                    <label className={styles.new_profile_item_label}>{t("proxySettings.host_and_port")}</label>
                    <input
                        type="text"
                        className={styles.proxy_inp}
                        onChange={(e) => changeProxyFormData("hostAndPort", e.target.value)}
                        value={proxyData.hostAndPort}
                    />
                    <label className={styles.new_profile_item_label}>{t("proxySettings.geolocation")}</label>
                    <input type="text" className={styles.proxy_inp} onChange={(e) => changeGeolocation(e.target.value)} value={geolocation} />
                </div>
                <div>
                    <label className={styles.new_profile_item_label}>{t("proxySettings.login")}</label>
                    <input
                        type="text"
                        value={proxyData.login}
                        className={styles.proxy_inp}
                        onChange={(e) => changeProxyFormData("login", e.target.value)}
                    />
                    <label className={styles.new_profile_item_label}>{t("proxySettings.password")}</label>
                    <input
                        type="text"
                        value={proxyData.password}
                        className={styles.proxy_inp}
                        onChange={(e) => changeProxyFormData("password", e.target.value)}
                    />
                </div>
                <div className={styles.save_and_check_btns_wrapper}>
                    <p className={styles.check_proxy_btn} onClick={checkProxy}>
                        {t("proxySettings.check_btn")}
                    </p>
                    <p className={styles.save_proxy_btn} onClick={saveProxy}>
                        {t("proxySettings.save")}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ProxySettings;
