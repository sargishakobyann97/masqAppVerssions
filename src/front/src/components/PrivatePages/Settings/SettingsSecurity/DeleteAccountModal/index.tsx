import { useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import delete_account_logo from "../../../../../assets/images/settings/security/delete_account_logo.png";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import styles from "./delete_account_modal.module.scss";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { deleteAccountAsync, resetPasswordForDeleteError } from "../../../../../store/features/settingsSlice";
import { useNavigate } from "react-router-dom";
import { constants } from "../../../../../assets/constants";

const DeleteAccountModal = ({ closePage }: { closePage: Function }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        account: { token, hash },
        main: { deviceInfo },
        settings: { isPasswordForDeleteAccountIncorrect },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const changeVisibility = () => setShowPassword(!showPassword);
    const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(resetPasswordForDeleteError());
        setPassword(e.target.value);
    };
    const isPasswordValid = password.length > 2;

    const handleModalClickToClose = (e: React.MouseEvent<HTMLElement>) => {
        const targetId = (e.target as HTMLElement)?.id;
        targetId === "close_" && closePage("isDeleteAccountModalOpen", false);
    };

    const deleteMyAccount = () => {
        dispatch(resetPasswordForDeleteError());
        dispatch(deleteAccountAsync({ deviceInfo, token, hash, password }));
    };

    return (
        <div className={styles.delete_account_modal_wrapper} id="close_" onClick={(e) => handleModalClickToClose(e)}>
            <div className={styles.delete_account_main_wrapper}>
                <div className={styles.delete_account_close_btn} onClick={(e) => handleModalClickToClose(e)}>
                    <CloseIcon id="close_" />
                </div>
                <div className={styles.delete_icon_text}>
                    <img src={delete_account_logo} alt="Logo" />
                    <h2>{t("settings.security.delete_account_modal.delete_your_account_header")}</h2>
                    <p>{t("settings.security.delete_account_modal.delete_your_account_text")}</p>
                </div>
                <div className={styles.delete_btns}>
                    <div className={styles.delete_password_input_place}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("resetPassword.enter_your_password") + ""}
                            className={`${styles.delete_password_input} ${isPasswordForDeleteAccountIncorrect && styles.active}`}
                            value={password}
                            onChange={(e) => changePassword(e)}
                        />
                        <div className={styles.show_password_wrapper}>
                            {showPassword ? (
                                <VisibilityOffOutlinedIcon onClick={changeVisibility} />
                            ) : (
                                <VisibilityOutlinedIcon onClick={changeVisibility} />
                            )}
                        </div>
                    </div>
                    <button
                        className={`${styles.delete_account_delete_btn} ${isPasswordValid && styles.active}`}
                        onClick={deleteMyAccount}
                        disabled={!isPasswordValid}
                    >
                        {t("settings.security.delete_account_modal.delete_your_account_btn")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModal;
