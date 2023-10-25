import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { constants } from "../../../../assets/constants";
import { helpers } from "../../../../assets/helpers";
import DeleteIcon from "../../../../assets/images/svg/profiles/DeleteIcon";
import DuplicateIcon from "../../../../assets/images/svg/profiles/DuplicateIcon";
import EditIcon from "../../../../assets/images/svg/profiles/EditIcon";
import ExportCookieIcon from "../../../../assets/images/svg/profiles/ExportCookieIcon";
import ExportProfilesIcon from "../../../../assets/images/svg/profiles/ExportProfilesIcon";
import ImportProfilesIcon from "../../../../assets/images/svg/profiles/ImportProfilesIcon";
import MoveToFolderIcon from "../../../../assets/images/svg/profiles/MoveToFolderIcon";
import PlayIcon from "../../../../assets/images/svg/profiles/PlayIcon";
import RefreshIcon from "../../../../assets/images/svg/profiles/RefreshIcon";
import RenameIcon from "../../../../assets/images/svg/profiles/RenameIcon";
import SettingsIcon from "../../../../assets/images/svg/profiles/SettingsIcon";
import ShareIcon from "../../../../assets/images/svg/profiles/ShareIcon";
import StopIcon from "../../../../assets/images/svg/profiles/StopIcon";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { setHelperModalTypeRedux } from "../../../../store/features/helperModalSlice";
import { exportProfileOrCookiesAsync } from "../../../../store/features/mainSlice";
import {
    changeFolderIconAsync,
    changeFolderNameAsync,
    createFolderAsync,
    deleteProfileAsync,
    duplicateProfileAsync,
    getProfileAsync,
    getProfilesAsync,
    resetChangeFolderNameError,
    resetFoldersProfilesList,
    resetTeamsProfilesList,
} from "../../../../store/features/profilesSlice";
import {
    FolderPageInitialStateTypes,
    FolderPageMoreItemsMenuItemsTypes,
    FolderPageMoreItemsTypes,
    FoldersItemTypes,
    ProfilesTypes,
} from "../../../../types";
import BackToSomePage from "../../../helpersComponents/BackToSomePage";
import HelperMoreItems from "../../../helpersComponents/HelperMoreItems";
import styles from "./folder_page.module.scss";

const folderPageInitialState: FolderPageInitialStateTypes = {
    isSelectIconOpen: false,
    changingName: false,
    searchProfile: "",
};

