import { useAppDispatch, useAppSelector } from "../../../store";
import { memo, useEffect, useRef, useState } from "react";
import { hideNotifyRedux } from "../../../store/features/notifySlice";
import { constants } from "../../../assets/constants";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./notify.module.scss";

function Notify() {
    const dispatch = useAppDispatch();
    const { yes, no, mainColor } = constants;
    const {
        notify: { notifyId = "", type = mainColor, title = "", subTitle = "", duration = 5000 },
    } = useAppSelector((state) => state.notify);
    const oldNotifyId = useRef<string>("");
    const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);
    const [showN, setShowN] = useState<string>("");

    const clearAllTimeouts = () => {
        timeoutIds.current.forEach((id) => clearTimeout(id));
        timeoutIds.current = [];
    };

    const hideNotify = () => setShowN(no);
    const showNotify = () => {
        clearAllTimeouts();
        setShowN(yes);
        const tId = setTimeout(() => {
            dispatch(hideNotifyRedux());
        }, duration);
        timeoutIds.current.push(tId);
    };
    const hideAndShowNotify = () => {
        clearAllTimeouts();
        setShowN(no);
        const tId = setTimeout(() => {
            setShowN(yes);
        }, 300);
        const tId2 = setTimeout(() => {
            dispatch(hideNotifyRedux());
        }, duration);
        timeoutIds.current.push(tId, tId2);
    };

    useEffect(() => {
        if (notifyId && !oldNotifyId.current) {
            showNotify();
            oldNotifyId.current = notifyId;
        } else if (notifyId && oldNotifyId.current && notifyId !== oldNotifyId.current) {
            hideAndShowNotify();
            oldNotifyId.current = notifyId;
        } else if (!notifyId && oldNotifyId.current) {
            hideNotify();
            oldNotifyId.current = "";
        }
    }, [notifyId]);

    return (
        <div className={styles.notify_main_wrapper} onClick={hideNotify}>
            <div className={`${styles.notify_main_container}  ${showN ? (showN === yes ? styles.show_notify : styles.hide_notify) : ""}`}>
                <div className={styles.notification_color_container} style={{ background: type }}>
                    {!(!showN || showN === no) && (
                        <div className={styles.notification_color_duration} style={{ animationDuration: duration + "ms" }}></div>
                    )}
                </div>
                <CloseIcon className={styles.close_notify_btn} />
                <div className={styles.notify_messages_wrapper}>
                    <p className={styles.notify_title}>{title}</p>
                    <p className={styles.notify_sub_title}>{subTitle}</p>
                </div>
            </div>
        </div>
    );
}

export default memo(Notify);
