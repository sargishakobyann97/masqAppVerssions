import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./step_zero.module.scss";
import HelperSelect from "../../../../../helpersComponents/HelperSelect";
import EastIcon from "@mui/icons-material/East";
import { StepZeroPropsTypes } from "../../../../../../types";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { getBrowsersAsync } from "../../../../../../store/features/newProfileSlice";
import { helpers } from "../../../../../../assets/helpers";
import { useLocation } from "react-router-dom";
import { setIsChooseParameterRedux } from "../../../../../../store/features/profilesSlice";
import { constants } from "../../../../../../assets/constants";

function StepZero({ initialValues, changeStep }: StepZeroPropsTypes) {
    const { t } = useTranslation();
    const { teamInfo } = helpers.convertTeamInfo(useLocation().pathname);
    const dispatch = useAppDispatch();
    const {
        newProfileSlice: { browsers },
        main: { deviceInfo },
        account: { token, hash },
        profiles: { isChooseParameter },
    } = useAppSelector((state) => state);

    const { allFoldersNameList, profileName, changeProfileName, name, changeName, comment, changeComment } = initialValues;
    const { chooseParameterTypes } = constants;

    useEffect(() => {
        if (!Object.keys(browsers).length) {
            dispatch(getBrowsersAsync({ deviceInfo, token, hash, teamInfo }));
        }
    }, []);

    return (
        <div className={styles.step_zero_wrapper}>
            <label className={styles.new_profile_item_label}>{t("newProfile.step_0.add_to_folder")}</label>
            <HelperSelect
                chooseParameterType={chooseParameterTypes.folder}
                menuItems={allFoldersNameList}
                onChange={changeProfileName}
                selectValue={profileName}
                customStyles={{ width: "220px" }}
            />
            <label htmlFor="new_profile_name_input" className={styles.new_profile_item_label}>
                {t("newProfile.step_0.name")}
            </label>
            <input
                type="text"
                id="new_profile_name_input"
                className={styles.new_profile_name_input}
                value={name}
                onChange={(e) => changeName(e.target.value)}
                onFocus={() => dispatch(setIsChooseParameterRedux({ parameter: "" }))}
                style={{ border: isChooseParameter === chooseParameterTypes.name ? "2px solid #007aff" : "" }}
            />
            <label htmlFor="new_profile_comment_input" className={styles.new_profile_item_label}>
                {t("newProfile.step_0.comment")}
            </label>
            <input
                type="text"
                id="new_profile_comment_input"
                className={styles.new_profile_name_input}
                value={comment}
                onFocus={() => dispatch(setIsChooseParameterRedux({ parameter: "" }))}
                onChange={(e) => changeComment(e.target.value)}
                style={{ border: isChooseParameter === chooseParameterTypes.comment ? "2px solid #007aff" : "" }}
            />
            <div className={styles.next_back_page_wrapper}>
                <div className={styles.next_page_btn} onClick={() => changeStep("step_1")}>
                    <span>{t("sundry.next")}</span>
                    <EastIcon sx={{ fontSize: 15 }} />
                </div>
            </div>
        </div>
    );
}

export default StepZero;
