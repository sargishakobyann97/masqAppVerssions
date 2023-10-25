import { useEffect, useState } from "react";
import { constants } from "../../../../assets/constants";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { createFolderAsync, getProfilesAsync, resetByDefaultProfiles, resetTeamsProfilesList } from "../../../../store/features/profilesSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { CreateFolderInitialStateTypes } from "../../../../types";
import { helpers } from "../../../../assets/helpers";
import BackToSomePage from "../../../helpersComponents/BackToSomePage";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import _ from "lodash";
import styles from "./create_folder.module.scss";

const CreateFolder = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        main: { deviceInfo },
        account: { hash, token },
        profiles: { folderNameError, allProfilesList, foldersList, teamsFolders, teamsProfilesList },
    } = useAppSelector((state) => state);

    const { paths, profilesIconsNames } = constants;

    const navigate = useNavigate();
    const { teamInfo } = helpers.convertTeamInfo(useLocation().pathname);

    let allProfilesFolderId = foldersList.allProfilesFolder._id;
    let list = allProfilesList;

    if (teamInfo.teamId) {
        allProfilesFolderId = teamsFolders[teamInfo.teamName]?.allProfilesList?._id;
        list = teamsProfilesList;
    }

    const createFolderInitialState: CreateFolderInitialStateTypes = {
        name: "",
        icon: constants.profilesIconsNames[Math.round(Math.random() * 16)],
        isSelectIconOpen: "",
        profileIds: [],
    };

    const [createFolderFormData, setCreateFolderFormData] = useState(createFolderInitialState);
    const [searchProfile, setSearchProfile] = useState<string>("");

    const filteredList = searchProfile
        ? list.filter(({ info: { name, platform, browser, comment } }) =>
              [name, platform, browser, comment].some((item) => item.toLowerCase().includes(searchProfile.toLowerCase()))
          )
        : list;

    const changeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => setSearchProfile(e.target.value);

    const navigateProfilesPage = () => {
        navigate(paths.profiles);
        dispatch(resetByDefaultProfiles());
    };

    const changeFormDataValues = (type: string, value: string) => {
        let newState = { ...createFolderFormData, [type]: value };
        type === "icon" && (newState.isSelectIconOpen = "");
        setCreateFolderFormData(newState);
    };

    const chooseProfileToFolder = (id: string) => {
        let newState = _.cloneDeep(createFolderFormData);
        if (newState.profileIds.includes(id)) {
            newState = {
                ...newState,
                profileIds: newState.profileIds.filter((item) => item !== id),
            };
        } else {
            newState.profileIds.push(id);
        }
        setCreateFolderFormData(newState);
    };

    const handleCreateFolder = () => {
        if (createFolderFormData.name.trim()) {
            dispatch(
                createFolderAsync({
                    deviceInfo,
                    hash,
                    token,
                    name: createFolderFormData.name,
                    icon: createFolderFormData.icon,
                    profileIds: createFolderFormData.profileIds,
                    teamInfo,
                    navigateProfilesPage,
                })
            );
        }
    };

    useEffect(() => {
        dispatch(getProfilesAsync({ deviceInfo, token, hash, id: allProfilesFolderId, type: "all", teamInfo }));
        return () => {
            dispatch(resetTeamsProfilesList());
            setSearchProfile("");
        };
    }, []);

    return (
        <div className={styles.profiles_create_folder_page_wrapper}>
            <BackToSomePage path={paths.profiles} page={t("mainAside.profiles")} />
            <div className={styles.create_folder_wrapper}>
                <div className={styles.create_folder_header_btn}>
                    <div className={styles.create_folder_header_icon}>
                        <div className={styles.choose_icon}>
                            <div className={createFolderFormData.icon} onClick={() => changeFormDataValues("isSelectIconOpen", "open")}></div>
                            {createFolderFormData.isSelectIconOpen && (
                                <div className={styles.all_icon_wrapper} onClick={() => changeFormDataValues("isSelectIconOpen", "")}>
                                    <div className={styles.create_folder_all_icons}>
                                        {profilesIconsNames.map((item) => (
                                            <div
                                                className={item}
                                                key={item}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    changeFormDataValues("icon", item);
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={styles.create_folder_header_place}>
                            <h2>{t("profiles.create_folder_header")}</h2>
                            <p>{t("profiles.create_folder_text")}</p>
                        </div>
                    </div>
                    <button onClick={handleCreateFolder} disabled={!createFolderFormData.name}>
                        {t("profiles.create_folder")}
                    </button>
                </div>
                <div className={styles.create_folder_input}>
                    <input
                        type="text"
                        placeholder={t("profiles.create_folder_name") + ""}
                        value={createFolderFormData.name}
                        onChange={(e) => changeFormDataValues("name", e.target.value)}
                    />
                    {folderNameError && !teamInfo.teamId && <span>{folderNameError}</span>}
                </div>
                {!!list.length && (
                    <div className={styles.search_profiles_wrapper}>
                        <SearchOutlinedIcon className={styles.search_icon} />
                        <input
                            type="search"
                            placeholder={t("profiles.search_profiles") + ""}
                            value={searchProfile}
                            onChange={changeSearchValue}
                            className={styles.search_profiles_input}
                        />
                    </div>
                )}
                <div className={styles.all_profiles_wrapper}>
                    {!!list.length && (
                        <div className={styles.all_profiles_header}>
                            <div className={styles.all_profiles_number}></div>
                            <div>{t("profiles.all_profiles_name")}</div>
                            <div>{t("profiles.all_profiles_platform")}</div>
                            <div>{t("profiles.all_profiles_browser")}</div>
                            <div>{t("profiles.all_profiles_comment")}</div>
                            <div></div>
                        </div>
                    )}
                    <div className={styles.all_profiles_items_place}>
                        {filteredList.length ? (
                            filteredList.map((item, index) => (
                                <div className={styles.all_profiles_item} key={item._id}>
                                    <div
                                        className={styles.all_profiles_number}
                                        data-type={createFolderFormData.profileIds?.includes(item._id) && "choose"}
                                    >
                                        {index + 1}
                                    </div>
                                    <div title={item.info.name}>
                                        <span>{item.info.name}</span>
                                    </div>
                                    <div title={item.info.platform}>
                                        <span>{item.info.platform}</span>
                                    </div>
                                    <div title={item.info.browser}>
                                        <span>{item.info.browser}</span>
                                    </div>
                                    <div title={item.info.comment}>
                                        <span>{item.info.comment}</span>
                                    </div>
                                    <div className={styles.all_profiles_add} onClick={() => chooseProfileToFolder(item._id)}>
                                        {!createFolderFormData.profileIds?.includes(item._id) ? <AddIcon /> : <DoneIcon />}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <span className={styles.nothing_found}>{t("search.nothing_found")}</span>
                        )}
                        {}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateFolder;
