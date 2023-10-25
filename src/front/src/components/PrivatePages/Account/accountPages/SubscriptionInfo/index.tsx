import subscription_media from "../../../../../assets/images/subscription_media.png";
import styles from "./subscription.module.scss";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../../store";
import { Link } from "react-router-dom";
import { constants } from "../../../../../assets/constants";
import BackToSomePage from "../../../../helpersComponents/BackToSomePage";

function SubscriptionInfo() {
    const { t } = useTranslation();
    const {
        account: {
            activeSub: { type, profileLimit, _id, end },
            subs,
        },
        main: { tariffList },
    } = useAppSelector((state) => state);

    const { paths } = constants;

    // const mySubscriptionPlan = tariffList.find((item) => item.name.toLowerCase() === type.toLowerCase());
    const notActiveSubs = subs.filter((sb) => sb._id !== _id);

    return (
        <div className={styles.subscription_wrapper}>
            <div className={styles.subscription_content_bg}>
                <div className={styles.subscription_content_wrapper}>
                    <span className={styles.back_to_account_btn} onClick={() => {}}>
                        <BackToSomePage path={paths.account} page={t("mainAside.account")} />
                    </span>
                    <div className={styles.active_subscription_wrapper}>
                        <div>
                            <img src={subscription_media} alt="subscription_media" />
                            <p>
                                {t("account.subscriptionSec.your_active_subscription")}
                                <span>{type}</span>
                            </p>
                            <p>
                                {t("account.subscriptionSec.your_active_sub_duration")}
                                {new Date(end).toLocaleString().replaceAll("/", ".")}
                            </p>
                        </div>
                        <div className={styles.not_active_subscriptions}>
                            <p className={styles.available_profiles}>
                                <span>{t("account.subscriptionSec.available_profiles")}</span>
                                <span>{profileLimit || 0}</span>
                                <span>{t("account.subscriptionSec.available_profiles_left")}</span>
                            </p>
                            <p className={styles.go_to_profiles_text}>{t("account.subscriptionSec.available_profiles_sub_title")}</p>
                            <Link to={paths.profiles}>
                                <p className={styles.active_sub_manage_btn}>{t("sundry.manage")}</p>
                            </Link>
                        </div>
                    </div>
                    <Link to={paths.account + "/" + paths.buySubscriptionPlan} className={styles.other_subscriptions_and_options}>
                        {t("account.subscriptionSec.other_subscriptions_and_options")}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionInfo;
