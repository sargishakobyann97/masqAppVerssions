import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { getHardwareAndCountriesAsync } from "../../../../../../store/features/newProfileSlice";
import { useTranslation } from "react-i18next";
import { ResolutionTypes, StepTwoPropsTypes } from "../../../../../../types";
import { helpers } from "../../../../../../assets/helpers";
import { useLocation } from "react-router-dom";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import HelperSelect from "../../../../../helpersComponents/HelperSelect";
import _ from "lodash";
import { constants } from "../../../../../../assets/constants";
import styles from "./step_two.module.scss";

function StepTwo({ initialValues, changeStep, os }: StepTwoPropsTypes) {
    const dispatch = useAppDispatch();
    const { teamInfo } = helpers.convertTeamInfo(useLocation().pathname);
    const { t } = useTranslation();
    const {
        newProfileSlice: { resolutionsList, cpuList, gpuList, ramList },
        main: { deviceInfo },
        account: { hash, token },
    } = useAppSelector((state) => state);
    const { resolution, changeResolution, cpu, changeCPU, gpu, changeGPU, ram, changeRAM } = initialValues;
    const resolutionsListLocal = resolutionsList.filter((item) => item.platforms.toUpperCase().search(os.toUpperCase()) > -1);
    const { chooseParameterTypes } = constants;

    useEffect(() => {
        if (!resolutionsList.length && !localStorage.getItem("randomProfile")) {
            dispatch(getHardwareAndCountriesAsync({ deviceInfo, hash, token, teamInfo }));
        }
    }, []);

    return (
        <div className={styles.step_two_wrapper}>
            <label className={styles.new_profile_item_label}>{t("newProfile.step_2.screen_resolution")}</label>
            <HelperSelect
                selectItem={resolution}
                onChange={(type: string, id: string) => changeResolution(id)}
                menuItemsList={resolutionsListLocal.sort((a: ResolutionTypes, b: ResolutionTypes) => a.data.width - b.data.width)}
                customStyles={{ width: "220px" }}
                chooseParameterType={chooseParameterTypes.screen_resolution}
            />
            <label className={styles.new_profile_item_label}>CPU</label>
            <HelperSelect
                selectItem={cpu}
                onChange={(type: string, id: string) => changeCPU(id)}
                menuItemsList={_.cloneDeep(cpuList).sort((a, b) => parseInt(a.data.amount) - parseInt(b.data.amount))}
                customStyles={{ width: "220px" }}
                chooseParameterType={chooseParameterTypes.cpu}
            />
            <label className={styles.new_profile_item_label}>GPU</label>
            <HelperSelect
                selectItem={gpu}
                onChange={(type: string, id: string) => changeGPU(id)}
                menuItemsList={gpuList}
                customStyles={{ width: "220px" }}
                chooseParameterType={chooseParameterTypes.gpu}
            />
            <label className={styles.new_profile_item_label}>RAM</label>
            <HelperSelect
                selectItem={ram}
                onChange={(type: string, id: string) => changeRAM(id)}
                menuItemsList={_.cloneDeep(ramList).sort((a, b) => parseInt(a.data.amount) - parseInt(b.data.amount))}
                customStyles={{ width: "220px" }}
                chooseParameterType={chooseParameterTypes.ram}
            />
            <div className={styles.next_back_page_wrapper}>
                <div className={styles.back_page_btn} onClick={() => changeStep("step_1")}>
                    <WestIcon sx={{ fontSize: 15 }} />
                    <span>{t("sundry.back")}</span>
                </div>
                <div className={styles.next_page_btn} onClick={() => changeStep("step_3")}>
                    <span>{t("sundry.next")}</span>
                    <EastIcon sx={{ fontSize: 15 }} />
                </div>
            </div>
        </div>
    );
}

export default StepTwo;
