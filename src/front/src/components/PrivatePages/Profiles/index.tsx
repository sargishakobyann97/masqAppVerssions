import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { constants } from "../../../assets/constants";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getFoldersAsync, getTeamsFoldersAsync } from "../../../store/features/profilesSlice";
import { showNotifyRedux } from "../../../store/features/notifySlice";
import { helpers } from "../../../assets/helpers";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import LockIcon from "@mui/icons-material/Lock";
import { ProfileSearchListTypes } from "../../../types";
import { v4 as uuid } from "uuid";
import { getLocalProfilesAsync } from "../../../store/features/mainSlice";
import styles from "./profile.module.scss";

function Profiles() {
    const { t } = useTranslation();
    const { teamInfo } = helpers.convertTeamInfo(useLocation().pathname);
    const dispatch = useAppDispatch();
    const {
        main: { deviceInfo },
        account: {
            token,
            hash,
            teams,
            activeSub,
            user: { email },
        },
        profiles: { foldersList, allProfilesList, teamsFolders },
    } = useAppSelector((state) => state);
    const firstRun = useRef<boolean>(true);
    const {
        paths,
        notifyTypes: { error },
    } = constants;

    const [searchFolder, setSearchFolder] = useState<string>("");

    const changeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => setSearchFolder(e.target.value);

    const notSubHandleClick = (e: React.MouseEvent<HTMLDivElement> | undefined) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        dispatch(showNotifyRedux({ type: error, title: t("sundry.sub_plan_not_active") }));
        // navigate(paths.account + "/" + paths.buySubscriptionPlan);
    };

    let searchList: ProfileSearchListTypes[] = [];
    try {
        searchList = [
            {
                id: uuid(),
                name: foldersList.allProfilesFolder.name,
                road: "Your Folder",
                path: paths.profiles + "/" + foldersList.allProfilesFolder._id,
            },
            {
                id: uuid(),
                name: foldersList.favoriteProfilesFolder.name,
                road: "Your Folder",
                path: paths.profiles + "/" + foldersList.favoriteProfilesFolder._id,
            },
            ...foldersList.folders.map((f) => ({
                id: uuid(),
                name: f.name,
                road: "Your Folder",
                path: paths.profiles + "/" + f._id,
            })),
            ...teams.reduce((acum: ProfileSearchListTypes[], val) => {
                const item = teamsFolders[val.name];
                acum.push({
                    id: uuid(),
                    name: item?.allProfilesList.name,
                    road: "From " + val.name,
                    path: paths.profiles + "/" + item?.allProfilesList._id + `**teamId=${val._id}*teamName=${val.name}`,
                });
                acum.push({
                    id: uuid(),
                    name: item?.favoriteProfilesList.name,
                    road: "From " + val.name,
                    path: paths.profiles + "/" + item?.favoriteProfilesList._id + `**teamId=${val._id}*teamName=${val.name}`,
                });
                item?.customFoldersProfilesList.forEach((el) => {
                    acum.push({
                        id: uuid(),
                        name: el.name,
                        road: "From " + val.name,
                        path: paths.profiles + "/" + el._id + `**teamId=${val._id}*teamName=${val.name}`,
                    });
                });
                return acum;
            }, []),
        ];
    } catch (e) {}

    const filteredFolders = searchList?.filter(({ name }) => name?.toLowerCase().includes(searchFolder.toLowerCase()));

    useEffect(() => {
        activeSub.activated &&
            !localStorage.getItem("userNamesConvertedLocalProfiles")?.includes(email) &&
            !localStorage.getItem("canceledImportAccounts")?.includes(email) &&
            dispatch(getLocalProfilesAsync({ clickedFromSettings: false }));
    }, [activeSub.activated]);

    useEffect(() => {
        !foldersList.allProfilesFolder._id && dispatch(getFoldersAsync({ token, deviceInfo, hash, teamInfo }));
    }, [foldersList.allProfilesFolder._id]);

    useEffect(() => {
        if (!Object.keys(teamsFolders).length) {
            dispatch(getTeamsFoldersAsync({ deviceInfo, token, hash, teams }));
        }
        return () => {
            setSearchFolder("");
        };
    }, []);

    return (
        <div className={styles.profiles_wrapper}>
            <div className={styles.profiles_header_input}>
                <h2>{t("sundry.profiles")}</h2>
                <div className={styles.profiles_search_wrapper}>
                    <SearchOutlinedIcon className={styles.profiles_search_icon} />
                    <input
                        type="search"
                        className={styles.profiles_search}
                        value={searchFolder}
                        onChange={changeSearchValue}
                        placeholder={t("profiles.profiles_search_placeholder") + ""}
                    />
                    {searchFolder.length > 0 && (
                        <div className={styles.found_folder_wrapper}>
                            {filteredFolders.length ? (
                                filteredFolders.map(({ id, name, path, road }) => (
                                    <Link to={path} key={id} className={styles.found_folder}>
                                        <p>{name}</p>
                                        <span>{road}</span>
                                    </Link>
                                ))
                            ) : (
                                <span className={styles.not_found_folder}>{t("search.nothing_found")}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Link
                to={paths.createNewProfile + "/" + foldersList.allProfilesFolder._id}
                className={styles.create_profile_btn}
                onClick={(e) => {
                    if (!activeSub.activated) {
                        e.stopPropagation();
                        e.preventDefault();
                        notSubHandleClick(undefined);
                    }
                }}
            >
                <ControlPointOutlinedIcon /> <span>{t("profiles.create_profile")}</span>
            </Link>
            <div className={styles.all_folders_wrapper}>
                <div className={styles.your_profile_wrapper}>
                    <div className={styles.your_profile_text_place}>
                        <h2>{t("profiles.your_profiles_title")}</h2>
                        <p>{t("profiles.your_profiles_text")}</p>
                    </div>
                    <div className={styles.your_profile_folder_place}>
                        <div className={styles.your_profile_folders}>
                            <Link to={paths.profiles + "/" + paths.create_folder} className={styles.folder}>
                                <div className={styles.folder_create_folder}></div>
                                <p>{t("profiles.create_folder")}</p>
                                {!activeSub.activated && <h6 className={styles.sub_not_found} onClick={notSubHandleClick}></h6>}
                            </Link>
                            <Link to={paths.profiles + "/" + foldersList.allProfilesFolder._id} className={styles.folder}>
                                <div className="icon_square"></div>
                                <p>{t("profiles.your_profiles_all_profiles")}</p>
                                {!activeSub.activated && (
                                    <h6 className={styles.sub_not_found} onClick={notSubHandleClick}>
                                        <span>
                                            <LockIcon />
                                        </span>
                                    </h6>
                                )}
                            </Link>
                            <Link to={paths.profiles + "/" + foldersList.favoriteProfilesFolder._id} className={styles.folder}>
                                <div className="icon_star"></div>
                                <p>{t("profiles.your_profiles_favorite")}</p>
                                {!activeSub.activated && (
                                    <h6 className={styles.sub_not_found} onClick={notSubHandleClick}>
                                        <span>
                                            <LockIcon />
                                        </span>
                                    </h6>
                                )}
                            </Link>
                            {foldersList.folders.map((item) => (
                                <Link to={paths.profiles + "/" + item._id} key={item._id} className={styles.folder}>
                                    <div className={item.icon}></div>
                                    <p title={item.name.length > 14 ? item.name : ""}>{item.name}</p>
                                    {!activeSub.activated && (
                                        <h6 className={styles.sub_not_found} onClick={notSubHandleClick}>
                                            <span>
                                                <LockIcon />
                                            </span>
                                        </h6>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                    {teams.map((team) => {
                        return (
                            <div className={styles.teams_folders_wr} key={team._id + "1"}>
                                <h1 title={team.name}>{team.name}</h1>
                                <h2>{t("sundry.teams_folder_sub_title")}</h2>
                                <div className={styles.your_profile_folder_place}>
                                    <div className={styles.your_profile_folders}>
                                        <Link
                                            to={paths.profiles + "/" + paths.create_folder + `/**teamId=${team._id}*teamName=${team.name}`}
                                            className={styles.folder}
                                        >
                                            <div className={styles.folder_create_folder}></div>
                                            <p>{t("profiles.create_folder")}</p>
                                        </Link>
                                        <Link
                                            to={
                                                paths.profiles +
                                                "/" +
                                                ///@ts-ignore
                                                teamsFolders[team.name]?.allProfilesList?._id +
                                                `**teamId=${team._id}*teamName=${team.name}`
                                            }
                                            className={styles.folder}
                                        >
                                            <div className="icon_square"></div>
                                            <p>{t("profiles.your_profiles_all_profiles")}</p>
                                        </Link>
                                        <Link
                                            to={
                                                paths.profiles +
                                                "/" +
                                                ///@ts-ignore
                                                teamsFolders[team.name]?.favoriteProfilesList?._id +
                                                `**teamId=${team._id}*teamName=${team.name}`
                                            }
                                            className={styles.folder}
                                        >
                                            <div className="icon_star"></div>
                                            <p>{t("profiles.your_profiles_favorite")}</p>
                                        </Link>

                                        {
                                            ///@ts-ignore
                                            teamsFolders[team.name]?.customFoldersProfilesList?.map((item) => (
                                                <Link
                                                    to={paths.profiles + "/" + item._id + `**teamId=${team._id}*teamName=${team.name}`}
                                                    key={item._id}
                                                    className={styles.folder}
                                                >
                                                    <div className={item.icon}></div>
                                                    <p title={item.name.length > 14 ? item.name : ""}>{item.name}</p>
                                                </Link>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Profiles;
