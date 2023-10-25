///@ts-nocheck
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CookiesSettingsPropsTypes } from "../../../types";
import WestIcon from "@mui/icons-material/West";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import ScreenIcon from "../../../assets/images/svg/ScreenIcon";
import FullScreenIcon from "../../../assets/images/svg/FullScreenIcoon";
import styles from "./cookies_settings.module.scss";

function CookiesSettings({ close, changeCookies, cookies }: CookiesSettingsPropsTypes) {
    const { t } = useTranslation();

    const [cookiesLocal, setCookiesLocal] = useState(cookies);
    const [drag, setDrag] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);

    const changeCoockies = (evt, dwnFile) => {
        const file = dwnFile || evt.target.files?.[0];
        const reader = new FileReader();
        if (!file) return;
        reader.onload = ((theFile) => (e) => {
            try {
                setCookiesLocal({
                    fileName: theFile.name,
                    cookies: e.target.result,
                });
            } catch (ex) {}
        })(file);
        reader.readAsText(file);
    };

    const dragStart = (e) => {
        e.preventDefault();
        setDrag(true);
    };
    const dragLeave = (e) => {
        e.preventDefault();
        setDrag(false);
    };
    const dragOver = (e) => {
        e.preventDefault();
        setDrag(true);
    };
    const dropHandler = (e) => {
        e.preventDefault();
        setDrag(false);
        changeCoockies(e, e.dataTransfer.files[0]);
    };
    const changeCookiesInTextarea = (e) => {
        setCookiesLocal({
            ...cookiesLocal,
            cookies: e.target.value,
        });
    };
    const importHandleClick = () => {
        changeCookies(cookiesLocal);
        close();
    };

    const textStyles = fullScreen ? { width: "100%", height: "383px" } : {};
    return (
        <div className={styles.cookies_settings_wrapper}>
            <p className={styles.back_to_profiles_btn} onClick={() => close()}>
                <WestIcon />
                <span>{t("proxySettings.back_btn")}</span>
            </p>
            <div className={styles.drop_wrapper}>
                <div className={`${styles.drag_input} ${drag && styles.is_dragend}`}>
                    <div>
                        <input
                            type="file"
                            onChange={changeCoockies}
                            onDragStart={dragStart}
                            onDragLeave={dragLeave}
                            onDragOver={dragOver}
                            onDrop={dropHandler}
                        />
                        <div className={styles.drag_info}>
                            <VerticalAlignBottomIcon />
                            <p>
                                {t("cookiesSettings.title.1")} <span>{t("cookiesSettings.title.2")}</span> {t("cookiesSettings.title.3")}
                            </p>
                            <p>{t("cookiesSettings.uploadFormatText")}</p>
                            {cookiesLocal?.fileName && (
                                <>
                                    <h3 className={styles.cookies_name}>
                                        {t("cookiesSettings.file_name")}
                                        {cookiesLocal.fileName}
                                    </h3>
                                    {/* <h3 className={styles.cookies_size}>
                                        <span>{t("cookiesSettings.file_size")}</span>
                                        <span> {cookiesLocal.size} </span>
                                    </h3> */}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.cookies_textarea_wrapper} style={textStyles}>
                    <div className={styles.screen_icons_wrapper} onClick={() => setFullScreen(!fullScreen)}>
                        {fullScreen ? <ScreenIcon /> : <FullScreenIcon />}
                    </div>
                    <textarea value={cookiesLocal.cookies} onChange={changeCookiesInTextarea}></textarea>
                </div>
            </div>

            <p className={styles.import_cookies_btn}>
                <span onClick={importHandleClick}>{t("sundry.import")}</span>
            </p>
        </div>
    );
}

export default CookiesSettings;
