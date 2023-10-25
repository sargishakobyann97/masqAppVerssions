import React from "react";
import Switch from "react-switch";
import styles from "./helper_switch.module.scss";
import { HelperSwitchTypes } from "../../../types";

const HelperSwitch = ({ checked, onChange, disabled }: HelperSwitchTypes) => {
    return (
        <Switch
            onChange={() => onChange()}
            checked={checked}
            offColor="#fff"
            onColor="#fff"
            offHandleColor="#808080"
            onHandleColor="#560BAD"
            handleDiameter={10}
            className={`${styles.switch_btn} ${disabled && styles.switch_btn_disabled} ${!checked && styles.does_not_checked}`}
            width={32}
            height={14}
            disabled={disabled}
        />
    );
};

export default HelperSwitch;
