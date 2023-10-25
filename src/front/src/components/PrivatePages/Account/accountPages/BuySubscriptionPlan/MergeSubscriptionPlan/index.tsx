import { useEffect } from "react";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import styles from "./merge_subscription_plan.module.scss";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { resetHelperModalStateToInitialRedux } from "../../../../../../store/features/helperModalSlice";
import { changeTariffAsync } from "../../../../../../store/features/accountSlice";

const MergeSubscriptionPlan = ({ tariffId, weight, subName }: { tariffId: string; weight: number; subName: string }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        account: {
            activeSub: { _id, duration, tariffWeight },
            token,
            hash,
        },
        main: { deviceInfo },
    } = useAppSelector((state) => state);

    const dateAfterConvert = weight === 1 ? duration / 86400000 : (duration * tariffWeight) / weight / 86400000;
    const closePaymentFn = () => dispatch(resetHelperModalStateToInitialRedux());

    const convertSubscriptions = () => dispatch(changeTariffAsync({ deviceInfo, token, hash, subId: _id, tariffId, subName }));

    useEffect(() => {
        return () => {
            dispatch(resetHelperModalStateToInitialRedux());
        };
    }, []);
    const days = +dateAfterConvert.toString().split(".")[0];
    const hours = +dateAfterConvert - days;

    return (
        <div className={styles.convert_subs_main_wrapper}>
            <button className={styles.back_btn} onClick={closePaymentFn}>
                <ArrowBackIosOutlinedIcon />
                <span>{t("sundry.back")}</span>
            </button>
            <div className={styles.convert_subs_wrapper}>
                <div className={styles.convert_subs_header}>
                    <div className={styles.convert_subs_header_info}>
                        <h2>{t("account.buy_subscription.subscription_conversion")}</h2>
                        <p>{t("account.buy_subscription.converting_subs")}</p>
                    </div>
                </div>
                <div className={styles.convert_wrapper}>
                    <div className={styles.convert_info}>
                        <p>
                            <span>{t("account.buy_subscription.you_will_have")} </span>
                            <span>{days}</span>
                            <span> {t("sundry.day")}</span>
                            {!!hours && (
                                <>
                                    <span>{(24 * +hours + "").split(".")[0]}</span>
                                    <span> {t("sundry.hours")}</span>
                                </>
                            )}
                            <span> {t("account.buy_subscription.you_will_have_continue")}</span>
                        </p>
                    </div>
                    <div className={styles.sub_and_other_converting_info}>
                        <div>
                            <h2>
                                {subName} {t("account.subscription")}
                            </h2>
                            <div className={styles.price_place}>
                                <span>0 $</span>
                            </div>
                        </div>
                        <ul className={styles.info_lists}>
                            <li>{t("account.buy_subscription.all_profile_will_save")}</li>
                            <li>{t("account.buy_subscription.sub_typically_available")}</li>
                            <li>{t("account.buy_subscription.vat_included")}</li>
                        </ul>
                    </div>
                    <button className={styles.change_plan_btn} onClick={convertSubscriptions}>
                        {t("account.change_plan")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MergeSubscriptionPlan;
