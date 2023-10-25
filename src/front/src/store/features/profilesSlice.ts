import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { constants } from "../../assets/constants";
import {
    ChangeFolderIconAsyncTypes,
    ChangeFolderNameAsyncTypes,
    CreateFolderAsyncTypes,
    DeleteFolderAsyncTypes,
    ShareFolderAsyncTypes,
    ShareProfileAsyncTypes,
    GetProfilesAsyncTypes,
    ProfileInitialStateTypes,
    GetTeamsFoldersAsyncTypes,
    DeleteProfileAsyncTypes,
    MoveProfileToFolderAsyncTypes,
    DuplicateProfileAsyncTypes,
    GetFoldersAsyncTypes,
    UpdateProfileAsyncTypes,
    AddProfilesToFolderAsyncTypes,
    GetEditedProfileAsyncTypes,
    TestTeamsObject,
    ProfilesTypes,
    ChangeCookiesAsyncTypes,
} from "../../types";
import { showNotifyRedux } from "./notifySlice";
import { resetHelperModalStateToInitialRedux } from "./helperModalSlice";
import { t } from "i18next";
import _ from "lodash";

const { endpoints, notifyTypes, allProfilesType, favoriteProfilesType, customFolderProfilesType, execute } = constants;

export const getFoldersAsync = createAsyncThunk("profiles/getFoldersAsync", async ({ token, deviceInfo, hash, teamInfo }: GetFoldersAsyncTypes) => {
    const { teamId } = teamInfo;

    const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getFolders + `${teamId && "?team=true"}`, {
        method: "GET",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
            os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
            cpu: deviceInfo.cpu[0].model,
            app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
            hash: hash,
            team: teamId,
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    });
    const data = await response.json();
    if (data.message) throw new Error(data.message);
    return data;
});

export const createFolderAsync = createAsyncThunk(
    "profiles/createFolderAsync",
    async (
        { deviceInfo, hash, token, teamInfo, name, icon, profileIds, navigateProfilesPage, isDuplicate }: CreateFolderAsyncTypes,
        { dispatch }
    ) => {
        const { teamId, teamName } = teamInfo;

        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.createFolder + `${teamId && "?team=true"}`, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                name,
                icon,
                profileIds,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        !isDuplicate && navigateProfilesPage && navigateProfilesPage();
        isDuplicate &&
            dispatch(
                showNotifyRedux({
                    type: notifyTypes.success,
                    duration: 3000,
                    title: name.split("(")[0] + " " + t("profiles.folder_page.has_duplicated"),
                    subTitle: name + " " + t("profiles.folder_page.find_in_the_folder"),
                })
            );
        return { data, teamName };
    }
);

export const getProfilesAsync = createAsyncThunk(
    "profiles/getProfilesAsync",
    async ({ deviceInfo, token, hash, id, type, teamInfo }: GetProfilesAsyncTypes) => {
        const { teamId, teamName } = teamInfo;

        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getProfiles + id + `${teamId && "?team=true"}`, {
            method: "GET",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });
        const data = await response.json();

        if (data.message) throw new Error(data.message);
        const finalData: {
            type: string | undefined;
            data: ProfilesTypes[];
            teamName: string;
        } = { type, data, teamName };
        return finalData;
    }
);

export const getTeamsFoldersAsync = createAsyncThunk(
    "profiles/getTeamsFoldersAsync",
    async ({ deviceInfo, token, hash, teams }: GetTeamsFoldersAsyncTypes) => {
        const response = await Promise.all(
            teams.map((team) => {
                return fetch(process.env.REACT_APP_API_URL + endpoints.getFolders + "?team=true", {
                    method: "GET",
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                        os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                        cpu: deviceInfo.cpu[0].model,
                        app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                        hash: hash,
                        team: team._id,
                    },
                    redirect: "follow",
                    referrerPolicy: "no-referrer",
                }).then(async (r) => ({
                    list: await r.json(),
                    teamName: team.name,
                }));
            })
        );

        const data = response.reduce((finalList: TestTeamsObject, current) => {
            finalList[current.teamName] = {
                allProfilesList: current.list.allProfilesFolder,
                favoriteProfilesList: current.list.favoriteProfilesFolder,
                customFoldersProfilesList: current.list.folders,
            };
            return finalList;
        }, {});
        return data;
    }
);

