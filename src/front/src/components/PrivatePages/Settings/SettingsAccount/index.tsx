import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store";
import usFlag from "../../../../assets/images/flags/us.png";
import ruFlag from "../../../../assets/images/flags/ru.png";
import HelperInput from "../../../helpersComponents/HelperInput";
import { changeNameAsync, resetNameErrorRedux, resetNameSaved } from "../../../../store/features/settingsSlice";
import EmailLogo from "../../../../assets/images/svg/settings/security/EmailLogo";
import DeleteAccountLogo from "../../../../assets/images/svg/settings/security/DeleteAccountLogo";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getLocalProfilesAsync, setAppSettingsAsync } from "../../../../store/features/mainSlice";
import { Link } from "react-router-dom";
import { constants } from "../../../../assets/constants";
import styles from "./account.module.scss";
import { setHelperModalTypeRedux } from "../../../../store/features/helperModalSlice";

const SettingsAccount = () => {
    const {
        account: {
            token,
            user: { name, email },
            hash,
            activeSub,
        },
        main: {
            deviceInfo,
            appSettings: { currency },
            appSettings,
            localProfiles,
        },
        settings: { nameError, nameSaved },
    } = useAppSelector((state) => state);

    const dispatch = useAppDispatch();

    const { t } = useTranslation();

    const { paths, helperModalTypes } = constants;

    const [settingsAccountFormData, setSettingsAccountFormData] = useState({
        name: name,
        country: "en",
        currency: "usd",
    });
    const [nameLocalError, setNameLocalError] = useState("");

    const changeDataValues = (type: string, value: string) => {
        setSettingsAccountFormData({ ...settingsAccountFormData, [type]: value });
    };

    const changeCurrency = (type: string, value: string) => {
        dispatch(setAppSettingsAsync({ deviceInfo, token, hash, appSettings: { ...appSettings, currency: value } }));
    };

    const countryMenuItems = useMemo(
        () => [
            { id: 1, value: "en", text: "countries.us", src: usFlag, selected: true, disabled: false },
            { id: 2, value: "ru", text: "countries.ru", src: ruFlag, disabled: false },
        ],
        []
    );
    const currencyMenuItems = useMemo(
        () => [
            { id: 3, value: "usd", text: "currencies.usd", selected: true },
            { id: 4, value: "aud", text: "currencies.aud", disabled: true },
            { id: 5, value: "rub", text: "currencies.rub", disabled: true },
            { id: 6, value: "eur", text: "currencies.eur", disabled: true },
        ],
        []
    );

    const openDeleteAccountModal = () => dispatch(setHelperModalTypeRedux({ type: helperModalTypes.deleteAccount }));
    const openImportOldProfileModal = () => {
        dispatch(getLocalProfilesAsync({ clickedFromSettings: true }));
    };

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (settingsAccountFormData.name.length > 2 && settingsAccountFormData.name !== name) {
            setNameLocalError("");
            timeout = setTimeout(() => {
                dispatch(changeNameAsync({ deviceInfo, token, hash, name: settingsAccountFormData.name }));
            }, 200);
        } else if (settingsAccountFormData.name.length < 3) {
            setNameLocalError(t("signUp.name_local_error") + "");
        }
        return () => clearTimeout(timeout);
    }, [settingsAccountFormData.name]);

    useEffect(() => {
        return () => {
            dispatch(resetNameErrorRedux());
        };
    }, []);

    useEffect(() => {
        if (nameSaved) {
            setTimeout(() => {
                dispatch(resetNameSaved());
            }, 1500);
        }
    }, [nameSaved]);

    return (
        <div className={styles.settings_account_wrapper}>
            <div className={styles.settings_account_item}>
                <div className={styles.settings_account_item_text}>
                    <h2>{t("settings.account.profile_name")}</h2>
                    <p>{t("settings.account.profile_name_text")}</p>
                </div>
                <HelperInput
                    type={"text"}
                    name={"name"}
                    value={settingsAccountFormData.name}
                    onChange={changeDataValues}
                    errorMessage={nameError ? nameError : nameLocalError}
                    style={{ width: 224, height: 36, borderRadius: 5 }}
                />
                {nameSaved && <p className={styles.saved_info}>{t("sundry.saved")}</p>}
            </div>
            <div className={styles.settings_account_item}>
                <div className={styles.settings_account_item_text}>
                    <h2>{t("profiles.more_items.import_profiles")}</h2>
                    <p>{t("profiles.import_profiles_old_version")}</p>
                </div>
                <button className={styles.settings_account_item_btn} disabled={!activeSub.activated} onClick={openImportOldProfileModal}>
                    {t("sundry.import")}
                </button>
            </div>
            <Link className={styles.settings_account_item} id={styles.change_email} to={paths.change_email}>
                <EmailLogo />
                <div className={styles.account_item_text_place}>
                    <h2>{t("settings.security.change_email")}</h2>
                    <p>{email}</p>
                </div>
                <ArrowForwardIosIcon />
            </Link>
            <div className={styles.settings_account_item} onClick={openDeleteAccountModal}>
                <DeleteAccountLogo />
                <div className={styles.account_item_text_place}>
                    <h2>{t("settings.security.delete_account")}</h2>
                    <p>{t("settings.security.delete_account_text")}</p>
                </div>
                <ArrowForwardIosIcon />
            </div>
            {/* <div className={styles.settings_account_item}>
                <div className={styles.settings_account_item_text}>
                    <h2>{t("settings.account.country")}</h2>
                    <p>{t("settings.account.country_text")}</p>
                </div>
                <HelperSelect type="country" selectValue={settingsAccountFormData.country} menuItems={countryMenuItems} onChange={changeDataValues} />
            </div> */}
            {/* <div className={styles.settings_account_item}>
                <div className={styles.settings_account_item_text}>
                    <h2>{t("settings.account.currency")}</h2>
                    <p>{t("settings.account.currency_text")}</p>
                </div>
                <HelperSelect type="currency" menuItems={currencyMenuItems} onChange={changeCurrency} selectValue={currency} />
            </div> */}
        </div>
    );
};

export default SettingsAccount;
