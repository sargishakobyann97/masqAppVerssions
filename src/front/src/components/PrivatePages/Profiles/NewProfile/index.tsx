import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { constants } from "../../../../assets/constants";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { showNotifyRedux } from "../../../../store/features/notifySlice";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import CloseIcon from "@mui/icons-material/Close";
import GridViewIcon from "@mui/icons-material/GridView";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import StepFour from "./steps/StepFour";
import { offsets } from "../../../../assets/offsets";
import {
    createProfileAsync,
    generateRandomProfileAsync,
    resetNewProfileState,
    resetRandomGeneratedProfile,
} from "../../../../store/features/newProfileSlice";
import StepZero from "./steps/StepZero";
import LongArrowIcon from "../../../../assets/images/svg/LongArrowIcon";
import {
    ImportNewProfileTypes,
    InitialNewProfileStateTypes,
    InitialProxyDataTypes,
    SelectedProfileParameter,
    SelectsMenuItemsTypes,
} from "../../../../types";
import { helpers } from "../../../../assets/helpers";
import _ from "lodash";
import styles from "./new_folder.module.scss";
import { setIsChooseParameterRedux } from "../../../../store/features/profilesSlice";

const initialStepsValue = {
    step_0: {
        value: 0,
        current: true,
    },
    step_1: {
        value: 1,
        current: false,
    },
    step_2: {
        value: 2,
        current: false,
    },
    step_3: {
        value: 3,
        current: false,
    },
    step_4: {
        value: 4,
        current: false,
    },
};

const initialNewProfileState: InitialNewProfileStateTypes = {
    folderId: "",
    name: "",
    os: "",
    platform: "",
    browser: "",
    browserVersion: "",
    resolution: {
        name: "",
        type: "",
        data: {
            width: 0,
            height: 0,
            colorDepth: 0,
        },
        _id: "",
        platforms: "",
    },
    cpu: {
        name: "",
        type: "",
        data: {
            amount: "",
        },
        _id: "",
    },
    gpu: {
        name: "",
        type: "",
        data: {
            corp: "",
            model: "",
        },
        _id: "",
    },
    ram: {
        name: "",
        type: "",
        data: {
            amount: "",
        },
        _id: "",
    },
    country: {
        name: "",
        code: "",
        flag: "",
    },
    language: [],
    timezone: {
        location: "",
        city: "",
        region: "",
        standard: "",
        daylight: "",
        human: "",
        offset: 0,
    },
    proxy: {
        name: "",
        protocol: "SOCKS5",
        login: "",
        password: "",
        hostAndPort: "",
    },
    geo: "",
    geocode: {},
    cookies: {
        fileName: "",
        cookies: "",
    },
    AFP: false,
    AWP: false,
    AAP: false,
    ACP: false,
    user_agent: "",
    comment: "",
    acceptEncoding: "", // Will be added from the backend.
    acceptStr: "", // Will be added from the backend.
    jsBaseCode: "", // Will be added from the backend.
    jsATDCode: "", // Will be added from the backend.
};