export const getEditedProfileAsync = createAsyncThunk(
    "profiles/getEditedProfileAsync",
    async ({ deviceInfo, hash, profileId, token, teamInfo }: GetEditedProfileAsyncTypes) => {
        const { teamId } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getProfile + profileId + `${teamId && "?team=true"}`, {
            method: "GET",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });

        const profile = await response.json();
        if (profile.message) throw new Error(profile.message);
        return profile;
    }
);

export const getProfileAsync = createAsyncThunk(
    "profiles/getProfileAsync",
    async ({ deviceInfo, token, hash, id, type, teamInfo }: GetProfilesAsyncTypes) => {
        const { teamId } = teamInfo;

        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getProfile + id + `${teamId && "?team=true"}`, {
            method: "GET",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });
        const profile = await response.json();
        if (profile.message) throw new Error(profile.message);
        const profileDataForElectron = {
            id: profile._id,
            os: profile.info.os,
            platform: profile.info.platform,
            browser: profile.info.browser,
            browser_version: profile.info.browser_version,
            name: profile.info.name,
            gpu: profile.gpu,
            cpu: profile.cpu,
            ram: profile.ram,
            resolution: profile.resolution,
            country: profile.info.country,
            timezone: profile.info.timezone,
            user_agent: profile.userAgentStr,
            language: profile.languages,
            proxy: profile.info.proxy,
            geo: profile.info.geo,
            geocode: profile.info.geocode,
            cookies: profile.cookies,
            comment: profile.info.comment,
            acceptEncoding: profile.acceptEncoding,
            acceptStr: profile.acceptStr,
            jsBaseCode: profile.jsBaseCode,
            jsATDCode: profile.jsATDCode,
            acceptLanguages: profile.acceptLanguages,
            timezoneOffsetStr: profile.timezoneOffsetStr,
        };
        /// @ts-ignore
        const p = await window.api.profile.save(profileDataForElectron);
        /// @ts-ignore
        window.api.profile.execute(p.id);
        const finalType = type || "";
        const final: [string, string, string, { teamId: string; teamName: string }] = [profile._id, p.id, finalType, teamInfo];
        return final;
    }
);

export const changeFolderIconAsync = createAsyncThunk(
    "profiles/changeFolderIconAsync",
    async ({ deviceInfo, hash, token, id, icon, teamInfo }: ChangeFolderIconAsyncTypes) => {
        const { teamId, teamName } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.changeFolderIcon + `${teamId && "?team=true"}`, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                id,
                icon,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return { data, teamName };
    }
);

export const changeFolderNameAsync = createAsyncThunk(
    "profiles/changeFolderNameAsync",
    async ({ deviceInfo, hash, token, id, name, teamInfo }: ChangeFolderNameAsyncTypes, { dispatch }) => {
        const { teamId, teamName } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.changeFolderName + `${teamId && "?team=true"}`, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                id,
                name,
            }),
        });
        const data = await response.json();
        if (data.message) {
            dispatch(showNotifyRedux({ type: notifyTypes.error, duration: 3000, title: data.message, subTitle: "" }));
            throw new Error(data.message);
        }
        return { data, teamName };
    }
);

export const deleteFolderAsync = createAsyncThunk(
    "profiles/deleteFolderAsync",
    async ({ deviceInfo, hash, token, id, navigateFn, teamInfo }: DeleteFolderAsyncTypes, { dispatch }) => {
        const { teamId, teamName } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.deleteFolder + `${teamId && "?team=true"}`, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                id,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        dispatch(resetHelperModalStateToInitialRedux());
        navigateFn();
        return { data, teamName };
    }
);

export const shareFolderAsync = createAsyncThunk(
    "profiles/shareFolderAsync",
    async ({ deviceInfo, hash, token, id, userName, teamInfo }: ShareFolderAsyncTypes, { dispatch }) => {
        const { teamId } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.shareFolder + `${teamId && "?team=true"}`, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                id,
                userName,
            }),
        });
        const data = await response.json();
        if (data.message) {
            dispatch(showNotifyRedux({ type: notifyTypes.error, title: data.message }));
            throw new Error(data.message);
        }
        dispatch(showNotifyRedux({ type: notifyTypes.success, title: t("profiles.folder_page.folder_successfully_send") }));
        dispatch(resetHelperModalStateToInitialRedux());
        return data;
    }
);