const FolderPage = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        profiles: {
            foldersList,
            allProfilesList,
            changeFolderNameError,
            favoriteProfilesList,
            customFoldersProfilesList,
            startedProfiles,
            teamsFolders,
            teamsProfilesList,
        },
        account: { token, hash },
        main: { deviceInfo },
    } = useAppSelector((state) => state);
    const { paths, profilesIconsNames, allProfilesType, favoriteProfilesType, customFolderProfilesType, helperModalTypes } = constants;
    const { pathname, teamInfo } = helpers.convertTeamInfo(useLocation().pathname);
    const importProfilesRef = useRef<HTMLInputElement | null>(null);

    const id = pathname.split("/")[2];

    const navigate = useNavigate();

    const findFolder = useMemo(
        () => ({
            name: "",
            icon: "",
            profiles: [],
            updateAt: 0,
            createAt: 0,
            _id: "",
        }),
        []
    );

    let folder: FoldersItemTypes = findFolder;
    let type: string = "";
    let list: ProfilesTypes[] = [];

    if (teamInfo.teamId) {
        if (id === teamsFolders[teamInfo.teamName]?.allProfilesList?._id) {
            folder = { ...teamsFolders[teamInfo.teamName]?.allProfilesList, icon: "icon_square", name: t("profiles.your_profiles_all_profiles") };
            type = allProfilesType;
            list = teamsProfilesList;
        } else if (id === teamsFolders[teamInfo.teamName]?.favoriteProfilesList?._id) {
            folder = { ...teamsFolders[teamInfo.teamName]?.favoriteProfilesList, icon: "icon_star", name: t("profiles.your_profiles_favorite") };
            type = favoriteProfilesType;
            list = teamsProfilesList;
        } else if (Object.keys(teamsFolders).length) {
            folder =
                teamsFolders[teamInfo.teamName]?.customFoldersProfilesList?.find((item) => item?._id === id) ||
                teamsFolders[teamInfo.teamName].customFoldersProfilesList[0];
            type = customFolderProfilesType;
            list = teamsProfilesList;
        }
    } else {
        if (id === foldersList.allProfilesFolder._id) {
            folder = { ...foldersList.allProfilesFolder, icon: "icon_square", name: t("profiles.your_profiles_all_profiles") };
            type = allProfilesType;
            list = allProfilesList;
        } else if (id === foldersList.favoriteProfilesFolder._id) {
            folder = { ...foldersList.favoriteProfilesFolder, icon: "icon_star", name: t("profiles.your_profiles_favorite") };
            type = favoriteProfilesType;
            list = favoriteProfilesList;
        } else {
            folder = foldersList.folders.find((item) => item._id === id) || findFolder;
            type = customFolderProfilesType;
            list = customFoldersProfilesList;
        }
    }
    const icon = profilesIconsNames[Math.round(Math.random() * 16)];

    const folderPageMoreItems = useMemo<FolderPageMoreItemsTypes[]>(
        () => [
            {
                id: uuid(),
                icon: (fill: boolean) => <RefreshIcon fill={fill} />,
                name: t("profiles.more_items.refresh"),
                callBack: () => {
                    dispatch(getProfilesAsync({ deviceInfo, token, hash, id, type, teamInfo }));
                },
            },
            {
                id: uuid(),
                icon: (fill: boolean) => <RenameIcon fill={fill} />,
                name: t("profiles.more_items.rename"),
                callBack: () => {
                    setTimeout(() => setFolderPageData({ ...folderPageData, changingName: true }), 0);
                },
                disabled: type === allProfilesType || type === favoriteProfilesType,
            },
            {
                id: uuid(),
                icon: (fill: boolean) => <DuplicateIcon fill={fill} />,
                name: t("profiles.more_items.duplicate"),
                callBack: () => {
                    dispatch(
                        createFolderAsync({
                            deviceInfo,
                            hash,
                            token,
                            name: folder?.name + "(" + Math.random().toFixed(5).split(".")[1] + ")",
                            icon,
                            profileIds: list.map((item) => item._id),
                            teamInfo,
                            isDuplicate: true,
                        })
                    );
                },
            },
            {
                id: uuid(),
                icon: (fill: boolean) => <ExportProfilesIcon fill={fill} />,
                name: t("profiles.more_items.export_profiles"),
                callBack: () =>
                    dispatch(setHelperModalTypeRedux({ type: helperModalTypes.exportFolder, configs: { folderId: id, type, profilesList: list } })),
                disabled: !list.length,
            },
            {
                id: uuid(),
                icon: (fill: boolean) => <ImportProfilesIcon fill={fill} />,
                name: t("profiles.more_items.import_profiles"),
                callBack: () => {
                    if (importProfilesRef.current) {
                        importProfilesRef.current.click();
                    }
                },
                disabled: folder.name === "Favorite",
            },
            {
                id: uuid(),
                icon: (fill: boolean) => <ShareIcon fill={fill} />,
                name: t("profiles.more_items.share"),
                callBack: () => {
                    dispatch(
                        setHelperModalTypeRedux({
                            type: helperModalTypes.shareFolder,
                            configs: { folderName: folder?.name, folderIcon: folder?.icon, id: folder?._id },
                        })
                    );
                },
            },
            {
                id: uuid(),
                icon: (fill: boolean) => <DeleteIcon fill={fill} />,
                name: t("profiles.more_items.delete"),
                callBack: () => {
                    dispatch(setHelperModalTypeRedux({ type: helperModalTypes.deleteFolder, configs: { id } }));
                },
                disabled: type === allProfilesType || type === favoriteProfilesType,
            },
        ],
        [t, list, teamInfo]
    );

    const folderPageProfileMoreItems = useMemo(
        () => [
            {
                id: uuid(),
                icon: (fill: boolean) => <EditIcon fill={fill} />,
                name: t("profiles.more_items.edit"),
                callBack: ({ itemId }: FolderPageMoreItemsMenuItemsTypes) =>
                    navigate(
                        paths.profiles +
                            "/" +
                            paths.editProfile +
                            "/" +
                            id +
                            "~" +
                            itemId +
                            `${teamInfo.teamId && `**teamId=${teamInfo.teamId}*teamName=${teamInfo.teamName}`}`
                    ),
            },
            {
                id: uuid(),
                icon: (fill: boolean) => <ExportProfilesIcon fill={fill} />,
                name: t("profiles.more_items.export"),
                callBack: ({ itemId }: FolderPageMoreItemsMenuItemsTypes) => {
                    dispatch(exportProfileOrCookiesAsync({ deviceInfo, token, hash, teamInfo, profileId: itemId + "", exportType: "profile" }));
                },
            },
            {
                id: uuid(),
                icon: (fill: boolean) => <DuplicateIcon fill={fill} />,
                name: t("profiles.more_items.duplicate"),
                callBack: ({ itemId }: FolderPageMoreItemsMenuItemsTypes) => {
                    let fId = "";
                    let type: string = customFolderProfilesType;
                    if (id !== foldersList.allProfilesFolder._id && id !== teamsFolders[teamInfo.teamName]?.allProfilesList?._id) {
                        fId = id;
                    }
                    id === foldersList.allProfilesFolder._id && (type = allProfilesType);
                    id === foldersList.favoriteProfilesFolder._id && (type = favoriteProfilesType);
                    dispatch(duplicateProfileAsync({ deviceInfo, token, hash, teamInfo, folderId: fId, profileId: itemId + "", type, id }));
                },
            },
            {
                id: uuid(),
                icon: (fill: boolean) => <DeleteIcon fill={fill} />,
                name: t("profiles.more_items.delete"),
                callBack: ({ itemId }: FolderPageMoreItemsMenuItemsTypes) =>
                    dispatch(deleteProfileAsync({ deviceInfo, token, hash, id: itemId + "", teamInfo })),
            },
            {
                id: uuid(),
                icon: (fill: boolean) => <ExportCookieIcon fill={fill} />,
                name: t("profiles.more_items.export_cookie"),
                callBack: ({ itemId }: FolderPageMoreItemsMenuItemsTypes) => {
                    dispatch(exportProfileOrCookiesAsync({ deviceInfo, token, hash, teamInfo, profileId: itemId + "", exportType: "cookies" }));
                },
            },
            {
                id: uuid(),
                icon: (fill: boolean) => <MoveToFolderIcon fill={fill} />,
                name: t("profiles.more_items.add_to_folder"),
                callBack: () => {},
            },
            {
                id: uuid(),
                icon: (fill: boolean) => <MoveToFolderIcon fill={fill} />,
                name: t("profiles.more_items.move_to_folder"),
                callBack: () => {},
                disabled: type === allProfilesType,
            },
        ],
        [t, teamInfo]
    );

    const isAllOrFavoritePage = id === foldersList.allProfilesFolder._id || id === foldersList.favoriteProfilesFolder._id;

    const [folderPageData, setFolderPageData] = useState(folderPageInitialState);
    const [newFolderName, setNewFolderName] = useState(folder?.name);

    const filteredList = folderPageData.searchProfile.length
        ? list.filter(
              ({
                  info: {
                      browser,
                      comment,
                      proxy: { hostAndPort },
                      name,
                      platform,
                  },
              }) =>
                  [browser, comment, hostAndPort, name, platform].some((item) =>
                      item.toLowerCase().includes(folderPageData.searchProfile.toLowerCase())
                  )
          )
        : list;

    const changeDataValues = (type: string, value: boolean | string) => {
        setFolderPageData({ ...folderPageData, [type]: value });
    };

    const changeFolderIcon = (icon: string) => {
        dispatch(changeFolderIconAsync({ token, deviceInfo, hash, id, icon, teamInfo }));
        changeDataValues("isSelectIconOpen", false);
    };

    const changeFolderName = () => {
        !newFolderName && setNewFolderName(folder?.name);
        newFolderName &&
            newFolderName !== folder?.name &&
            dispatch(changeFolderNameAsync({ token, deviceInfo, hash, id, name: newFolderName, teamInfo }));
        changeDataValues("changingName", false);
    };

    const runProfile = (id: string) => {
        dispatch(getProfileAsync({ token, deviceInfo, hash, id, type, teamInfo }));
    };
    const closeProfile = (profileId: string) => {
        const id = startedProfiles.find((item) => item[0] === profileId)?.[1]; // Profile id for electron
        ///@ts-ignore
        window.api.profile.close(id);
    };

    const openShareProfileModal = (id: string, profileName: string) =>
        dispatch(setHelperModalTypeRedux({ type: helperModalTypes.shareProfile, configs: { id, profileName } }));

    const readProfileFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        let file = e.target?.files?.[0];
        // if (e.target.files) {
        //     for (const key in e.target.files) {
        //         if (e.target.files.hasOwnProperty(key)) {
        //             console.log(e.target.files[key]);
        //         }
        //     }
        // }

        if (!file) return;

        let reader = new FileReader();
        reader.onload = function (e) {
            let contents = e.target?.result;
            try {
                let json = JSON.parse(contents + "");
                dispatch(
                    setHelperModalTypeRedux({
                        type: helperModalTypes.importProfiles,
                        configs: { folderId: id, profilesList: json, folderIcon: folder?.icon },
                    })
                );
            } catch (e) {}
        };
        reader.readAsText(file);
        if (importProfilesRef.current) {
            importProfilesRef.current.value = "";
        }
    };

    useEffect(() => {
        changeFolderNameError && setNewFolderName(folder?.name);
        return () => {
            dispatch(resetChangeFolderNameError());
        };
    }, [changeFolderNameError]);

    useEffect(() => {
        dispatch(getProfilesAsync({ deviceInfo, token, hash, id, type, teamInfo }));
        return () => {
            type === customFolderProfilesType && dispatch(resetFoldersProfilesList());
            dispatch(resetTeamsProfilesList());
        };
    }, [foldersList]);

    return (
        <div className={styles.folder_page_wrapper}>
            <div className={styles.folder_page_header}>
                <div className={`${styles.folder_icon_div} ${folder?.icon}`} onClick={() => changeDataValues("isSelectIconOpen", true)}>
                    {folderPageData.isSelectIconOpen && !isAllOrFavoritePage && (
                        <div
                            className={styles.all_icon_wrapper}
                            onClick={(e) => {
                                e.stopPropagation();
                                changeDataValues("isSelectIconOpen", false);
                            }}
                        >
                            <div className={styles.create_folder_all_icons}>
                                {profilesIconsNames.map((item) => (
                                    <div className={item} key={item} onClick={() => changeFolderIcon(item)}></div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.folder_page_header_wrapper}>
                    <BackToSomePage path={paths.profiles} page={t("mainAside.profiles")} color="#808080" />
                    <div className={styles.folder_page_inp_btn_text}>
                        <div className={styles.folder_page_profiles}>
                            <div className={styles.folder_page_about_profiles}>
                                {folderPageData.changingName && !isAllOrFavoritePage ? (
                                    <input
                                        type="text"
                                        autoFocus
                                        className={styles.change_name_input}
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        onBlur={changeFolderName}
                                    />
                                ) : (
                                    <h2 onClick={() => changeDataValues("changingName", true)}>{folder?.name}</h2>
                                )}
                                <span className={styles.point_icon}> • </span>
                                <p>
                                    {list.length} {t("mainAside.profiles")}
                                </p>
                            </div>
                            <div className={styles.folder_page_btns}>
                                <Link
                                    to={
                                        paths.createNewProfile +
                                        "/" +
                                        folder?._id +
                                        (teamInfo.teamId && `**teamId=${teamInfo.teamId}*teamName=${teamInfo.teamName}`)
                                    }
                                    className={styles.create_profile_btn}
                                >
                                    <ControlPointOutlinedIcon /> <span>{t("profiles.create_profile")}</span>
                                </Link>
                                <div className={styles.folder_page_settings}>
                                    <MoreHorizIcon />
                                    <HelperMoreItems menuItems={folderPageMoreItems} />
                                    <input type="file" accept=".txt" ref={importProfilesRef} onChange={readProfileFile} style={{ display: "none" }} />
                                </div>
                            </div>
                        </div>
                        <div className={styles.search_profiles_wrapper}>
                            <SearchOutlinedIcon className={styles.search_icon} />
                            <input
                                type="search"
                                placeholder={t("profiles.search_profiles") + ""}
                                value={folderPageData.searchProfile}
                                onChange={(e) => changeDataValues("searchProfile", e.target.value)}
                                className={styles.search_profiles_input}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.folder_page_profiles_wrapper}>
                <div className={styles.folder_page_profiles_items_wrapper}>
                    {filteredList.map((item) => (
                        <div key={item._id} className={styles.folder_page_profiles_item}>
                            <div className={styles.f_p_run_btn} onClick={() => (item.execute ? closeProfile(item._id) : runProfile(item._id))}>
                                {item.execute ? <StopIcon /> : <PlayIcon />}
                            </div>
                            <div className={styles.f_p_name_browser_platform}>
                                <p className={styles.f_p_info_header}>{item.info.name}</p>
                                <p className={styles.f_p_info_text}>
                                    {item.info.platform} <span className={styles.point_icon}> • </span> {item.info.browser}
                                </p>
                            </div>
                            <div className={styles.f_p_proxy}>
                                <p className={styles.f_p_info_header}>{t("mainAside.proxy")}</p>
                                <p className={styles.f_p_info_text}>{item.info.proxy.hostAndPort || t("profiles.folder_page.no_proxy")}</p>
                            </div>
                            <div className={styles.f_p_comment}>
                                <p className={styles.f_p_info_header}>{t("profiles.all_profiles_comment")}</p>
                                <p className={styles.f_p_info_text}>{item.info.comment || t("profiles.folder_page.no_comment")} </p>
                            </div>
                            <div className={styles.f_p_run_status_btns}>
                                <div className={`${styles.f_p_offline} ${item.execute && styles.f_p_running}`}>
                                    <span className={styles.point_icon}> • </span>
                                    <span>{item.execute ? t("profiles.folder_page.running") : t("profiles.folder_page.offline")}</span>
                                </div>
                                <div className={styles.f_p_settings}>
                                    <SettingsIcon />
                                    <HelperMoreItems menuItems={folderPageProfileMoreItems} profileId={item._id} fromFolderId={id} />
                                </div>
                                <div className={styles.f_p_share_profile} onClick={() => openShareProfileModal(item._id, item.info.name)}>
                                    <ShareIcon fill={false} />
                                </div>
                            </div>
                        </div>
                    ))}
                    {!filteredList.length && (
                        <h2 className={styles.not_profile_info}>
                            {folderPageData.searchProfile.length ? t("search.nothing_found") : t("profiles.folder_page.du_not_profiles")}
                        </h2>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FolderPage;
