import React, { useState, useRef, useMemo } from "react";
import ArrowDownIcon from "../../../../../assets/images/svg/ArrowDownIcon";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { AccountMoreOptionsItemsTypes, UsernameBalanceTypes } from "../../../../../types";
import { constants } from "../../../../../assets/constants";
import ProfileIcon from "../../../../../assets/images/svg/account/ProfileIcon";
import BuySubscriptionIcon from "../../../../../assets/images/svg/account/BuySubscriptionIcon";
import TopUpWalletIcon from "../../../../../assets/images/svg/account/TopUpWalletIcon";
import LogOutProfileIcon from "../../../../../assets/images/svg/account/LogOutProfileIcon";
import styles from "./username_balance.module.scss";
import { Link } from "react-router-dom";
import { logOutAsync, resetByDefaultAccountRedux } from "../../../../../store/features/accountSlice";

const UsernameBalance = ({ modalRef, isOpen, changeOpen }: UsernameBalanceTypes) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        account: { user, token, hash },
        main: { deviceInfo },
    } = useAppSelector((state) => state);

    const { paths } = constants;

    const accountMoreOptionsItems = useMemo<AccountMoreOptionsItemsTypes[]>(
        () => [
            {
                id: "Profile Icon",
                logo: (fill: boolean) => <ProfileIcon fill={fill} />,
                name: t("account.account_more_profile_settings"),
                path: paths.settings,
            },
            {
                id: "Buy Subscription",
                logo: (fill: boolean) => <BuySubscriptionIcon fill={fill} />,
                name: t("account.account_more_buy_subscription"),
                path: paths.account + "/" + paths.buySubscriptionPlan,
            },
            {
                id: "Top Up Wallet",
                logo: (fill: boolean) => <TopUpWalletIcon fill={fill} />,
                name: t("account.top_up_wallet"),
                path: paths.account + "/" + paths.topUpWallet,
            },
            {
                id: "Sign Out",
                logo: (fill: boolean) => <LogOutProfileIcon fill={fill} />,
                name: t("account.sign_out_of_account"),
                path: "",
            },
        ],
        []
    );

    const [hovered, setHovered] = useState<string>("");

    const changeHovered = (value: string) => {
        setHovered(value);
    };

    const logOut = () => {
        dispatch(resetByDefaultAccountRedux());
        dispatch(logOutAsync({ token, deviceInfo, hash }));
    };

    const clearHovered = () => {
        setHovered("");
    };

    const closeMoreOptions = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setHovered("");
        changeOpen("isAccountMoreOptionOpen", false);
    };

    return (
        <div className={styles.user_name_balance} onClick={() => changeOpen("isAccountMoreOptionOpen", true)}>
            <p className={styles.user_name}>{user.name}</p>
            <ArrowDownIcon />
            <p className={styles.user_balance}>{user.balance} USD</p>
            {isOpen && (
                <div className={styles.account_more_options_wrapper} ref={modalRef}>
                    {accountMoreOptionsItems.map(({ id, logo, name, path }) =>
                        id !== "Sign Out" ? (
                            <div key={id} onClick={closeMoreOptions}>
                                <Link to={path} onMouseEnter={() => changeHovered(id)} onMouseLeave={clearHovered}>
                                    <span className={styles.account_more_icons}>{logo(id === hovered)}</span>
                                    <span>{name}</span>
                                </Link>
                            </div>
                        ) : (
                            <div key={id}>
                                <button onMouseEnter={() => changeHovered(id)} onMouseLeave={clearHovered} onClick={logOut}>
                                    <span className={styles.account_more_icons}>{logo(id === hovered)}</span>
                                    <span>{name}</span>
                                </button>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default UsernameBalance;
