import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PayForSubInitialStateTypes, PayForSubscriptionPlanTypes } from "../../../../../../types";
import QRCode from "react-qr-code";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import {
    buySubscriptionPlanAsync,
    checkPromoCodeAsync,
    paymentsTariffAsync,
    resetDiscountedTariffListRedux,
    resetPromoCodeErrorRedux,
} from "../../../../../../store/features/accountSlice";
import TicketIcon from "../../../../../../assets/images/svg/account/TicketIcon";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { motion } from "framer-motion";
import { constants } from "../../../../../../assets/constants";
import styles from "./pay_for_subscription_plan.module.scss";
import { resetHelperModalStateToInitialRedux } from "../../../../../../store/features/helperModalSlice";

const payForSubInitialState: PayForSubInitialStateTypes = {
    promoCode: "",
    isPromoCodeOpen: false,
    isPaymentMethodOpen: false,
    paymentMethod: "Cryptomus",
};

const activate_promo_animation = {
    hidden: {
        y: -20,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: { delay: 0.2 },
    },
};

const PayForSubscriptionPlan = ({ price = "", name = "", subId = "" }: PayForSubscriptionPlanTypes) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        account: {
            paymentTariffUrl,
            token,
            hash,
            promoCodeError,
            discountedTariffList,
            user: { balance },
            activeSub: { type },
            teams,
        },
        main: { deviceInfo, tariffList },
        helperModal: { configs },
    } = useAppSelector((state) => state);

    const { cryptomus, create_new_team } = constants;
    const isTeam = tariffList.some((item) => item._id === subId && item.name.toLowerCase().includes("team"));
    const paidPeriod = tariffList.find((item) => item._id === subId)?.duration;
    const [payForSubData, setPayForSubData] = useState(payForSubInitialState);

    const changeFormDataValues = (type: string, value: string | boolean) => {
        setPayForSubData({ ...payForSubData, [type]: value });
        if (promoCodeError && type === "promoCode") {
            dispatch(resetPromoCodeErrorRedux());
        } else if (type === "paymentMethod") {
            setPayForSubData({ ...payForSubData, [type as keyof typeof payForSubData]: value, isPaymentMethodOpen: false });
        }
    };

    let discountedPrice = discountedTariffList.find((item) => item.name === name)?.price;

    const isBalanceEnoughToBuy = balance >= +price;

    const checkPromoCode = () =>
        payForSubData.promoCode.trim() && dispatch(checkPromoCodeAsync({ deviceInfo, hash, token, promocode: payForSubData.promoCode }));

    const closePaymentFn = () => dispatch(resetHelperModalStateToInitialRedux());
    const handleBuySub = () => {
        payForSubData.paymentMethod !== cryptomus
            ? dispatch(
                  buySubscriptionPlanAsync({
                      token,
                      deviceInfo,
                      hash,
                      subId,
                      isTeam,
                      promoCode: discountedTariffList.length ? payForSubData.promoCode : "",
                      closePaymentPageFn: closePaymentFn,
                      renewTeamId: configs?.renewTeamId,
                      subName: name,
                  })
              )
            : window.open(paymentTariffUrl, "_blank");
    };

    const chooseMethodMenuItemsForTeam = useMemo(() => {
        const items = teams.map((team) => ({
            id: team._id,
            value: team.name,
            text: team.name,
        }));
        items.unshift({
            id: create_new_team,
            value: create_new_team,
            text: create_new_team,
        });
        return items;
    }, [teams]);

    useEffect(() => {
        price && dispatch(paymentsTariffAsync({ token, hash, deviceInfo, tariffId: subId, teamId: configs?.renewTeamId, currency: "" }));
    }, [discountedPrice]);
    useEffect(() => {
        return () => {
            dispatch(resetDiscountedTariffListRedux());
            dispatch(resetHelperModalStateToInitialRedux());
        };
    }, []);

    return (
        <div className={styles.pay_for_sub_main_wrapper}>
            <button className={styles.back_btn} onClick={() => closePaymentFn()}>
                <ArrowBackIosOutlinedIcon />
                <span>{t("sundry.back")}</span>
            </button>
            <div className={styles.pay_for_sub_wrapper}>
                <div className={styles.pay_for_sub_header}>
                    <div className={styles.pay_for_sub_header_info}>
                        <h2>{t("account.buy_subscription.review_purchase")}</h2>
                        <p>{t("account.buy_subscription.check_all_order_details")}</p>
                    </div>
                </div>
                <div className={styles.payment_wrapper}>
                    <div className={`${styles.pay_method_promo_code_wrapper} ${payForSubData.isPromoCodeOpen && styles.active}`}>
                        <div
                            className={styles.pay_method_promo_btn}
                            onClick={() => changeFormDataValues("isPaymentMethodOpen", !payForSubData.isPaymentMethodOpen)}
                        >
                            <div className={styles.promo_btn_text}>
                                <p>
                                    {t("account.buy_subscription.payment_method")} {payForSubData.paymentMethod}
                                </p>
                            </div>
                            <div className={styles.promo_btn_icon}>
                                <KeyboardArrowDownIcon />
                            </div>
                        </div>
                        {payForSubData.isPaymentMethodOpen && (
                            <div className={styles.payment_method_types}>
                                <button
                                    className={`${styles.payment_method_type} ${payForSubData.paymentMethod === cryptomus && styles.selected}`}
                                    onClick={() => changeFormDataValues("paymentMethod", cryptomus)}
                                >
                                    {cryptomus}
                                </button>
                                <button
                                    className={`${styles.payment_method_type} ${
                                        payForSubData.paymentMethod === t("sundry.masq_wallet") && styles.selected
                                    }`}
                                    disabled={!isBalanceEnoughToBuy}
                                    onClick={() => changeFormDataValues("paymentMethod", t("sundry.masq_wallet") + "")}
                                >
                                    {t("sundry.masq_wallet")}
                                    {!isBalanceEnoughToBuy && (
                                        <span className={styles.insufficient_funds}>{t("account.buy_subscription.insufficient_funds")}</span>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className={styles.pay_for_sub_info_and_qr}>
                        <div className={styles.pay_for_sub_info}>
                            <div>
                                <h2>
                                    {(name.toLowerCase() === type.toLowerCase() ||
                                        (configs?.renewTeamId && configs?.renewTeamId !== create_new_team)) &&
                                        t("account.buy_subscription.renew")}
                                    {name.toLowerCase().replace("yearly", "")} {t("account.subscription")}
                                </h2>
                                <div className={styles.price_place}>
                                    {!!discountedTariffList.length && <span className={styles.discounted_price}>{discountedPrice} $</span>}
                                    <span className={`${discountedTariffList.length && styles.line_through}`}>{price} $</span>
                                </div>
                            </div>
                            <h3 className={styles.time_period}>
                                {t("settings.settings_main_page.paid_period")}: {paidPeriod}
                            </h3>
                            {configs?.renewTeamId && (
                                <p className={styles.team_name_info}>
                                    {t("settings.settings_main_page.team")}:{" "}
                                    {chooseMethodMenuItemsForTeam.find((el) => el.id === configs?.renewTeamId)?.value}
                                </p>
                            )}
                            <ul className={styles.info_lists}>
                                <li>{t("account.buy_subscription.how_long_available_sub")}</li>
                                <li>{t("account.buy_subscription.vat_included")}</li>
                            </ul>
                        </div>
                        {payForSubData.paymentMethod === cryptomus && (
                            <div className={styles.pay_for_sub_qr}>
                                <QRCode value={paymentTariffUrl} style={{ width: "80%", height: "80%" }} />
                            </div>
                        )}
                    </div>
                    <div className={styles.pay_method_promo_code_wrapper}>
                        <div
                            className={styles.pay_method_promo_btn}
                            onClick={() => changeFormDataValues("isPromoCodeOpen", !payForSubData.isPromoCodeOpen)}
                        >
                            <div className={styles.promo_btn_text}>
                                <TicketIcon />
                                <p>{t("sundry.promocode")}</p>
                                {promoCodeError && (
                                    <span className={styles.promo_code_error}>{t("account.buy_subscription.promo_code_not_found")}</span>
                                )}
                            </div>
                            <div className={styles.promo_btn_icon}>
                                <KeyboardArrowDownIcon />
                            </div>
                        </div>
                        {payForSubData.isPromoCodeOpen && (
                            <motion.div
                                variants={activate_promo_animation}
                                initial="hidden"
                                whileInView="visible"
                                className={styles.promo_input_wrapper}
                            >
                                <input
                                    type="text"
                                    value={payForSubData.promoCode}
                                    onChange={(e) => changeFormDataValues("promoCode", e.target.value)}
                                    placeholder={t("account.buy_subscription.promocode_placeholder") + ""}
                                />
                                <button className={styles.activate_promo} onClick={checkPromoCode}>
                                    {discountedPrice ? t("account.buy_subscription.activated") : t("account.buy_subscription.activate")}
                                </button>
                            </motion.div>
                        )}
                    </div>
                    <button className={styles.pay_for_sub_pay_online} onClick={handleBuySub}>
                        {payForSubData.paymentMethod === cryptomus
                            ? t("account.buy_subscription.pay_online")
                            : t("account.buy_subscription.purchase")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayForSubscriptionPlan;
