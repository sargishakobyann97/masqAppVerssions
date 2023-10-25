import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { Link } from "react-router-dom";
import ChangePasswordLogo from "../../../../assets/images/svg/settings/security/ChangePasswordLogo";
import VerificationLogo from "../../../../assets/images/svg/settings/security/VerificationLogo";
import EndSessionLogo from "../../../../assets/images/svg/settings/security/EndSessionLogo";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { constants } from "../../../../assets/constants";
import { SettingsSecurityInitialStateTypes } from "../../../../types";
import HelperSwitch from "../../../helpersComponents/HelperSwitch";
import TwoFactorAuthenticationModal from "./TwoFactorAuthenticationModal/inted";
import { removeTwoFactorAuthenticationAsync } from "../../../../store/features/accountSlice";
import { setHelperModalTypeRedux } from "../../../../store/features/helperModalSlice";
import styles from "./security.module.scss";

const settingsSecurityInitialState: SettingsSecurityInitialStateTypes = {
    isDeleteAccountModalOpen: false,
    isTfaModalOpen: false,
};

const SettingsSecurity = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        account: {
            user: { tfaEnabled, passwordUpdateAt },
            token,
            hash,
        },
        main: { deviceInfo },
    } = useAppSelector((state) => state);

    const { paths, helperModalTypes } = constants;

    const [settingsSecurityFormData, setSettingsSecurityFormData] = useState(settingsSecurityInitialState);

    const changeFormData = (type: string, value: boolean) => {
        setSettingsSecurityFormData({ ...settingsSecurityFormData, [type]: value });
    };

    const removeTfa = () => dispatch(removeTwoFactorAuthenticationAsync({ deviceInfo, token, hash }));

    const openEndAllSessionsModal = () => dispatch(setHelperModalTypeRedux({ type: helperModalTypes.endAllSessions }));

    return (
        <div className={styles.settings_security_wrapper}>
            {settingsSecurityFormData.isTfaModalOpen && <TwoFactorAuthenticationModal closePage={changeFormData} />}
            <Link className={styles.settings_security_item} id={styles.change_password} to={paths.change_password}>
                <ChangePasswordLogo />
                <div className={styles.security_text_place}>
                    <h2>{t("settings.security.change_password")}</h2>
                    <p>
                        {passwordUpdateAt
                            ? `${t("settings.security.password_updated")} ${new Date(passwordUpdateAt).toLocaleString()}`
                            : t("settings.security.password_has_not_been_changed")}
                    </p>
                </div>
                <ArrowForwardIosIcon />
            </Link>
            <div className={`${styles.settings_security_item} ${styles.tfa_switch}`}>
                <VerificationLogo />
                <div className={styles.security_text_place}>
                    <h2>{t("settings.security.two_step_verification")}</h2>
                    <p>{tfaEnabled ? t("settings.security.two_step_ver_enabled") : t("settings.security.two_step_ver_unabled")}</p>
                </div>
                <HelperSwitch checked={tfaEnabled} onChange={() => (tfaEnabled ? removeTfa() : changeFormData("isTfaModalOpen", true))} />
            </div>
            <div className={styles.settings_security_item} onClick={openEndAllSessionsModal}>
                <EndSessionLogo />
                <div className={styles.security_text_place}>
                    <h2>{t("settings.security.end_sessions")}</h2>
                    <p>{t("settings.security.end_sessions_press_here")}</p>
                </div>
                <ArrowForwardIosIcon />
            </div>
        </div>
    );
};

export default SettingsSecurity;
