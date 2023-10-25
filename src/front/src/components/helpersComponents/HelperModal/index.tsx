import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { constants } from "../../../assets/constants";
import { helpers } from "../../../assets/helpers";
import cone_icon_helper_modal from "../../../assets/images/helperModal/cone_icon_helper_modal.png";
import pink_icon_helper_modal from "../../../assets/images/helperModal/pink_icon_helper_modal.png";
import red_icon_helper_modal from "../../../assets/images/helperModal/red_icon_helper_modal.png";
import { useAppDispatch, useAppSelector } from "../../../store";
import { deleteManageTeamItemAsync, leaveFromTeamAsync } from "../../../store/features/accountSlice";
import {
    changeModalConfigsRedux,
    resetHelperModalConfigsRedux,
    resetHelperModalTypeRedux,
    setHelperModalMethodForBuySubRedux,
} from "../../../store/features/helperModalSlice";
import { exportProfilesAsync } from "../../../store/features/mainSlice";
import { createProfileAsync } from "../../../store/features/newProfileSlice";
import { showNotifyRedux } from "../../../store/features/notifySlice";
import { deleteFolderAsync, getProfilesAsync, shareFolderAsync, shareProfileAsync } from "../../../store/features/profilesSlice";
import { deleteAccountAsync, removeOtherSessionAsync, resetPasswordForDeleteError } from "../../../store/features/settingsSlice";
import { HelperModalInitialStateTypes } from "../../../types";
import HelperSelect from "../HelperSelect";
import styles from "./helper_modal.module.scss";

const helperModalInitialState: HelperModalInitialStateTypes = {
    password: "",
    showPassword: false,
    emailOrNickname: "",
    exportProfileIds: [],
    isProfileLimitExceeded: false,
};