export const shareProfileAsync = createAsyncThunk(
    "profiles/shareProfileAsync",
    async ({ deviceInfo, hash, token, id, userName, teamInfo }: ShareProfileAsyncTypes, { dispatch }) => {
        const { teamId } = teamInfo;

        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.shareProfile + `${teamId && "?team=true"}`, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                id,
                userName,
            }),
        });
        const data = await response.json();
        if (data.message) {
            dispatch(showNotifyRedux({ type: notifyTypes.error, title: data.message }));
            throw new Error(data.message);
        }
        dispatch(showNotifyRedux({ type: notifyTypes.success, title: t("profiles.folder_page.profile_successfully_send") }));
        dispatch(resetHelperModalStateToInitialRedux());
        return data;
    }
);

export const deleteProfileAsync = createAsyncThunk(
    "profiles/deleteProfileAsync",
    async ({ deviceInfo, hash, token, id, teamInfo }: DeleteProfileAsyncTypes) => {
        const { teamId, teamName } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.deleteProfile + `${teamId && "?team=true"}`, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                id,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return { id, teamName };
    }
);

export const duplicateProfileAsync = createAsyncThunk(
    "profiles/duplicateProfileAsync",
    async ({ deviceInfo, hash, token, profileId, folderId, teamInfo, type, id }: DuplicateProfileAsyncTypes, { dispatch }) => {
        const { teamId } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.duplicateProfile + `${teamId && "?team=true"}`, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                profileId,
                folderId,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        dispatch(getProfilesAsync({ deviceInfo, hash, token, id: folderId || id, teamInfo, type }));
        return folderId;
    }
);

export const updateProfileAsync = createAsyncThunk(
    "profiles/updateProfileAsync",
    async ({ deviceInfo, hash, token, teamInfo, editedProfile, back }: UpdateProfileAsyncTypes) => {
        const { teamId } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.updateProfile + `${teamId && "?team=true"}`, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(editedProfile),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        back && back();
        return data;
    }
);

export const changeCookiesAsync = createAsyncThunk(
    "profiles/changeCookiesAsync",
    async ({ deviceInfo, hash, token, teamInfo, cookies, profileId }: ChangeCookiesAsyncTypes) => {
        const { teamId } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.updateProfile + `${teamId && "?team=true"}`, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                _id: profileId,
                cookies,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return data;
    }
);

export const moveProfileToFolderAsync = createAsyncThunk(
    "profiles/moveProfileToFolderAsync",
    async ({ deviceInfo, hash, token, profileId, fromFolderId, toFolderId, teamInfo }: MoveProfileToFolderAsyncTypes) => {
        const { teamId, teamName } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.moveProfileToFolder + `${teamId && "?team=true"}`, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                profileId,
                fromFolderId,
                toFolderId,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return { data, teamName, profileId };
    }
);

export const addProfilesToFolderAsync = createAsyncThunk(
    "profiles/addProfilesToFolderAsync",
    async ({ deviceInfo, hash, token, folderId, profileIds, teamInfo }: AddProfilesToFolderAsyncTypes) => {
        const { teamId, teamName } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.addProfilesToFolder + `${teamId && "?team=true"}`, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                folderId,
                profileIds,
            }),
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return { data, teamName, profileIds };
    }
);

