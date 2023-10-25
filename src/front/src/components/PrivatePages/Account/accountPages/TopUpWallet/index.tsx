import { ChangeEvent, useMemo, useRef, useState } from "react";
import UsernameBalance from "../UsernameBalance";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { v4 as uuid } from "uuid";
import styles from "./top_up_wallet.module.scss";
import { TopUpInitialStateTypes } from "../../../../../types";
import TopUpPaymentPage from "./TopUpPaymentPage";

const topUpInitialState: TopUpInitialStateTypes = {
    isAccountMoreOptionOpen: false,
    isPaymentPageOpen: false,
    price: "",
};

const TopUpWallet = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        account: {
            user: { name },
            token,
            hash,
        },
        main: { deviceInfo },
    } = useAppSelector((state) => state);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const fixedPriceList = useMemo(
        () => [
            {
                id: uuid(),
                price: "5",
            },
            {
                id: uuid(),
                price: "15",
            },
            {
                id: uuid(),
                price: "50",
            },
        ],
        []
    );

    const [topUpFormData, setTopUpFormData] = useState(topUpInitialState);

    const changeFormDataValues = (type: string, value: string | boolean) => {
        setTopUpFormData({ ...topUpFormData, [type]: value });
    };

    const handleCustomPrice = (value: string) => {
        if (value.trim() && !value.startsWith("0") && /^[0-9]*$/.test(value)) {
            setTopUpFormData({ ...topUpFormData, price: value });
        } else setTopUpFormData({ ...topUpFormData, price: "" });
    };

    const openPaymentsPage = (price: string) => {
        price && setTopUpFormData({ ...topUpFormData, isPaymentPageOpen: true, price });
    };

    const closePaymentsPage = () => setTopUpFormData(topUpInitialState);

    const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            changeFormDataValues("isAccountMoreOptionOpen", false);
        }
    };

    return (
        <div className={styles.top_up_wrapper} onClick={handleModalClick}>
            <div className={styles.top_up_wrapper_main}>
                <UsernameBalance modalRef={modalRef} isOpen={topUpFormData.isAccountMoreOptionOpen} changeOpen={changeFormDataValues} />
                {!topUpFormData.isPaymentPageOpen ? (
                    <div className={styles.top_up_text_btn_wrapper}>
                        <div className={styles.top_up_text}>
                            <h2>
                                {t("account.top_up_wallet_texts.add_funds_to")} {name} {t("account.top_up_wallet_texts.wallet")}
                            </h2>
                            <p>{t("account.top_up_wallet_texts.about_funds_text")}</p>
                        </div>
                        <div className={styles.top_up_btn_wrapper}>
                            {fixedPriceList.map(({ id, price }) => (
                                <div className={styles.top_up_btn} key={id}>
                                    <span>USD {price}</span>
                                    <span onClick={() => openPaymentsPage(price)}>{t("account.top_up_wallet_texts.add_funds")}</span>
                                </div>
                            ))}
                            <div className={styles.top_up_btn}>
                                <div className={styles.top_up_btn_custom_price}>
                                    <span>USD</span>
                                    <input
                                        type="text"
                                        placeholder={t("account.top_up_wallet_texts.enter_custom_value") + ""}
                                        value={topUpFormData.price}
                                        onChange={(e) => {
                                            handleCustomPrice(e.target.value);
                                        }}
                                    />
                                </div>
                                <span onClick={() => openPaymentsPage(topUpFormData.price)}>{t("account.top_up_wallet_texts.add_funds")}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <TopUpPaymentPage price={topUpFormData.price} closePaymentFn={() => closePaymentsPage()} />
                )}
            </div>
        </div>
    );
};

export default TopUpWallet;