function NewProfile() {
    const { pathname, teamInfo } = helpers.convertTeamInfo(useLocation().pathname);
    const folderId = pathname.split("/")[2];
    const {
        paths,
        valid,
        notifyTypes: { error },
    } = constants;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        profiles: {
            foldersList: { allProfilesFolder },
            foldersList,
            teamsFolders,
        },
        main: { deviceInfo },
        account: { hash, token },
        newProfileSlice: { resolutionsList, cpuList, gpuList, ramList, countriesList, userAgent, randomProfileData, browsers },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const [steps, setSteps] = useState(initialStepsValue);
    const [newProfile, setNewProfile] = useState({ ...initialNewProfileState, folderId });

    const allFoldersNameList = teamInfo.teamId
        ? (() => {
              ///@ts-ignore
              const list: SelectsMenuItemsTypes[] = teamsFolders[teamInfo.teamName]?.customFoldersProfilesList?.map((folder) => ({
                  id: folder._id,
                  text: folder.name,
                  value: folder.name,
                  icon: folder.icon + "",
              }));
              // list.unshift({ id: foldersList.favoriteProfilesFolder._id, text: "Favorites", value: "Favorites", icon: "icon_star" });
              list?.unshift({
                  ///@ts-ignore
                  id: teamsFolders[teamInfo.teamName]?.allProfilesList?._id,
                  text: "All Profiles",
                  value: "All Profiles",
                  icon: "icon_square",
              });
              return list;
          })()
        : (() => {
              const list: SelectsMenuItemsTypes[] = foldersList.folders.map((folder) => ({
                  id: folder._id,
                  text: folder.name,
                  value: folder.name,
                  icon: folder.icon + "",
              }));
              // list.unshift({ id: foldersList.favoriteProfilesFolder._id, text: "Favorites", value: "Favorites", icon: "icon_star" });
              list.unshift({ id: foldersList.allProfilesFolder._id, text: "All Profiles", value: "All Profiles", icon: "icon_square" });
              return list;
          })();
    const selectedFolder = allFoldersNameList?.find((folder) => folder.id === newProfile.folderId);
    const selectedFolderName = selectedFolder?.value || "";
    const selectedFolderIcon = selectedFolder?.icon || "";
    const importProfileInput = useRef<HTMLInputElement | null>(null);
    const stepTitles = useMemo(
        () => [
            {
                title: t("newProfile.step_1.title"),
                subTitle: t("newProfile.step_1.subTitle"),
                step: "step_1",
            },
            {
                title: t("newProfile.step_2.title"),
                subTitle: t("newProfile.step_2.subTitle"),
                step: "step_2",
            },
            {
                title: t("newProfile.step_3.title"),
                subTitle: t("newProfile.step_3.subTitle"),
                step: "step_3",
            },
            {
                title: t("newProfile.step_4.title"),
                subTitle: t("newProfile.step_4.subTitle"),
                step: "step_4",
            },
        ],
        [t]
    );

    const selectedProfileParameters: SelectedProfileParameter[] = useMemo(
        () => [
            {
                text: t("newProfile.step_0.folder"),
                value: selectedFolderName,
                step: "step_0",
            },
            {
                text: t("newProfile.step_0.name"),
                value: newProfile.name,
                step: "step_0",
            },
            {
                text: t("newProfile.step_0.comment"),
                value: newProfile.comment,
                step: "step_0",
            },
            {
                text: t("newProfile.step_1.os"),
                value: newProfile.os,
                step: "step_1",
            },
            {
                text: t("newProfile.step_1.platform"),
                value: newProfile.platform,
                step: "step_1",
            },
            {
                text: t("newProfile.step_1.browser"),
                value: newProfile.browser,
                step: "step_1",
            },
            {
                text: t("newProfile.step_1.browser_version"),
                value: newProfile.browserVersion,
                step: "step_1",
            },
            {
                text: t("newProfile.step_2.screen_resolution"),
                value: newProfile.resolution.name,
                step: "step_2",
            },
            {
                text: "CPU",
                value: newProfile.cpu.name,
                step: "step_2",
            },
            {
                text: "GPU",
                value: newProfile.gpu.name,
                step: "step_2",
            },
            {
                text: "RAM",
                value: newProfile.ram.name,
                step: "step_2",
            },
            {
                text: t("newProfile.step_3.countries"),
                value: newProfile.country.name,
                step: "step_3",
            },
            {
                text: t("newProfile.step_3.language"),
                value: newProfile.language.join(" | "),
                step: "step_3",
            },
            {
                text: t("newProfile.step_3.timezone"),
                value: newProfile.timezone.human,
                step: "step_3",
            },
            // {
            //     text: "Font",
            //     value: newProfile.AFP ? t("sundry.included") : "",
            //     step: "step_4",
            // },
            // {
            //     text: "WebGL",
            //     value: newProfile.AWP ? t("sundry.included") : "",
            //     step: "step_4",
            // },
            // {
            //     text: "Audio",
            //     value: newProfile.AAP ? t("sundry.included") : "",
            //     step: "step_4",
            // },
            // {
            //     text: "Canvas",
            //     value: newProfile.ACP ? t("sundry.included") : "",
            //     step: "step_4",
            // },
        ],
        [t, newProfile]
    );

    const checkChangeStep = (stepValue: string) => {
        let result: string = valid;
        let currentStep: number = 0;
        for (const step in steps) {
            if (steps[step as keyof typeof steps].current) {
                currentStep = steps[step as keyof typeof steps].value;
                break;
            }
        }

        const nextStep: number = +stepValue.slice(-1);
        if (nextStep < currentStep || nextStep === currentStep) return result;
        function checkZeroStep() {
            if (result !== valid) return result;
            if (teamInfo.teamId) {
                if (newProfile.folderId === teamsFolders[teamInfo.teamName].favoriteProfilesList._id)
                    result = t("newProfile.step_0.folder") + "**step_0";
            } else {
                if (newProfile.folderId === foldersList.favoriteProfilesFolder._id) result = t("newProfile.step_0.folder") + "**step_0";
            }
            if (!newProfile.name && result === valid) result = t("newProfile.step_0.name") + "**step_0";
        }
        function checkOneStep() {
            if (result !== valid) return result;
            if (!newProfile.os) result = t("newProfile.step_1.os") + "**step_1";
            else if (!newProfile.platform) result = t("newProfile.step_1.platform") + "**step_1";
            else if (!newProfile.browser) result = t("newProfile.step_1.browser") + "**step_1";
            else if (!newProfile.browserVersion) result = t("newProfile.step_1.browser_version") + "**step_1";
        }
        function checkTwoStep() {
            if (result !== valid) return result;
            if (!newProfile.resolution.name) result = t("newProfile.step_2.screen_resolution") + "**step_2";
            else if (!newProfile.cpu.name) result = "CPU" + "**step_2";
            else if (!newProfile.gpu.name) result = "GPU" + "**step_2";
            else if (!newProfile.ram.name) result = "RAM" + "**step_2";
        }
        function checkThreeStep() {
            if (result !== valid) return result;
            if (!newProfile.country.name) result = t("newProfile.step_3.countries") + "**step_3";
            // else if (!newProfile.language.length) result = t("newProfile.step_3.language") + "**step_3";
            // else if (!newProfile.timezone.human) result = t("newProfile.step_3.timezone") + "**step_3";
        }
        function checkFourStep() {}

        const stepsFn = [checkZeroStep, checkOneStep, checkTwoStep, checkThreeStep, checkFourStep];
        for (let i = 0; i < nextStep; i++) stepsFn[i]();
        if (result !== valid) result = t("sundry.please_fill") + result + t("sundry.field");
        return result;
    };

    const changeStep = (stepValue: string, requiredStep?: string) => {
        const changeStepValue: string = requiredStep || checkChangeStep(stepValue);
        const newStepsValue = JSON.parse(JSON.stringify(initialStepsValue).replaceAll(`"current":true`, `"current":false`));
        if (requiredStep || changeStepValue === valid) {
            newStepsValue[requiredStep || stepValue].current = true;
        } else {
            const i = changeStepValue.indexOf("**");
            const stepValue = changeStepValue.slice(i + 2, i + 8);
            const subTitle = changeStepValue.replace("**" + stepValue, "");
            newStepsValue[stepValue].current = true;
            dispatch(showNotifyRedux({ type: error, duration: 3000, title: t("sundry.required_fields"), subTitle }));
        }
        setSteps(newStepsValue);
    };

    const closeCreateProfilePage = () => {
        navigate(
            teamInfo.teamId
                ? paths.profiles + "/" + folderId + `**teamId=${teamInfo.teamId}*teamName=${teamInfo.teamName}`
                : paths.profiles + "/" + folderId
        );
    };

    const changeName = (name: string) => {
        setNewProfile({ ...newProfile, name });
    };
    const changeOs = (os: string) => {
        setNewProfile({ ...newProfile, os, platform: "", browser: "", browserVersion: "", resolution: initialNewProfileState.resolution });
    };
    const changePlatform = (platform: string) => {
        setNewProfile({ ...newProfile, platform, browser: "", browserVersion: "" });
    };
    const changeBrowser = (browser: string) => {
        setNewProfile({ ...newProfile, browser, browserVersion: "" });
    };
    const changeBrowserVersion = (browserVersion: string) => {
        setNewProfile({ ...newProfile, browserVersion });
    };
    const changeResolution = (resolutionId: string) => {
        setNewProfile({ ...newProfile, resolution: resolutionsList.find((item) => item.name === resolutionId) || initialNewProfileState.resolution });
    };
    const changeCPU = (cpuName: string) => {
        setNewProfile({ ...newProfile, cpu: cpuList.find((item) => item.name === cpuName) || initialNewProfileState.cpu });
    };
    const changeGPU = (gpuName: string) => {
        setNewProfile({ ...newProfile, gpu: gpuList.find((item) => item.name === gpuName) || initialNewProfileState.gpu });
    };
    const changeRAM = (ramName: string) => {
        setNewProfile({ ...newProfile, ram: ramList.find((item) => item.name === ramName) || initialNewProfileState.ram });
    };
    const changeCountry = (countryName: string) => {
        setNewProfile({ ...newProfile, country: countriesList.find((item) => item.name === countryName) || initialNewProfileState.country });
    };
    const changeLanguage = (language: string[]) => {
        setNewProfile({ ...newProfile, language });
    };
    const changeTimezone = (timezoneId: string) => {
        const timezone = offsets.find((item) => item.human === timezoneId) || initialNewProfileState.timezone;
        setNewProfile({ ...newProfile, timezone });
    };
    const changeFingerprintValues = (fingerprint: string) => {
        setNewProfile({ ...newProfile, [fingerprint]: !newProfile[fingerprint as keyof typeof newProfile] });
    };
    const changeUserAgent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewProfile({ ...newProfile, user_agent: e.target.value });
    };
    const changeComment = (comment: string) => {
        setNewProfile({ ...newProfile, comment });
    };
    const changeFolderToSave = (type: string, value: string) => {
        let folderId = teamInfo.teamId ? teamsFolders[teamInfo.teamName]?.allProfilesList?._id : foldersList.allProfilesFolder._id;
        if (value !== "All Profiles") {
            teamInfo.teamId
                ? teamsFolders[teamInfo.teamName]?.customFoldersProfilesList?.forEach((folder) => {
                      if (folder.name === value) {
                          folderId = folder._id;
                      }
                  })
                : foldersList.folders.forEach((folder) => {
                      if (folder.name === value) {
                          folderId = folder._id;
                      }
                  });
        }
        setNewProfile({ ...newProfile, folderId });
    };

    const changeProxy = (fullProxy: InitialProxyDataTypes) => {
        const proxy = {
            name: fullProxy.protocol,
            protocol: fullProxy.protocol,
            login: fullProxy.login,
            password: fullProxy.password,
            hostAndPort: fullProxy.hostAndPort,
        };
        const geo = fullProxy.geo;
        const geocode = fullProxy.geocode;
        let timezone = newProfile.timezone;
        if (!timezone.human && Object.keys(fullProxy.timezone).length) {
            timezone = {
                location: fullProxy.timezone.location,
                city: fullProxy.timezone.location.split("/")[1],
                region: fullProxy.timezone.location.split("/")[0],
                standard: fullProxy.timezone.standard,
                daylight: fullProxy.timezone.daylight,
                human: fullProxy.timezone.location,
                offset: fullProxy.timezone.offset,
            };
        }
        setNewProfile({ ...newProfile, proxy, geo, geocode, timezone });
    };
    const changeCookies = (cookies: { fileName: string; cookies: string }) => {
        setNewProfile({ ...newProfile, cookies });
    };

    const createProfile = () => {
        const profile = _.cloneDeep(newProfile);
        if (!profile.timezone.human) {
            dispatch(showNotifyRedux({ type: error, title: t("sundry.please_fill") + " Timezone " + t("sundry.field") }));
            changeStep("", "step_3");
        } else if (!profile.user_agent) {
            dispatch(showNotifyRedux({ type: error, title: t("notifyMessages.please_fill_user_agent") }));
        } else {
            if (
                profile.folderId === foldersList.allProfilesFolder._id ||
                profile.folderId === teamsFolders[teamInfo.teamName]?.allProfilesList?._id
            ) {
                profile.folderId = "";
            }
            dispatch(createProfileAsync({ deviceInfo, hash, token, newProfile: profile, closeCreateProfilePage, selectedFolderIcon, teamInfo }));
        }
    };

    const handleClickProfileParameters = (changeStepValue: string, parameterValue: string) => {
        dispatch(setIsChooseParameterRedux({ parameter: parameterValue }));
        changeStep(changeStepValue);
    };

    const readProfileFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        let file = e.target?.files?.[0];
        if (!file) {
            return;
        }
        let reader = new FileReader();
        reader.onload = function (e) {
            let contents = e.target?.result;

            try {
                let json = JSON.parse(contents + "");
                let importedProfile: InitialNewProfileStateTypes[] = [];

                if (Array.isArray(json)) {
                    let json: ImportNewProfileTypes[] = JSON.parse(contents + "");
                    importedProfile = helpers.convertProfilesAsNeeded({ importedNewProfiles: json.map((item) => ({ ...item, folderId })) });
                } else {
                    importedProfile = helpers.convertProfilesAsNeeded({ localProfiles: [{ ...json, folderId }], isImportProfile: true });
                }
                importedProfile.forEach((profile) => {
                    if (
                        profile.folderId === foldersList.allProfilesFolder._id ||
                        profile.folderId === teamsFolders[teamInfo.teamName]?.allProfilesList?._id
                    ) {
                        profile.folderId = "";
                    }
                    dispatch(
                        createProfileAsync({
                            deviceInfo,
                            hash,
                            token,
                            newProfile: profile,
                            selectedFolderIcon,
                            teamInfo,
                        })
                    );
                });
            } catch (e) {}
        };
        reader.readAsText(file);
        if (importProfileInput.current) {
            importProfileInput.current.value = "";
        }
    };
    const handleGenerateRandomProfile = () => {
        dispatch(generateRandomProfileAsync({ token, hash, deviceInfo, teamInfo, folderId, browsers }));
    };

    useEffect(() => {
        setNewProfile({ ...newProfile, user_agent: userAgent });
    }, [userAgent]);

    useEffect(() => {
        return () => {
            dispatch(resetNewProfileState());
            dispatch(resetRandomGeneratedProfile());
            dispatch(setIsChooseParameterRedux({ parameter: "" }));
        };
    }, []);

    useEffect(() => {
        if (randomProfileData.country.name) {
            setNewProfile(randomProfileData);
            changeStep("", "step_4");
            localStorage.setItem("randomProfile", "1");
            const timeoutId: NodeJS.Timeout = setTimeout(() => {
                localStorage.removeItem("randomProfile");
                clearTimeout(timeoutId);
            }, 400);
        }
    }, [randomProfileData.country]);

    return (
        <div className={styles.new_profile_wrapper}>
            <div className={styles.new_profile_header}>
                <div className={styles.new_profile_header_left_block}>
                    <p className={styles.create_new_profile_title}>{t("newProfile.main_title")}</p>
                    <p className={styles.generate_randomly_profile_btn} onClick={handleGenerateRandomProfile}>
                        <GridViewIcon sx={{ fontSize: 16 }} />
                        <span>{t("sundry.generate")}</span>
                    </p>
                    <label className={styles.import_profile_btn}>
                        <VerticalAlignBottomIcon sx={{ fontSize: 14 }} />
                        <span>{t("newProfile.import_profile_btn")}</span>
                        <input type="file" accept=".txt" ref={importProfileInput} onChange={readProfileFile} className={styles.import_input} />
                    </label>
                </div>
                <Link
                    to={
                        teamInfo.teamId
                            ? paths.profiles + "/" + folderId + `**teamId=${teamInfo.teamId}*teamName=${teamInfo.teamName}`
                            : folderId === allProfilesFolder._id
                            ? paths.profiles
                            : paths.profiles + "/" + folderId
                    }
                    className={styles.cancel_btn}
                >
                    <span>{t("sundry.cancel")}</span> <CloseIcon sx={{ fontSize: 14 }} />
                </Link>
            </div>
            <div className={styles.new_profile_container}>
                <div className={styles.all_steps_wrapper}>
                    {steps.step_0.current && (
                        <div key={"item.step"} className={`${styles.step_item_zero} ${styles.active_step_item} `}>
                            <p className={styles.step_title}>{t("newProfile.step_0.title")}</p>
                            <p className={styles.step_sub_title}>{t("newProfile.step_0.subTitle")}</p>
                            <p className={styles.arrow_img}>
                                <LongArrowIcon />
                            </p>
                        </div>
                    )}
                    <div className={styles.new_profile_steps_wrapper} style={{ left: steps.step_0.current ? "370px" : "0px" }}>
                        {stepTitles.map((item, i) => (
                            <div
                                onClick={() => changeStep(item.step)}
                                key={item.step}
                                className={`${styles.step_item} ${steps[item.step as keyof typeof steps].current && styles.active_step_item} `}
                            >
                                <p className={styles.step_title}>{item.title}</p>
                                <p className={styles.step_sub_title}>{item.subTitle}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.selected_properties_wrapper}>
                    <p className={styles.selected_profile_parameters_title}>{t("newProfile.selected_profile_parameters_title")}</p>
                    <div className={styles.selected_properties_container}>
                        {selectedProfileParameters.map((parameter) => {
                            return parameter.value ? (
                                <p
                                    key={parameter.text}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClickProfileParameters(parameter.step, parameter.text);
                                    }}
                                    title={parameter.value}
                                >
                                    {parameter.text}: {parameter.value}
                                </p>
                            ) : null;
                        })}
                    </div>
                    {steps.step_4.current && (
                        <>
                            <p className={styles.user_agent_title}>{t("newProfile.step_4.user_agent")}</p>
                            <textarea className={styles.user_agent_textarea} value={newProfile.user_agent} onChange={changeUserAgent}></textarea>
                            <div className={styles.create_cancel_btns_wrapper}>
                                <Link
                                    to={folderId === allProfilesFolder._id ? paths.profiles : paths.profiles + "/" + folderId}
                                    className={styles.cancel_btn}
                                >
                                    <span>{t("sundry.cancel")}</span>
                                </Link>

                                <p className={styles.create_btn} onClick={createProfile}>
                                    {t("sundry.create")}
                                </p>
                            </div>
                        </>
                    )}
                </div>
                <div className={styles.steps_main_container}>
                    {steps.step_0.current && (
                        <StepZero
                            initialValues={{
                                allFoldersNameList,
                                profileName: selectedFolderName,
                                changeProfileName: changeFolderToSave,
                                name: newProfile.name,
                                changeName,
                                comment: newProfile.comment,
                                changeComment,
                            }}
                            changeStep={changeStep}
                        />
                    )}

                    {steps.step_1.current && (
                        <StepOne
                            initialValues={{
                                os: newProfile.os,
                                platform: newProfile.platform,
                                browser: newProfile.browser,
                                browserVersion: newProfile.browserVersion,
                                changeOs,
                                changePlatform,
                                changeBrowser,
                                changeBrowserVersion,
                            }}
                            changeStep={changeStep}
                        />
                    )}
                    {steps.step_2.current && (
                        <StepTwo
                            initialValues={{
                                resolution: newProfile.resolution,
                                changeResolution,
                                cpu: newProfile.cpu,
                                changeCPU,
                                gpu: newProfile.gpu,
                                changeGPU,
                                ram: newProfile.ram,
                                changeRAM,
                            }}
                            os={newProfile.os}
                            changeStep={changeStep}
                        />
                    )}
                    {steps.step_3.current && (
                        <StepThree
                            initialValues={{
                                country: newProfile.country,
                                changeCountry,
                                language: newProfile.language,
                                changeLanguage,
                                timezone: newProfile.timezone,
                                changeTimezone,
                            }}
                            changeStep={changeStep}
                        />
                    )}
                    {steps.step_4.current && (
                        <StepFour
                            initialValues={{
                                AFP: newProfile.AFP,
                                AWP: newProfile.AWP,
                                AAP: newProfile.AAP,
                                ACP: newProfile.ACP,
                                changeFingerprintValues,
                                proxy: newProfile.proxy,
                                changeProxy,
                                cookies: newProfile.cookies,
                                changeCookies,
                                geo: newProfile.geo,
                            }}
                            changeStep={changeStep}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default NewProfile;
