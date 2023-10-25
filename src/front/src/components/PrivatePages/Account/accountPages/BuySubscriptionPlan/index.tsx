import CheckIcon from "@mui/icons-material/Check";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { constants } from "../../../../../assets/constants";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import {
    setHelperModalMethodForBuySubRedux,
    setHelperModalMethodToMerge,
    setHelperModalTypeRedux,
} from "../../../../../store/features/helperModalSlice";
import { BuyPlanInitialStateTypes } from "../../../../../types";
import BackToSomePage from "../../../../helpersComponents/BackToSomePage";
import UsernameBalance from "../UsernameBalance";
import MergeSubscriptionPlan from "./MergeSubscriptionPlan";
import PayForSubscriptionPlan from "./PayForSubscriptionPlan";
import styles from "./buy_subscription_plan.module.scss";

const buyPlanInitialState: BuyPlanInitialStateTypes = {
    isAccountMoreOptionOpen: false,
    buyYearly: false,
    subName: "",
    subPrice: "",
    subId: "",
    subWeight: NaN,
};

const sub_item_animation = {
    hidden: {
        y: 20,
        opacity: 0,
    },
    visible: (custom: number) => ({
        y: 0,
        opacity: 1,
        transition: { delay: custom * 0.2 },
    }),
};

const BuySubscriptionPlan = () => {
    const { t } = useTranslation();
    const { paths, helperModalTypes, convert, create_new_team } = constants;
    const dispatch = useAppDispatch();
    const {
        main: { tariffList },
        account: {
            activeSub: { type },
            teams,
            subs,
        },
        helperModal: { methodForBuySub, isMergeOrConvertPageOpen, configs },
    } = useAppSelector((state) => state);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const [buySubData, setBuySubData] = useState(buyPlanInitialState);

    const filteredTariffList = tariffList
        .filter((item) => (!buySubData.buyYearly ? !item.name.includes("Yearly") : item.name.includes("Yearly")))
        .sort((a, b) => a.price - b.price);

    const findTheHighestPrices = tariffList
        .filter((item) => item.name.toLowerCase() === "team" || item.name.toLowerCase() === "team yearly")
        .sort((a, b) => a.price - b.price);

    const savePricePercent = Math.round(100 - (findTheHighestPrices[1]?.price * 100) / (findTheHighestPrices[0]?.price * 12));

    const changeFormDataValues = (type: string, value: string | boolean) => {
        setBuySubData({ ...buySubData, [type]: value });
    };

    const forOpenPaymentsPage = (subName: string, subPrice: string, subId: string, subWeight: number) => {
        if (subName.toLowerCase().includes("team") && !teams.length) {
            dispatch(setHelperModalMethodToMerge());
        } else if (subName.toLowerCase().includes("team")) {
            dispatch(
                setHelperModalTypeRedux({
                    type: helperModalTypes.chooseSubPlanMethod,
                    configs: {
                        renewTeamId: create_new_team,
                    },
                })
            );
        } else if (type && type.toLowerCase() !== subName.toLowerCase()) {
            dispatch(setHelperModalMethodForBuySubRedux(convert));
        } else {
            dispatch(setHelperModalMethodToMerge());
        }
        setBuySubData({ ...buySubData, subName, subPrice, subId, subWeight });
    };

    const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            changeFormDataValues("isAccountMoreOptionOpen", false);
        }
    };

    return (
        <div className={styles.buy_subscription_plan_wrapper} onClick={handleModalClick}>
            <div className={styles.buy_subscription_plan_wrapper_main}>
                <UsernameBalance modalRef={modalRef} isOpen={buySubData.isAccountMoreOptionOpen} changeOpen={changeFormDataValues} />
                {!isMergeOrConvertPageOpen ? (
                    <div className={styles.buy_plan_main_section}>
                        <BackToSomePage page={t("mainAside.account")} path={paths.account} />
                        <div className={styles.buy_plan_header_card_wrapper}>
                            <div className={styles.buy_plan_header}>
                                <div className={styles.buy_plan_header_info}>
                                    <h2>{t("account.buy_subscription.sub_plan")}</h2>
                                    <p>{t("account.buy_subscription.enjoy_all_benefits")}</p>
                                </div>
                                <div className={styles.buy_plan_header_yearly_monthly}>
                                    <div className={styles.buy_plan_date} onClick={() => changeFormDataValues("buyYearly", false)}>
                                        <span>{t("account.buy_subscription.monthly_billing")}</span>
                                    </div>
                                    <div className={styles.buy_plan_date} onClick={() => changeFormDataValues("buyYearly", true)}>
                                        <span>{t("account.buy_subscription.yearly_billing")}</span>
                                    </div>
                                    <div className={`${styles.buy_plan_clicked_btn} ${buySubData.buyYearly && styles.yearly}`}>
                                        {buySubData.buyYearly ? (
                                            <>
                                                <span>{t("account.buy_subscription.yearly_billing")}</span>
                                                <span>
                                                    ({t("account.buy_subscription.save_up_to")} {savePricePercent}%)
                                                </span>
                                            </>
                                        ) : (
                                            <span>{t("account.buy_subscription.monthly_billing")}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.buy_plan_cards}>
                                {filteredTariffList.map((item, i) => (
                                    <motion.div
                                        key={item._id}
                                        className={styles.buy_plan_card}
                                        onClick={() => forOpenPaymentsPage(item.name, item.price.toString(), item._id, item.weight)}
                                        variants={sub_item_animation}
                                        custom={i * 1}
                                        initial="hidden"
                                        whileInView="visible"
                                    >
                                        <div className={styles.card_price_name}>
                                            <div className={styles.card_name} data-type={item.name.split(" ")[0]}>
                                                <span>{item.name}</span>
                                            </div>
                                            <div className={styles.card_price}>
                                                <span>$</span> <span>{item.price}</span>{" "}
                                                <span>{`/ ${item.duration} ${t("account.buy_subscription.days")}`}</span>
                                            </div>
                                        </div>
                                        <div className={styles.card_info}>
                                            <ul className={styles.card_info_wrapper}>
                                                <li>
                                                    <CheckIcon />
                                                    <span>
                                                        {item.profileLimit} {t("account.buy_subscription.profiles")}
                                                    </span>
                                                </li>
                                                <li>
                                                    <CheckIcon />
                                                    <span>
                                                        {item.deviceLimit} {t("account.buy_subscription.devices")}
                                                    </span>
                                                </li>
                                                <li>
                                                    <CheckIcon />
                                                    <span>
                                                        {item.userLimit > 1
                                                            ? `${t("account.buy_subscription.up_to")} ${item.userLimit} ${t(
                                                                  "account.buy_subscription.users"
                                                              )}`
                                                            : t("account.buy_subscription.only_for_personal_use")}
                                                    </span>
                                                </li>
                                            </ul>
                                            <button
                                                className={`${styles.card_info_btn} ${
                                                    ((type &&
                                                        item.name.toLowerCase().replaceAll("yearly", "").trim() ===
                                                            type.toLowerCase().replaceAll("yearly", "").trim()) ||
                                                        (item.name.toLowerCase().includes("team") && !!teams.length)) &&
                                                    styles.active
                                                }`}
                                            >
                                                {item.name.toLowerCase().includes("team") && !!teams.length
                                                    ? t("account.buy_subscription.renew_or_create_team")
                                                    : type &&
                                                      item.name.toLowerCase().replaceAll("yearly", "").trim() ===
                                                          type.toLowerCase().replaceAll("yearly", "").trim()
                                                    ? t("account.buy_subscription.renew")
                                                    : !!subs.length && !item.name.toLowerCase().includes("team")
                                                    ? t("account.buy_subscription.change_plan")
                                                    : t("account.buy_subscription.choose_plan")}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : methodForBuySub === convert && !configs?.renewTeamId ? (
                    <MergeSubscriptionPlan tariffId={buySubData.subId} weight={buySubData.subWeight} subName={buySubData.subName} />
                ) : (
                    <PayForSubscriptionPlan price={buySubData.subPrice} name={buySubData.subName} subId={buySubData.subId} />
                )}
            </div>
        </div>
    );
};

export default BuySubscriptionPlan;
