import { useEffect, useState } from "react";
import tfs_logo from "../../../../../assets/images/settings/security/tfa_google_icon.png";
import CloseIcon from "@mui/icons-material/Close";
import VerificationInput from "react-verification-input";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import {
    resetTfaConfirmCode,
    resetTfaInfos,
    setupTwoFactorAuthenticationAsync,
    verifyTwoFactorAuthenticationAsync,
} from "../../../../../store/features/accountSlice";
import { TfaInitialStateTypes } from "../../../../../types";
import styles from "./two_factor_authentication_modal.module.scss";

const tfaInitialState: TfaInitialStateTypes = {
    canScan: true,
    isVerifyPageOpen: false,
    confirmCode: "",
    isCopied: false,
};

const TwoFactorAuthenticationModal = ({ closePage }: { closePage: Function }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        account: {
            token,
            hash,
            tfaInfos: { dataURL, secretKey },
            isTfaConfirmCodeInvalid,
        },
        main: { deviceInfo },
    } = useAppSelector((state) => state);

    const [tfaFormData, setTfaFormData] = useState(tfaInitialState);

    const handleModalClickToClose = (e: React.MouseEvent<HTMLElement>) => {
        const targetId = (e.target as HTMLElement)?.id;
        targetId === "close_" && closePage("isTfaModalOpen", false);
        dispatch(resetTfaConfirmCode());
    };

    const changeFormData = (type: string, value: string | boolean) => {
        setTfaFormData({ ...tfaFormData, [type]: value });
    };

    const toggleConfirmCode = (value: string) => {
        dispatch(resetTfaConfirmCode());
        (new RegExp("[0-9]").test(value) || !value) && setTfaFormData({ ...tfaFormData, confirmCode: value });
    };
    const handleVerifyTfa = () => {
        dispatch(
            verifyTwoFactorAuthenticationAsync({
                deviceInfo,
                token,
                hash,
                confirmCode: tfaFormData.confirmCode,
                closeModalFn: () => closePage("isTfaModalOpen", false),
            })
        );
    };

    const handleCopyClick = async () => {
        await navigator.clipboard.writeText(secretKey);
        changeFormData("isCopied", true);
        setTimeout(() => changeFormData("isCopied", false), 2000);
    };

    useEffect(() => {
        dispatch(setupTwoFactorAuthenticationAsync({ deviceInfo, hash, token }));
        return () => {
            dispatch(resetTfaInfos());
        };
    }, []);
    return (
        <div className={styles.tfa_wrapper} id="close_" onClick={handleModalClickToClose}>
            <div className={styles.tfa_main_wrapper}>
                <div className={styles.tfa_close_icon} id="close_" onClick={handleModalClickToClose}>
                    <CloseIcon id="close_" />
                </div>
                <div className={styles.tfa_icon_place}>
                    <img src={tfs_logo} alt="Logo" />
                </div>
                <div className={styles.tfa_info_place}>
                    <h2 className={styles.tfa_header}>{t("settings.security.two_factor_modal.set_up_authenticator")}</h2>
                    {!tfaFormData.isVerifyPageOpen ? (
                        <>
                            <ul className={styles.tfa_docs}>
                                <li>{t("settings.security.two_factor_modal.get_authenticator_app")}</li>
                                <li>{t("settings.security.two_factor_modal.in_the_app_what_select")}</li>
                                <li>{t("settings.security.two_factor_modal.choose_qr_code")}</li>
                            </ul>
                            <div className={styles.tfa_code_place}>
                                {tfaFormData.canScan ? (
                                    <div className={styles.tfa_qr_code}>
                                        <div className={styles.tfa_qr_img_wrapper}>{!!dataURL && <img src={dataURL} alt="Qr Code" />}</div>
                                        <button className={styles.tfa_can_not_scan} onClick={() => changeFormData("canScan", false)}>
                                            {t("settings.security.two_factor_modal.can_not_scan")}
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.tfa_security_key_wrapper}>
                                        <div className={styles.tfa_security_key}>
                                            <p>{secretKey}</p>
                                            <div className={styles.tfa_copy_icon} onClick={handleCopyClick}>
                                                <ContentCopyIcon />
                                                {tfaFormData.isCopied && <span className={styles.copied}>{t("sundry.copy")}</span>}
                                            </div>
                                        </div>
                                        <button onClick={() => changeFormData("canScan", true)}>
                                            {t("settings.security.two_factor_modal.scan_qr_code")}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className={styles.tfa_btn_place}>
                                <button className={styles.tfa_cancel} id="close_" onClick={handleModalClickToClose}>
                                    {t("sundry.cancel")}
                                </button>
                                <button className={styles.tfa_next} onClick={() => changeFormData("isVerifyPageOpen", true)}>
                                    {t("sundry.next")}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={styles.tfa_verify_page}>
                            <p className={styles.tfa_verify_text}>{t("settings.security.two_factor_modal.tfa_verify_code_text")}</p>
                            <div className={styles.tfa_verify_code_place}>
                                <VerificationInput
                                    length={6}
                                    autoFocus={true}
                                    onChange={toggleConfirmCode}
                                    value={tfaFormData.confirmCode}
                                    classNames={{
                                        container: styles.vf_container,
                                        character: `${styles.vf_character} ${isTfaConfirmCodeInvalid && styles.active}`,
                                        characterInactive: styles.vf_character_inactive,
                                        characterSelected: `${styles.vf_character_selected} ${isTfaConfirmCodeInvalid && styles.active}`,
                                    }}
                                />
                            </div>
                            <div className={styles.tfa_verify_btn}>
                                <button
                                    className={styles.tfa_verify_save}
                                    disabled={tfaFormData.confirmCode.length !== 6 && true}
                                    onClick={handleVerifyTfa}
                                >
                                    {t("settings.security.two_factor_modal.verify_and_save")}
                                </button>
                                <button className={styles.tfa_veirfy_page_cancel} id="close_" onClick={handleModalClickToClose}>
                                    {t("sundry.cancel")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TwoFactorAuthenticationModal;
