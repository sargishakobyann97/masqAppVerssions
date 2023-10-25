import { useEffect } from "react";
import { TopUpPaymentPageTypes } from "../../../../../../types";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import QRCode from "react-qr-code";
import { useTranslation } from "react-i18next";
import styles from "./top_up_payment_page.module.scss";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { paymentsAsync } from "../../../../../../store/features/accountSlice";

const TopUpPaymentPage = ({ price = "", closePaymentFn = () => {} }: TopUpPaymentPageTypes) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        account: {
            user: { name },
            paymentUrl,
            token,
            hash,
        },
        main: { deviceInfo },
    } = useAppSelector((state) => state);

    useEffect(() => {
        +price > 0 && dispatch(paymentsAsync({ token, hash, deviceInfo, price, currency: "" }));
    }, []);

    return (
        <div className={styles.top_up_payment_main_wrapper}>
            <button className={styles.back_btn} onClick={() => closePaymentFn()}>
                <ArrowBackIosOutlinedIcon />
                <span>{t("sundry.back")}</span>
            </button>
            <div className={styles.top_up_payment_wrapper}>
                <div className={styles.top_up_payment_header}>
                    <div className={styles.top_up_payment_header_info}>
                        <h2>
                            {t("account.top_up_wallet_texts.add_funds_to")} {name} {t("account.top_up_wallet_texts.wallet")}
                        </h2>
                        <p>{t("account.top_up_wallet_texts.about_funds_text")}</p>
                    </div>
                </div>
                <div className={styles.payment_wrapper}>
                    <div className={styles.top_up_payment_info_and_qr}>
                        <div className={styles.top_up_payment_info}>
                            <h2>
                                <span>{t("account.top_up_wallet")}</span>
                                <span>{price} $</span>
                            </h2>
                            <ul className={styles.info_lists}>
                                <li>{t("account.top_up_wallet_texts.payment_page_first_text")}</li>
                                <li>{t("account.buy_subscription.masq_required")}</li>
                                <li>{t("account.buy_subscription.vat_included")}</li>
                            </ul>
                        </div>
                        <div className={styles.top_up_payment_qr}>
                            <QRCode value={paymentUrl} style={{ width: "80%", height: "80%" }} />
                        </div>
                    </div>
                    <a href={paymentUrl} target="_blank" className={styles.top_up_payment_pay_online}>
                        {t("account.buy_subscription.pay_online")}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TopUpPaymentPage;