const HelperModal = () => {
    const { t } = useTranslation();
    const {
        helperModalTypes,
        merge,
        convert,
        create_new_team,
        paths,
        notifyTypes: { error },
    } = constants;
    const dispatch = useAppDispatch();
    const {
        helperModal: { type, methodForBuySub, configs },
        profiles: { foldersList, teamsFolders },
        account: {
            token,
            hash,
            teams,
            user: { name, email },
        },
        main: { deviceInfo, localProfiles },
        settings: { isPasswordForDeleteAccountIncorrect },
    } = useAppSelector((state) => state);
    const { teamInfo } = helpers.convertTeamInfo(useLocation().pathname);

    const navigate = useNavigate();

    const chooseMethodMenuItems = useMemo(
        () => [
            { id: uuid(), value: convert, text: t("account.buy_subscription.convert") },
            { id: uuid(), value: merge, text: t("account.buy_subscription.merge") },
        ],
        [t]
    );

    const chooseMethodMenuItemsForTeam = useMemo(() => {
        const items = teams.map((team) => ({
            id: team._id,
            value: team.name,
            text: team.name,
        }));
        items.unshift({
            id: create_new_team,
            value: create_new_team,
            text: create_new_team,
        });
        return items;
    }, [teams]);

    const [helperModalData, setHelperModalData] = useState(helperModalInitialState);
    const [chooseMethod, setChooseMethod] = useState<string>(methodForBuySub);
    const isWroteTextValid = helperModalData.password.length > 2 || helperModalData.emailOrNickname.length > 2;

    const [searchProfile, setSearchProfile] = useState<string>("");

    const filteredList = searchProfile
        ? configs?.profilesList?.filter(({ info: { name, platform, browser, comment } }) =>
              [name, platform, browser, comment].some((item) => item.toLowerCase().includes(searchProfile.toLowerCase()))
          )
        : configs?.profilesList;

    const changeDataValues = (type: string, value: string | boolean) => {
        setHelperModalData({ ...helperModalData, [type]: value });
    };

    const changeChooseMethod = (type: string, value: string) => setChooseMethod(value);
    const changeChooseTeamId = (type: string, value: string) => {
        const teamId = chooseMethodMenuItemsForTeam.find((el) => el.value === value)?.id || create_new_team;
        dispatch(
            changeModalConfigsRedux({
                type: "renewTeamId",
                value: teamId,
            })
        );
    };
    const handleModalClickForClose = (e: React.MouseEvent<HTMLElement>, isImportProfile?: boolean, isChooseMethod?: boolean) => {
        const targetId = (e.target as HTMLElement)?.id;
        if (targetId === "close_") {
            dispatch(resetHelperModalTypeRedux());
            setHelperModalData(helperModalInitialState);
            if (isImportProfile) {
                const canceledImportAccounts: string | null = localStorage.getItem("canceledImportAccounts");
                if (canceledImportAccounts && !canceledImportAccounts.includes(email)) {
                    const accounts: string[] = JSON.parse(canceledImportAccounts);
                    localStorage.setItem("canceledImportAccounts", JSON.stringify([...accounts, email]));
                } else {
                    localStorage.setItem("canceledImportAccounts", JSON.stringify([email]));
                }
            }
            isChooseMethod && dispatch(resetHelperModalConfigsRedux());
        }
    };

    const handleCloseModal = () => {
        dispatch(resetHelperModalTypeRedux());
        dispatch(resetHelperModalConfigsRedux());
        setHelperModalData(helperModalInitialState);
    };
    const removeAllSession = () => {
        dispatch(removeOtherSessionAsync({ token, hash, deviceInfo }));
    };
    const deleteMyAccount = () => {
        dispatch(resetPasswordForDeleteError());
        dispatch(deleteAccountAsync({ deviceInfo, token, hash, password: helperModalData.password }));
    };
    const handleConvertOrBuySub = () => {
        dispatch(setHelperModalMethodForBuySubRedux(chooseMethod));
    };
    const handleLeaveTeam = () => {
        dispatch(leaveFromTeamAsync({ token, hash, deviceInfo, teamId: configs?.id + "" }));
    };
    const handleDeleteTeamItem = () => {
        dispatch(deleteManageTeamItemAsync({ token, hash, deviceInfo, teamId: configs?.teamId + "", userId: configs?.userId || "" }));
    };
    const navigateToProfiles = () => {
        navigate(paths.profiles);
    };
    const handleDeleteFolder = () => {
        dispatch(deleteFolderAsync({ token, hash, deviceInfo, id: configs?.id + "", navigateFn: navigateToProfiles, teamInfo }));
    };
    const handleShareFolder = () => {
        if (helperModalData.emailOrNickname === name) {
            dispatch(showNotifyRedux({ type: error, title: t("sundry.forbidden") }));
        } else {
            dispatch(shareFolderAsync({ deviceInfo, token, hash, id: configs?.id + "", userName: helperModalData.emailOrNickname, teamInfo }));
        }
    };
    const handleShareProfile = () => {
        if (helperModalData.emailOrNickname === name) {
            dispatch(showNotifyRedux({ type: error, title: t("sundry.forbidden") }));
        } else {
            dispatch(shareProfileAsync({ deviceInfo, token, hash, id: configs?.id + "", userName: helperModalData.emailOrNickname, teamInfo }));
        }
    };

    const handleAddLocalProfiles = () => {
        const convertedLocalProfilesData = helpers.convertProfilesAsNeeded({ localProfiles });
        convertedLocalProfilesData.forEach((item, index) => {
            dispatch(
                createProfileAsync({
                    deviceInfo,
                    hash,
                    token,
                    newProfile: item,
                    selectedFolderIcon: "icon_square",
                    teamInfo,
                    isConvert: convertedLocalProfilesData.length - 1,
                })
            );
            if (index === convertedLocalProfilesData.length - 1) {
                dispatch(resetHelperModalTypeRedux());
                const isStoredItem = localStorage.getItem("userNamesConvertedLocalProfiles");
                if (isStoredItem) {
                    const allUsers = JSON.parse(isStoredItem);
                    !allUsers.includes(email) && allUsers.push(email);
                    localStorage.setItem("userNamesConvertedLocalProfiles", JSON.stringify(allUsers));
                } else {
                    localStorage.setItem("userNamesConvertedLocalProfiles", JSON.stringify([email]));
                }
            }
        });
        ///@ts-ignore
        // window.api.profile.delete_all();
    };

    const cancelImportLocalProfile = () => {
        const canceledImportAccounts: string | null = localStorage.getItem("canceledImportAccounts");
        if (canceledImportAccounts && !canceledImportAccounts.includes(email)) {
            const accounts: string[] = JSON.parse(canceledImportAccounts);
            localStorage.setItem("canceledImportAccounts", JSON.stringify([...accounts, email]));
        } else {
            localStorage.setItem("canceledImportAccounts", JSON.stringify([email]));
        }
        handleCloseModal();
    };

    const chooseProfileToFolder = (id: string) => {
        let newState = _.cloneDeep(helperModalData);
        if (newState.exportProfileIds.includes(id)) {
            newState = {
                ...newState,
                exportProfileIds: newState.exportProfileIds.filter((item) => item !== id),
            };
        } else if (helperModalData.exportProfileIds.length < 10) {
            newState.exportProfileIds.push(id);
        }
        setHelperModalData(newState);
        if (helperModalData.exportProfileIds.length === 10) {
            setHelperModalData({ ...helperModalData, isProfileLimitExceeded: true });
            setTimeout(() => setHelperModalData({ ...helperModalData, isProfileLimitExceeded: false }), 500);
        }
    };

    const changeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => setSearchProfile(e.target.value);

    const handleExportProfiles = () =>
        dispatch(exportProfilesAsync({ deviceInfo, token, hash, teamInfo, profileIds: helperModalData.exportProfileIds }));

    const handleImportProfiles = () => {
        if (configs?.profilesList) {
            const chooseImportedProfiles = configs.profilesList.filter((item) => helperModalData.exportProfileIds.some((el) => item._id === el));
            const convertedProfiles = chooseImportedProfiles && helpers.convertProfilesAsNeeded({ importedNewProfiles: chooseImportedProfiles });
            convertedProfiles.forEach((item, index) => {
                if (teamInfo.teamName) {
                    item.folderId = configs.folderId === teamsFolders[teamInfo.teamName]?.allProfilesList?._id ? "" : configs.folderId + "";
                } else {
                    item.folderId =
                        configs?.folderId === foldersList.allProfilesFolder._id || configs?.folderId === foldersList.favoriteProfilesFolder._id
                            ? ""
                            : configs?.folderId + "";
                }
                dispatch(
                    createProfileAsync({
                        deviceInfo,
                        hash,
                        token,
                        newProfile: item,
                        selectedFolderIcon: configs?.folderIcon + "",
                        teamInfo,
                        isConvert: convertedProfiles.length - 1,
                        isImported: convertedProfiles.length - 1 === index,
                        folderId: configs.folderId,
                    })
                );
                index === convertedProfiles.length - 1 && dispatch(resetHelperModalTypeRedux());
            });
        }
    };

    useEffect(() => {
        setChooseMethod(methodForBuySub);
    }, [methodForBuySub]);

    useEffect(() => {
        setHelperModalData(helperModalInitialState);
        setChooseMethod("");
    }, [type]);

    switch (type) {
        case helperModalTypes.endAllSessions:
            return (
                <div className={styles.helper_modal_wrapper} onClick={handleModalClickForClose} id="close_">
                    <div className={styles.helper_modal_main_wrapper}>
                        <div className={styles.helper_modal_close_btn} onClick={handleCloseModal}>
                            <CloseIcon />
                        </div>
                        <div className={styles.helper_modal_icon_text}>
                            <img src={cone_icon_helper_modal} alt="Logo" />
                            <h2>{t("settings.security.end_sessions_modal.end_sessions_modal_header")}</h2>
                            <p>{t("settings.security.end_sessions_modal.end_sessions_modal_text")}</p>
                        </div>
                        <div className={styles.helper_modal_btns}>
                            <button className={styles.helper_modal_confirm_btn} onClick={removeAllSession}>
                                {t("settings.security.end_sessions_modal.end_sessions_accept_btn")}
                            </button>
                            <button className={styles.helper_modal_cancel_btn} onClick={handleCloseModal}>
                                {t("sundry.cancel")}
                            </button>
                        </div>
                    </div>
                </div>
            );
        case helperModalTypes.deleteAccount:
            return (
                <div className={styles.helper_modal_wrapper} onClick={handleModalClickForClose} id="close_">
                    <div className={styles.helper_modal_main_wrapper}>
                        <div className={styles.helper_modal_close_btn} onClick={handleCloseModal}>
                            <CloseIcon />
                        </div>
                        <div className={styles.helper_modal_icon_text}>
                            <img src={red_icon_helper_modal} alt="Logo" />
                            <h2>{t("settings.security.delete_account_modal.delete_your_account_header")}</h2>
                            <p>{t("settings.security.delete_account_modal.delete_your_account_text")}</p>
                        </div>
                        <div className={styles.helper_modal_btns}>
                            <div className={styles.helper_modal_input_place}>
                                <input
                                    type={helperModalData.showPassword ? "text" : "password"}
                                    placeholder={t("resetPassword.enter_your_password") + ""}
                                    className={`${styles.helper_modal_input} ${isPasswordForDeleteAccountIncorrect && styles.active}`}
                                    value={helperModalData.password}
                                    onChange={(e) => changeDataValues("password", e.target.value)}
                                />
                                <div className={styles.show_password_wrapper}>
                                    {helperModalData.showPassword ? (
                                        <VisibilityOffOutlinedIcon onClick={() => changeDataValues("showPassword", !helperModalData.showPassword)} />
                                    ) : (
                                        <VisibilityOutlinedIcon onClick={() => changeDataValues("showPassword", !helperModalData.showPassword)} />
                                    )}
                                </div>
                            </div>
                            <button
                                className={`${styles.helper_modal_delete_btn} ${isWroteTextValid && styles.active}`}
                                onClick={deleteMyAccount}
                                disabled={!isWroteTextValid}
                            >
                                {t("settings.security.delete_account_modal.delete_your_account_btn")}
                            </button>
                        </div>
                    </div>
                </div>
            );
        case helperModalTypes.chooseSubPlanMethod:
            return (
                <div className={styles.helper_modal_wrapper} onClick={(e) => handleModalClickForClose(e, false, true)} id="close_">
                    <div className={`${styles.helper_modal_main_wrapper} ${styles.choose_method}`}>
                        <div className={styles.helper_modal_close_btn} onClick={handleCloseModal}>
                            <CloseIcon />
                        </div>
                        <div className={styles.helper_modal_icon_text}>
                            <img src={cone_icon_helper_modal} alt="Logo" />
                            <h2>{t("account.buy_subscription.choose_method")}</h2>
                            <p>{t("account.buy_subscription.choose_method_text")}</p>
                        </div>
                        <div className={styles.helper_modal_btns}>
                            <div className={styles.helper_modal_select_place}>
                                <HelperSelect
                                    menuItems={configs?.renewTeamId ? chooseMethodMenuItemsForTeam : chooseMethodMenuItems}
                                    selectValue={
                                        configs?.renewTeamId
                                            ? chooseMethodMenuItemsForTeam.find((el) => el.id === configs?.renewTeamId)?.value
                                            : chooseMethod
                                    }
                                    type="chooseMethod"
                                    onChange={!configs?.renewTeamId ? changeChooseMethod : changeChooseTeamId}
                                    customStyles={{ width: "256px", background: "#F5F5F5", borderRadius: "10px" }}
                                />
                            </div>
                            <button className={styles.helper_modal_select_btn} onClick={handleConvertOrBuySub}>
                                {t("sundry.next")}
                            </button>
                        </div>
                    </div>
                </div>
            );
        case helperModalTypes.leaveTeam:
            return (
                <div className={styles.helper_modal_wrapper} onClick={handleModalClickForClose} id="close_">
                    <div className={styles.helper_modal_main_wrapper}>
                        <div className={styles.helper_modal_close_btn} onClick={handleCloseModal}>
                            <CloseIcon />
                        </div>
                        <div className={styles.helper_modal_icon_text}>
                            <img src={red_icon_helper_modal} alt="Logo" />
                            <h2>
                                {t("account.teams.leave")} {configs?.teamName}
                            </h2>
                            <p>{t("account.teams.access_leave")}</p>
                        </div>
                        <div className={styles.helper_modal_btns}>
                            <button className={styles.helper_modal_confirm_btn} onClick={handleLeaveTeam}>
                                {t("account.teams.leave_this_team")}
                            </button>
                            <button className={styles.helper_modal_cancel_btn} onClick={handleCloseModal}>
                                {t("sundry.cancel")}
                            </button>
                        </div>
                    </div>
                </div>
            );
        case helperModalTypes.deleteTeamItem:
            return (
                <div className={styles.helper_modal_wrapper} onClick={handleModalClickForClose} id="close_">
                    <div className={styles.helper_modal_main_wrapper}>
                        <div className={styles.helper_modal_close_btn} onClick={handleCloseModal}>
                            <CloseIcon />
                        </div>
                        <div className={styles.helper_modal_icon_text}>
                            <img src={red_icon_helper_modal} alt="Logo" />
                            <h2>
                                {t("sundry.delete")} {configs?.userName} ?
                            </h2>
                            <p>{t("account.teams.access_lose")}</p>
                        </div>
                        <div className={styles.helper_modal_btns}>
                            <button className={styles.helper_modal_confirm_btn} onClick={handleDeleteTeamItem}>
                                {t("sundry.delete")}
                            </button>
                            <button className={styles.helper_modal_cancel_btn} onClick={handleCloseModal}>
                                {t("sundry.cancel")}
                            </button>
                        </div>
                    </div>
                </div>
            );
        case helperModalTypes.deleteFolder:
            return (
                <div className={styles.helper_modal_wrapper} onClick={handleModalClickForClose} id="close_">
                    <div className={styles.helper_modal_main_wrapper}>
                        <div className={styles.helper_modal_close_btn} onClick={handleCloseModal}>
                            <CloseIcon />
                        </div>
                        <div className={styles.helper_modal_icon_text}>
                            <img src={red_icon_helper_modal} alt="Logo" />
                            <h2>{t("profiles.folder_page.delete_folder")}</h2>
                            <p>{t("profiles.folder_page.all_data_lost")}</p>
                        </div>
                        <div className={styles.helper_modal_btns}>
                            <button className={styles.helper_modal_confirm_btn} onClick={handleDeleteFolder}>
                                {t("profiles.folder_page.yes_delete_folder")}
                            </button>
                            <button className={styles.helper_modal_cancel_btn} onClick={handleCloseModal}>
                                {t("sundry.cancel")}
                            </button>
                        </div>
                    </div>
                </div>
            );
        case helperModalTypes.shareFolder:
            return (
                <div className={styles.helper_modal_wrapper} onClick={handleModalClickForClose} id="close_">
                    <div className={styles.helper_modal_main_wrapper}>
                        <div className={styles.helper_modal_close_btn} onClick={handleCloseModal}>
                            <CloseIcon />
                        </div>
                        <div className={styles.helper_modal_icon_text}>
                            <div className={configs?.folderIcon}></div>
                            <h2>{t("profiles.folder_page.share_folder")}</h2>
                            <p>{configs?.folderName}</p>
                        </div>
                        <div className={styles.helper_modal_btns}>
                            <div className={styles.helper_modal_input_place}>
                                <input
                                    type="text"
                                    placeholder={t("profiles.folder_page.who_will_receive_folder") + ""}
                                    className={styles.helper_modal_input}
                                    value={helperModalData.emailOrNickname}
                                    onChange={(e) => changeDataValues("emailOrNickname", e.target.value)}
                                />
                            </div>
                            <button
                                className={`${styles.helper_modal_delete_btn} ${styles.main_color} ${isWroteTextValid && styles.active}`}
                                onClick={handleShareFolder}
                                disabled={!isWroteTextValid}
                            >
                                {t("profiles.folder_page.send_folder")}
                            </button>
                        </div>
                    </div>
                </div>
            );
        case helperModalTypes.shareProfile:
            return (
                <div className={styles.helper_modal_wrapper} onClick={handleModalClickForClose} id="close_">
                    <div className={styles.helper_modal_main_wrapper}>
                        <div className={styles.helper_modal_close_btn} onClick={handleCloseModal}>
                            <CloseIcon />
                        </div>
                        <div className={styles.helper_modal_icon_text}>
                            <img src={pink_icon_helper_modal} alt="Logo" />
                            <h2>{t("profiles.folder_page.share_profile")}</h2>
                            <p>{configs?.profileName}</p>
                        </div>
                        <div className={styles.helper_modal_btns}>
                            <div className={styles.helper_modal_input_place}>
                                <input
                                    type="text"
                                    placeholder={t("profiles.folder_page.who_will_receive_profile") + ""}
                                    className={styles.helper_modal_input}
                                    value={helperModalData.emailOrNickname}
                                    onChange={(e) => changeDataValues("emailOrNickname", e.target.value)}
                                />
                            </div>
                            <button
                                className={`${styles.helper_modal_delete_btn} ${styles.main_color} ${isWroteTextValid && styles.active}`}
                                onClick={handleShareProfile}
                                disabled={!isWroteTextValid}
                            >
                                {t("profiles.folder_page.send_profile")}
                            </button>
                        </div>
                    </div>
                </div>
            );
        case helperModalTypes.foundLocalProfiles:
            return (
                <div className={styles.helper_modal_wrapper} onClick={(e) => handleModalClickForClose(e, true)} id="close_">
                    <div className={styles.helper_modal_main_wrapper}>
                        <div className={styles.helper_modal_close_btn} onClick={cancelImportLocalProfile}>
                            <CloseIcon />
                        </div>
                        <div className={styles.helper_modal_icon_text}>
                            <img src={cone_icon_helper_modal} alt="Logo" />
                            <h2>{t("helper_modal.import_local_profiles")}</h2>
                            <p>{t("helper_modal.you_have_local_profiles")}</p>
                        </div>
                        <div className={styles.helper_modal_btns}>
                            <button className={styles.helper_modal_confirm_btn} onClick={handleAddLocalProfiles}>
                                {t("helper_modal.add_local_profiles")}
                            </button>
                            <button className={styles.helper_modal_cancel_btn} onClick={cancelImportLocalProfile}>
                                {t("sundry.cancel")}
                            </button>
                        </div>
                    </div>
                </div>
            );
        case helperModalTypes.exportFolder:
            return (
                <div className={styles.helper_modal_wrapper} onClick={(e) => handleModalClickForClose(e, true)} id="close_">
                    <div className={styles.helper_modal_main_import_export_folder}>
                        <div className={styles.helper_modal_close_btn} onClick={handleCloseModal}>
                            <CloseIcon />
                        </div>
                        <div className={styles.export_folder_header_btn}>
                            <div className={styles.export_folder_header}>
                                <h2>{t("helper_modal.export_folder_header")}</h2>
                                <p className={`${helperModalData.isProfileLimitExceeded && styles.limit_exceeded}`}>
                                    {t("helper_modal.export_folder_choose_profiles")} {helperModalData.exportProfileIds.length} /{" "}
                                    {configs?.profilesList?.length && configs.profilesList.length <= 10 ? configs.profilesList.length : 10}
                                </p>
                            </div>
                            <button
                                className={styles.export_folder_btn}
                                disabled={!helperModalData.exportProfileIds.length}
                                onClick={handleExportProfiles}
                            >
                                {t("profiles.more_items.export_profiles")}
                            </button>
                        </div>
                        {!!configs?.profilesList?.length && (
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
                            {!!configs?.profilesList?.length && (
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
                                {filteredList?.length ? (
                                    filteredList?.map((item, index) => (
                                        <div className={styles.all_profiles_item} key={item._id}>
                                            <div
                                                className={styles.all_profiles_number}
                                                data-type={helperModalData.exportProfileIds.includes(item._id) && "choose"}
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
                                                {!helperModalData.exportProfileIds?.includes(item._id) ? <AddIcon /> : <DoneIcon />}
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
        case helperModalTypes.importProfiles:
            return (
                <div className={styles.helper_modal_wrapper} onClick={(e) => handleModalClickForClose(e, true)} id="close_">
                    <div className={styles.helper_modal_main_import_export_folder}>
                        <div className={styles.helper_modal_close_btn} onClick={handleCloseModal}>
                            <CloseIcon />
                        </div>
                        <div className={styles.export_folder_header_btn}>
                            <div className={styles.export_folder_header}>
                                <h2>{t("helper_modal.import_profiles_header")}</h2>
                                <p className={`${helperModalData.isProfileLimitExceeded && styles.limit_exceeded}`}>
                                    {t("helper_modal.you_can_import")} {helperModalData.exportProfileIds.length} /{" "}
                                    {configs?.profilesList?.length && configs.profilesList.length <= 10 ? configs.profilesList.length : 10}{" "}
                                    {t("sundry.profiles")}
                                </p>
                            </div>
                            <button
                                className={styles.export_folder_btn}
                                disabled={!helperModalData.exportProfileIds.length}
                                onClick={handleImportProfiles}
                            >
                                {t("profiles.more_items.import_profiles")}
                            </button>
                        </div>
                        {!!configs?.profilesList?.length && (
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
                            {!!configs?.profilesList?.length && (
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
                                {filteredList?.length ? (
                                    filteredList?.map((item, index) => (
                                        <div className={styles.all_profiles_item} key={item._id}>
                                            <div
                                                className={styles.all_profiles_number}
                                                data-type={helperModalData.exportProfileIds.includes(item._id) && "choose"}
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
                                                {!helperModalData.exportProfileIds?.includes(item._id) ? <AddIcon /> : <DoneIcon />}
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
        default:
            return <></>;
    }
};

export default HelperModal;