const initialState: ProfileInitialStateTypes = {
    profilesLoading: false,
    folderNameError: "",
    changeFolderNameError: "",
    isChooseParameter: "", // Added to get border after clicking to change profiles parameter (new profile page)
    foldersList: {
        allProfilesFolder: {
            createAt: 0,
            name: "",
            profiles: [],
            updateAt: 0,
            _id: "",
        },
        favoriteProfilesFolder: {
            createAt: 0,
            name: "",
            profiles: [],
            updateAt: 0,
            _id: "",
        },
        folders: [],
    },
    allProfilesList: [],
    favoriteProfilesList: [],
    customFoldersProfilesList: [],
    teamsFolders: {},
    teamsProfilesList: [],
    startedProfiles: [],
    editedProfileRedux: {
        info: {
            os: "",
            platform: "",
            browser: "",
            browser_version: "",
            name: "",
            comment: "",
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
                protocol: "",
                login: "",
                password: "",
                hostAndPort: "",
            },
            geo: "",
            geocode: {
                title: "",
                id: "",
                resultType: "",
                localityType: "",
                address: {
                    label: "",
                    countryCode: "",
                    countryName: "",
                    state: "",
                    countyCode: "",
                    county: "",
                    city: "",
                    postalCode: "",
                },
                position: {
                    lat: 0,
                    lng: 0,
                },
                mapView: {
                    west: 0,
                    south: 0,
                    east: 0,
                    north: 0,
                },
                scoring: {
                    queryScore: 0,
                    fieldScore: {
                        city: 0,
                    },
                },
            },
            country: {
                name: "",
                code: "",
                flag: "",
            },
        },
        name: "",
        cpu: {
            name: "",
            type: "",
            data: {
                amount: 0,
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
        cookies: "",
        userAgentStr: "",
        acceptLanguages: "",
        languages: [],
        acceptEncoding: "",
        acceptStr: "",
        timezoneOffsetStr: "",
        jsBaseCode: "",
        isSummerTime: false,
        jsATDCode: "",
        updateAt: 0,
        createAt: 0,
        _id: "",
    },
};

const profilesSlice = createSlice({
    name: "profiles",
    initialState,
    reducers: {
        resetByDefaultProfiles(state) {
            state.folderNameError = "";
            state.changeFolderNameError = "";
        },
        resetProfilesStateToInitialRedux(state) {
            state.profilesLoading = initialState.profilesLoading;
            state.folderNameError = initialState.folderNameError;
            state.foldersList = initialState.foldersList;
            state.allProfilesList = initialState.allProfilesList;
            state.changeFolderNameError = initialState.changeFolderNameError;
        },
        resetChangeFolderNameError(state) {
            state.changeFolderNameError = "";
        },
        resetFoldersProfilesList(state) {
            state.customFoldersProfilesList = [];
        },
        resetTeamsProfilesList(state) {
            state.teamsProfilesList = [];
        },
        changeProfileExecutedStatusRedux(state, action) {
            const startedProfile = _.cloneDeep(state.startedProfiles).find((item) => item[1] === action.payload.id) || state.startedProfiles[0];
            let started = true;
            if (action.payload.type !== execute) {
                started = false;
                state.startedProfiles = state.startedProfiles.filter((item) => item[1] !== action.payload.id);
            }
            const isTeamProfile = !_.cloneDeep(state.foldersList.allProfilesFolder).profiles.some((el) => el === startedProfile[0]);

            if (isTeamProfile) {
                state.teamsProfilesList = _.cloneDeep(state.teamsProfilesList).map((item) => {
                    if (item._id === startedProfile[0]) item.execute = started;
                    return item;
                });
            } else {
                if (startedProfile[2] === customFolderProfilesType) {
                    state.customFoldersProfilesList = state.customFoldersProfilesList.map((item) => {
                        if (item._id === startedProfile[0]) item.execute = started;
                        return item;
                    });
                } else if (startedProfile[2] === allProfilesType) {
                    state.allProfilesList = state.allProfilesList.map((item) => {
                        if (item._id === startedProfile[0]) item.execute = started;
                        return item;
                    });
                } else if (startedProfile[2] === favoriteProfilesType) {
                    state.favoriteProfilesList = state.favoriteProfilesList.map((item) => {
                        if (item._id === startedProfile[0]) item.execute = started;
                        return item;
                    });
                }
            }
        },
        changeProfilesCustomData(state, action) {
            state.foldersList = {
                ...action.payload,
            };
        },
        clearEditedProfileRedux(state) {
            state.editedProfileRedux = initialState.editedProfileRedux;
        },
        setIsChooseParameterRedux(state, action) {
            state.isChooseParameter = action.payload.parameter;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFoldersAsync.pending, (state) => {
                state.profilesLoading = true;
            })
            .addCase(getFoldersAsync.fulfilled, (state, action) => {
                state.profilesLoading = false;
                state.foldersList = action.payload;
            })
            .addCase(getFoldersAsync.rejected, (state, action) => {
                state.profilesLoading = false;
                state.folderNameError = action.error.message + "";
            })
            .addCase(createFolderAsync.pending, (state) => {
                state.profilesLoading = true;
            })
            .addCase(createFolderAsync.fulfilled, (state, action) => {
                state.profilesLoading = false;
                if (action.payload.teamName) {
                    state.teamsFolders[action.payload.teamName] = {
                        allProfilesList: action.payload.data.allProfilesFolder,
                        favoriteProfilesList: action.payload.data.favoriteProfilesFolder,
                        customFoldersProfilesList: action.payload.data.folders,
                    };
                } else {
                    state.foldersList = action.payload.data;
                }
            })
            .addCase(createFolderAsync.rejected, (state, action) => {
                state.profilesLoading = false;
                state.folderNameError = action.error.message + "";
            })
            .addCase(getProfilesAsync.pending, (state) => {
                state.profilesLoading = true;
            })
            .addCase(getProfilesAsync.fulfilled, (state, action) => {
                state.profilesLoading = false;
                const startedProfiles = _.cloneDeep(state.startedProfiles);

                if (action.payload.teamName) {
                    state.teamsProfilesList = action.payload.data.map((item) => {
                        if (startedProfiles.some((el) => el[0] === item._id)) item.execute = true;
                        return item;
                    });
                } else {
                    switch (action.payload.type) {
                        case allProfilesType:
                            state.allProfilesList = action.payload.data.map((item) => {
                                if (startedProfiles.some((el) => el[0] === item._id)) item.execute = true;
                                return item;
                            });
                            break;
                        case favoriteProfilesType:
                            state.favoriteProfilesList = action.payload.data.map((item) => {
                                if (startedProfiles.some((el) => el[0] === item._id)) item.execute = true;
                                return item;
                            });
                            break;
                        default:
                            state.customFoldersProfilesList = action.payload.data.map((item) => {
                                if (startedProfiles.some((el) => el[0] === item._id)) item.execute = true;
                                return item;
                            });
                    }
                }
            })
            .addCase(getProfilesAsync.rejected, (state) => {
                state.profilesLoading = false;
            })
            .addCase(getTeamsFoldersAsync.pending, (state) => {
                state.profilesLoading = true;
            })
            .addCase(getTeamsFoldersAsync.fulfilled, (state, action) => {
                state.profilesLoading = false;
                state.teamsFolders = action.payload;
            })
            .addCase(getTeamsFoldersAsync.rejected, (state) => {
                state.profilesLoading = false;
            })
            .addCase(getProfileAsync.pending, (state) => {
                state.profilesLoading = true;
            })
            .addCase(getProfileAsync.fulfilled, (state, action) => {
                state.profilesLoading = false;
                state.startedProfiles.push(action.payload);
            })
            .addCase(getProfileAsync.rejected, (state) => {
                state.profilesLoading = false;
            })
            .addCase(getEditedProfileAsync.pending, (state) => {
                state.profilesLoading = true;
            })
            .addCase(getEditedProfileAsync.fulfilled, (state, action) => {
                state.profilesLoading = false;
                state.editedProfileRedux = action.payload;
            })
            .addCase(getEditedProfileAsync.rejected, (state) => {
                state.profilesLoading = false;
            })
            .addCase(changeFolderIconAsync.pending, (state) => {
                state.profilesLoading = true;
            })
            .addCase(changeFolderIconAsync.fulfilled, (state, action) => {
                state.profilesLoading = false;
                if (action.payload.teamName) {
                    const folders = _.cloneDeep(state.teamsFolders);
                    state.teamsFolders = {
                        ...folders,
                        [action.payload.teamName]: {
                            allProfilesList: action.payload.data.allProfilesFolder,
                            favoriteProfilesList: action.payload.data.favoriteProfilesFolder,
                            customFoldersProfilesList: action.payload.data.folders,
                        },
                    };
                } else {
                    state.foldersList = action.payload.data;
                }
            })
            .addCase(changeFolderIconAsync.rejected, (state) => {
                state.profilesLoading = false;
            })
            .addCase(changeFolderNameAsync.pending, (state) => {
                state.profilesLoading = true;
            })
            .addCase(changeFolderNameAsync.fulfilled, (state, action) => {
                state.profilesLoading = false;
                if (action.payload.teamName) {
                    const folders = _.cloneDeep(state.teamsFolders);
                    state.teamsFolders = {
                        ...folders,
                        [action.payload.teamName]: {
                            allProfilesList: action.payload.data.allProfilesFolder,
                            favoriteProfilesList: action.payload.data.favoriteProfilesFolder,
                            customFoldersProfilesList: action.payload.data.folders,
                        },
                    };
                } else {
                    state.foldersList = action.payload.data;
                }
            })
            .addCase(changeFolderNameAsync.rejected, (state, action) => {
                state.profilesLoading = false;
                state.changeFolderNameError = action.error.message + "";
            })
            .addCase(deleteFolderAsync.pending, (state) => {
                state.profilesLoading = true;
            })
            .addCase(deleteFolderAsync.fulfilled, (state, action) => {
                state.profilesLoading = false;
                if (action.payload.teamName) {
                    const folders = _.cloneDeep(state.teamsFolders);
                    state.teamsFolders = {
                        ...folders,
                        [action.payload.teamName]: {
                            allProfilesList: action.payload.data.allProfilesFolder,
                            favoriteProfilesList: action.payload.data.favoriteProfilesFolder,
                            customFoldersProfilesList: action.payload.data.folders,
                        },
                    };
                } else {
                    state.foldersList = action.payload.data;
                }
            })
            .addCase(deleteFolderAsync.rejected, (state, action) => {
                state.profilesLoading = false;
            })
            .addCase(shareFolderAsync.pending, (state) => {
                state.profilesLoading = true;
            })
            .addCase(shareFolderAsync.fulfilled, (state, action) => {
                state.profilesLoading = false;
            })
            .addCase(shareFolderAsync.rejected, (state, action) => {
                state.profilesLoading = false;
            })
            .addCase(deleteProfileAsync.pending, (state) => {
                state.profilesLoading = true;
            })
            .addCase(deleteProfileAsync.fulfilled, (state, action) => {
                state.profilesLoading = false;
                if (action.payload.teamName) {
                    state.teamsProfilesList = state.teamsProfilesList.filter((item) => item._id !== action.payload.id);
                } else {
                    state.allProfilesList = state.allProfilesList.filter((item) => item._id !== action.payload.id);
                }
            })
            .addCase(deleteProfileAsync.rejected, (state, action) => {
                state.profilesLoading = false;
            })
            .addCase(updateProfileAsync.pending, (state) => {
                state.profilesLoading = true;
            })
            .addCase(updateProfileAsync.fulfilled, (state, action) => {
                state.profilesLoading = false;
            })
            .addCase(updateProfileAsync.rejected, (state, action) => {
                state.profilesLoading = false;
            })
            .addCase(moveProfileToFolderAsync.pending, (state) => {
                state.profilesLoading = true;
            })
            .addCase(moveProfileToFolderAsync.fulfilled, (state, action) => {
                state.profilesLoading = false;
                if (action.payload.teamName) {
                    if (action.payload.profileId) {
                        state.teamsProfilesList = _.cloneDeep(state.teamsProfilesList).filter((item) => item._id !== action.payload.profileId);
                    }
                    const folders = _.cloneDeep(state.teamsFolders);
                    state.teamsFolders = {
                        ...folders,
                        [action.payload.teamName]: {
                            allProfilesList: action.payload.data.allProfilesFolder,
                            favoriteProfilesList: action.payload.data.favoriteProfilesFolder,
                            customFoldersProfilesList: action.payload.data.folders,
                        },
                    };
                } else {
                    state.foldersList = action.payload.data;
                }
            })
            .addCase(moveProfileToFolderAsync.rejected, (state, action) => {
                state.profilesLoading = false;
            })
            .addCase(addProfilesToFolderAsync.pending, (state) => {
                state.profilesLoading = true;
            })
            .addCase(addProfilesToFolderAsync.fulfilled, (state, action) => {
                state.profilesLoading = false;
            })
            .addCase(addProfilesToFolderAsync.rejected, (state, action) => {
                state.profilesLoading = false;
            });
    },
});

export const {
    resetByDefaultProfiles,
    resetProfilesStateToInitialRedux,
    resetChangeFolderNameError,
    resetFoldersProfilesList,
    changeProfileExecutedStatusRedux,
    resetTeamsProfilesList,
    changeProfilesCustomData,
    clearEditedProfileRedux,
    setIsChooseParameterRedux,
} = profilesSlice.actions;

export default profilesSlice.reducer;
