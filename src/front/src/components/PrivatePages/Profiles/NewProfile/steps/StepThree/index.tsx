import { useEffect, useMemo, useState } from "react";
import { Checkbox, FormControl, ListItemText, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { getLanguagesAsync } from "../../../../../../store/features/newProfileSlice";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { StepThreePropsTypes } from "../../../../../../types";
import { useTranslation } from "react-i18next";
import { offsets } from "../../../../../../assets/offsets";
import { helpers } from "../../../../../../assets/helpers";
import { useLocation } from "react-router-dom";
import HelperSelect from "../../../../../helpersComponents/HelperSelect";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import { constants } from "../../../../../../assets/constants";
import styles from "./step_three.module.scss";
import { setIsChooseParameterRedux } from "../../../../../../store/features/profilesSlice";

function StepThree({ initialValues, changeStep }: StepThreePropsTypes) {
    const { teamInfo } = helpers.convertTeamInfo(useLocation().pathname);
    const { t } = useTranslation();
    const {
        newProfileSlice: { countriesList, languages },
        main: { deviceInfo },
        account: { hash, token },
        profiles: { isChooseParameter },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const { country, changeCountry, changeLanguage, timezone, changeTimezone } = initialValues;

    const timezoneList = useMemo(() => offsets.map((item, i) => ({ id: i, text: item.human, value: item.human })), []);
    const { chooseParameterTypes } = constants;
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(languages);

    const changeSelectedLanguages = (event: SelectChangeEvent<typeof selectedLanguages>) => {
        const {
            target: { value },
        } = event;
        const l = typeof value === "string" ? value.split(",") : value;
        setSelectedLanguages(l);
        changeLanguage(l);
    };

    useEffect(() => {
        if (country.name && !localStorage.getItem("randomProfile")) {
            dispatch(getLanguagesAsync({ deviceInfo, hash, token, country: country.name, teamInfo }));
        }
    }, [country]);

    useEffect(() => {
        if (languages.length && !localStorage.getItem("randomProfile")) {
            setSelectedLanguages(languages);
        }
    }, [languages]);

    return (
        <div className={styles.step_three_wrapper}>
            <label className={styles.new_profile_item_label}>{t("newProfile.step_3.countries")}</label>
            <HelperSelect
                selectItem={country}
                onChange={(type: string, id: string) => changeCountry(id)}
                menuItemsList={countriesList}
                customStyles={{ width: "220px" }}
                chooseParameterType={chooseParameterTypes.country}
            />
            <label className={styles.new_profile_item_label}>{t("newProfile.step_3.language")}</label>
            <FormControl>
                <Select
                    multiple
                    value={selectedLanguages}
                    onChange={changeSelectedLanguages}
                    onFocus={() => {
                        dispatch(setIsChooseParameterRedux({ parameter: "" }));
                    }}
                    renderValue={(selected) => selected.join(" | ")}
                    className={styles.select_place}
                    disabled={!country.name}
                    sx={{
                        width: 220,
                        fontFamily: "Inter-400",
                        fontSize: 12,
                        color: "#292929",
                        border: (isChooseParameter === chooseParameterTypes.language && "2px solid #007aff") + "",
                    }}
                    style={{ height: "36px" }}
                >
                    {languages.map((name) => (
                        <MenuItem key={name} value={name} className={styles.language_item}>
                            <Checkbox checked={selectedLanguages.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <label className={styles.new_profile_item_label}>{t("newProfile.step_3.timezone")}</label>
            <HelperSelect
                selectValue={timezone.human}
                onChange={(type: string, id: string) => changeTimezone(id)}
                menuItems={timezoneList}
                customStyles={{ width: "220px" }}
                chooseParameterType={chooseParameterTypes.timezone}
            />
            <div className={styles.next_back_page_wrapper}>
                <div className={styles.back_page_btn} onClick={() => changeStep("step_2")}>
                    <WestIcon sx={{ fontSize: 15 }} />
                    <span>{t("sundry.back")}</span>
                </div>
                <div className={styles.next_page_btn} onClick={() => changeStep("step_4")}>
                    <span>{t("sundry.next")}</span>
                    <EastIcon sx={{ fontSize: 15 }} />
                </div>
            </div>
        </div>
    );
}

export default StepThree;
