import { useState, KeyboardEvent, ChangeEvent } from "react";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { HelperInputPropsTypes } from "../../../types";
import styles from "./helperInput.module.scss";

const HelperInput = ({
    type = "text",
    name,
    value = "",
    onChange = () => {},
    keyDow = () => {},
    isDisable = false,
    errorMessage = "",
    errorWithoutMessage = "",
    onlyErrorInfo,
    placeholder = "",
    style,
}: HelperInputPropsTypes) => {
    const [showPassword, setShowPassword] = useState(false);
    const changeVisibility = () => setShowPassword(!showPassword);
    const changInputValue = (name: string, value: string, e: ChangeEvent<HTMLInputElement>) => {
        if (name.toLowerCase().includes("password")) {
            const validSymbols = new RegExp("^[A-Za-z!@#$%^&*()-_+=;:,./\\`~{}0-9]+$");
            (validSymbols.test(value) || value === "") && onChange(name, value, e);
        } else {
            onChange(name, value, e);
        }
    };

    return (
        <div className={styles.helper_input_wrapper}>
            <div className={styles.border} style={style}>
                {errorMessage && (
                    <div className={styles.error_info} style={{ left: style?.errorInfoLeft + "px" }}>
                        <WarningAmberRoundedIcon />
                        <p style={style && { width: style.width + 60 }}>
                            <span> {errorMessage}</span>
                        </p>
                    </div>
                )}
                <input
                    type={showPassword ? "text" : type}
                    data-type={type}
                    className={styles.inp}
                    id={name}
                    value={value}
                    onChange={(e) => changInputValue(name, e.target.value, e)}
                    onKeyDown={(e: KeyboardEvent) => keyDow(e)}
                    disabled={isDisable}
                    placeholder={placeholder}
                    style={style && { borderRadius: style.borderRadius - 2, borderColor: style.borderColor }}
                />
                <span
                    className={`${styles.animation_border} ${(errorMessage || errorWithoutMessage) && !onlyErrorInfo && styles.active}`}
                    style={style && { borderRadius: style.borderRadius }}
                ></span>
                {type === "password" && (
                    <div className={styles.visibility_wrapper} style={style && { top: style.top }}>
                        {showPassword ? (
                            <VisibilityOffOutlinedIcon onClick={changeVisibility} />
                        ) : (
                            <VisibilityOutlinedIcon onClick={changeVisibility} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HelperInput;
