import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { t } from "i18next";
import { constants } from "../../assets/constants";
import { offsets } from "../../assets/offsets";
import {
    CreateNewProfileAsyncTypes,
    GenerateRandomProfileAsyncTypes,
    GetBrowserVersionTypes,
    GetBrowsersAsyncTypes,
    GetHardwareAndCountriesAsyncTypes,
    GetLanguagesAsyncTypes,
    GetUserAgentAsyncTypes,
    InitialNewProfileSliceTypes,
    ResolutionTypes,
} from "../../types";
import { setEventsMessageRedux } from "./eventsModalSlice";
import { getProfilesAsync } from "./profilesSlice";
import { showNotifyRedux } from "./notifySlice";

const {
    endpoints,
    paths: { getResolutions, getCores, getVideoCards, getRams, getCountries },
    notifyTypes: { error },
} = constants;

let count = 0;

export const getBrowsersAsync = createAsyncThunk(
    "newProfileSlice/getBrowsersAsync",
    async ({ deviceInfo, token, hash, teamInfo }: GetBrowsersAsyncTypes) => {
        const { teamId } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getBrowsers + `${teamId && "?team=true"}`, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
                team: teamId,
            },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    }
);

export const getBrowserVersionAsync = createAsyncThunk(
    "newProfileSlice/getBrowserVersionAsync",
    async ({ deviceInfo, token, hash, info, teamInfo }: GetBrowserVersionTypes) => {
        const { teamId } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getBrowserVersions + info + `${teamId && "?team=true"}`, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
                team: teamId,
            },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    }
);

export const getHardwareAndCountriesAsync = createAsyncThunk(
    "newProfileSlice/getHardwareAndCountriesAsync",
    async ({ deviceInfo, token, hash, teamInfo }: GetHardwareAndCountriesAsyncTypes) => {
        const { teamId } = teamInfo;
        const paths = [getResolutions, getCores, getVideoCards, getRams, getCountries];
        const dataList = await Promise.all(
            paths.map((url) => {
                return fetch(process.env.REACT_APP_API_URL + url + `${teamId && "?team=true"}`, {
                    method: "GET",
                    credentials: "same-origin",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                        os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                        cpu: deviceInfo.cpu[0].model,
                        app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                        hash: hash,
                        team: teamId,
                    },
                }).then((r) => r.json());
            })
        );

        if (dataList[0].error || dataList[0].message) throw new Error(dataList[0].error || dataList[0].message);
        return dataList;
    }
);

export const getLanguagesAsync = createAsyncThunk(
    "newProfileSlice/getLanguagesAsync",
    async ({ deviceInfo, token, hash, country, teamInfo }: GetLanguagesAsyncTypes) => {
        const { teamId } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getLanguages + country + `${teamId && "?team=true"}`, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
                team: teamId,
            },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    }
);

export const getUserAgentAsync = createAsyncThunk(
    "newProfileSlice/getUserAgentAsync",
    async ({ deviceInfo, token, hash, params, teamInfo }: GetUserAgentAsyncTypes) => {
        const { teamId } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getUserAgent + params + `${teamId && "?team=true"}`, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
                team: teamId,
            },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data.ua;
    }
);

export const createProfileAsync = createAsyncThunk(
    "account/createProfileAsync",
    async (
        {
            deviceInfo,
            hash,
            token,
            newProfile,
            closeCreateProfilePage,
            selectedFolderIcon,
            teamInfo,
            isConvert,
            isImported,
            folderId,
        }: CreateNewProfileAsyncTypes,
        { dispatch }
    ) => {
        const profile = {
            info: {
                os: newProfile.os,
                platform: newProfile.platform,
                browser: newProfile.browser,
                browser_version: newProfile.browserVersion,
                name: newProfile.name,
                comment: newProfile.comment,
                timezone: newProfile.timezone,
                proxy: newProfile.proxy,
                geo: newProfile.geo,
                geocode: newProfile.geocode,
                country: newProfile.country,
            },
            cookies: newProfile.cookies.cookies,
            folderId: newProfile.folderId,
            userAgent: newProfile.user_agent,
            search: `${newProfile.os} ${newProfile.platform} ${newProfile.browser} ${newProfile.browserVersion}`,
            country: newProfile.country.name,
            AFP: newProfile.AFP,
            AWP: newProfile.AWP,
            AAP: newProfile.AAP,
            ACP: newProfile.ACP,
            languages: newProfile.language,
            ram: newProfile.ram,
            cores: newProfile.cpu,
            screen: newProfile.resolution,
            videoCard: newProfile.gpu,
        };

        const { teamId, teamName } = teamInfo;

        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.createProfile + `${teamId && "?team=true"}`, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(profile),
        });
        const data = await response.json();
        if (data.message) {
            dispatch(showNotifyRedux({ type: error, title: data.message }));
            throw new Error(data.message);
        }
        closeCreateProfilePage && closeCreateProfilePage();
        if (!isConvert) {
            dispatch(
                setEventsMessageRedux({
                    type: "2",
                    customMessage: t("event_modals.profile") + profile.info.name.toUpperCase() + t("event_modals.has_been_created"),
                    header: "success",
                    iconName: selectedFolderIcon,
                })
            );
        }

        if (isConvert && isConvert === count) {
            dispatch(
                setEventsMessageRedux({
                    type: "2",
                    customMessage: t("helper_modal.local_profiles_imported_successfully"),
                    header: "success",
                    iconName: selectedFolderIcon,
                })
            );
        } else if (isConvert) {
            count++;
        }

        isImported && dispatch(getProfilesAsync({ token, hash, deviceInfo, teamInfo, id: folderId + "" }));

        return data;
    }
);

export const generateRandomProfileAsync = createAsyncThunk(
    "newProfile/generateRandomProfileAsync",
    async ({ token, hash, deviceInfo, teamInfo, folderId, browsers }: GenerateRandomProfileAsyncTypes, { dispatch }) => {
        const { teamId } = teamInfo;
        const hardwareAllPaths = [getResolutions, getCores, getVideoCards, getRams, getCountries];
        const generateRandomInteger = (max: number, min: number = 0) => Math.floor(Math.random() * max) + min;
        const osList: string[] = Object.keys(browsers);
        const os: string = osList[generateRandomInteger(osList.length)];
        const platformList: string[] = Object.keys(browsers[os as keyof typeof browsers]);
        const platform: string = platformList[generateRandomInteger(platformList.length)];
        const browsersList: string[] = browsers[os as keyof typeof browsers][platform];
        const browser = browsersList[generateRandomInteger(browsersList.length)];

        let profile = {
            folderId,
            name: "Random Profile " + Math.random().toFixed(2),
            os,
            platform,
            browser,
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
            timezone: offsets[generateRandomInteger(offsets.length)],
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

        await fetch(process.env.REACT_APP_API_URL + endpoints.getBrowserVersions + `/${os} ${platform} ${browser}` + `${teamId && "?team=true"}`, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
                team: teamId,
            },
        })
            .then((res) => res.json())
            .then((versions) => {
                const browserVersion = versions[generateRandomInteger(versions.length)];
                dispatch(setBrowserVersionsRedux(versions));
                profile = { ...profile, browserVersion };
            });
        await Promise.all(
            hardwareAllPaths.map((url) => {
                return fetch(process.env.REACT_APP_API_URL + url + `${teamId && "?team=true"}`, {
                    method: "GET",
                    credentials: "same-origin",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                        os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                        cpu: deviceInfo.cpu[0].model,
                        app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                        hash: hash,
                        team: teamId,
                    },
                })
                    .then((r) => r.json())
                    .then((item) => {
                        const respType = item[0].type;
                        switch (respType) {
                            case "screen":
                                const screenList: ResolutionTypes[] = item;
                                const list = screenList.filter((el) => el.platforms.toLowerCase().includes(os.toLowerCase()));
                                profile = {
                                    ...profile,
                                    resolution: list[generateRandomInteger(list.length)],
                                };
                                dispatch(setResolutionRedux(item));
                                break;
                            case "ram":
                                profile = { ...profile, ram: item[generateRandomInteger(item.length)] };
                                dispatch(setRamRedux(item));
                                break;
                            case "videoCard":
                                profile = { ...profile, gpu: item[generateRandomInteger(item.length)] };
                                dispatch(setGpuRedux(item));
                                break;
                            case "cores":
                                profile = { ...profile, cpu: item[generateRandomInteger(item.length)] };
                                dispatch(setCpuRedux(item));
                                break;
                            default:
                                profile = { ...profile, country: item[generateRandomInteger(item.length)] };
                                dispatch(setCountriesRedux(item));
                        }
                    });
            })
        );
        await fetch(process.env.REACT_APP_API_URL + endpoints.getLanguages + profile.country.name + `${teamId && "?team=true"}`, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
                team: teamId,
            },
        })
            .then((r) => r.json())
            .then((language) => {
                profile = { ...profile, language };
            });
        await fetch(
            process.env.REACT_APP_API_URL +
                endpoints.getUserAgent +
                `${os} ${platform} ${browser} ${profile.browserVersion}` +
                `${teamId && "?team=true"}`,
            {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                    os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                    cpu: deviceInfo.cpu[0].model,
                    app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                    hash: hash,
                    team: teamId,
                },
            }
        )
            .then((r) => r.json())
            .then(({ ua }) => {
                profile = { ...profile, user_agent: ua };
            });
        return { profile };
    }
);

const initialState: InitialNewProfileSliceTypes = {
    newProfileLoading: false,
    browsers: {}, //--->> os, platforms, browsers
    browserVersions: [],
    resolutionsList: [],
    cpuList: [],
    gpuList: [],
    ramList: [],
    countriesList: [],
    languages: [],
    randomProfileData: {
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
            protocol: "",
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
    },
    userAgent: "",
};

const newProfileSlice = createSlice({
    name: "newProfileSlice",
    initialState,
    reducers: {
        resetUserAgentRedux(state) {
            state.userAgent = "";
        },
        resetNewProfileState(state) {
            state.newProfileLoading = initialState.newProfileLoading;
            state.browsers = initialState.browsers;
            state.browserVersions = initialState.browserVersions;
            state.resolutionsList = initialState.resolutionsList;
            state.cpuList = initialState.cpuList;
            state.gpuList = initialState.gpuList;
            state.ramList = initialState.ramList;
            state.countriesList = initialState.countriesList;
            state.languages = initialState.languages;
            state.userAgent = initialState.userAgent;
        },
        resetRandomGeneratedProfile(state) {
            state.randomProfileData = initialState.randomProfileData;
        },
        setBrowserVersionsRedux(state, action) {
            state.browserVersions = action.payload.map((item: string, i: number) => ({ id: i, value: item, text: item }));
        },
        setResolutionRedux(state, action) {
            state.resolutionsList = action.payload;
        },
        setCpuRedux(state, action) {
            state.cpuList = action.payload;
        },
        setGpuRedux(state, action) {
            state.gpuList = action.payload;
        },
        setRamRedux(state, action) {
            state.ramList = action.payload;
        },
        setCountriesRedux(state, action) {
            state.countriesList = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBrowsersAsync.pending, (state, action) => {
                state.newProfileLoading = true;
            })
            .addCase(getBrowsersAsync.fulfilled, (state, action) => {
                state.newProfileLoading = false;
                state.browsers = action.payload;
            })
            .addCase(getBrowsersAsync.rejected, (state, action) => {
                state.newProfileLoading = false;
            })
            .addCase(getBrowserVersionAsync.pending, (state, action) => {
                state.newProfileLoading = true;
            })
            .addCase(getBrowserVersionAsync.fulfilled, (state, action) => {
                state.newProfileLoading = false;
                state.browserVersions = action.payload.map((item: string, i: number) => ({ id: i, value: item, text: item }));
            })
            .addCase(getBrowserVersionAsync.rejected, (state, action) => {
                state.newProfileLoading = false;
            })
            .addCase(getHardwareAndCountriesAsync.pending, (state, action) => {
                state.newProfileLoading = true;
            })
            .addCase(getHardwareAndCountriesAsync.fulfilled, (state, action) => {
                state.newProfileLoading = false;
                state.resolutionsList = action.payload[0];
                state.cpuList = action.payload[1];
                state.gpuList = action.payload[2];
                state.ramList = action.payload[3];
                state.countriesList = action.payload[4];
            })
            .addCase(getHardwareAndCountriesAsync.rejected, (state, action) => {
                state.newProfileLoading = false;
            })
            .addCase(getLanguagesAsync.pending, (state, action) => {
                state.newProfileLoading = true;
            })
            .addCase(getLanguagesAsync.fulfilled, (state, action) => {
                state.newProfileLoading = false;
                state.languages = action.payload;
            })
            .addCase(getLanguagesAsync.rejected, (state, action) => {
                state.newProfileLoading = false;
            })
            .addCase(getUserAgentAsync.pending, (state, action) => {
                state.newProfileLoading = true;
            })
            .addCase(getUserAgentAsync.fulfilled, (state, action) => {
                state.newProfileLoading = false;
                state.userAgent = action.payload;
            })
            .addCase(getUserAgentAsync.rejected, (state, action) => {
                state.newProfileLoading = false;
            })
            .addCase(createProfileAsync.pending, (state, action) => {
                state.newProfileLoading = true;
            })
            .addCase(createProfileAsync.fulfilled, (state, action) => {
                state.newProfileLoading = false;
            })
            .addCase(createProfileAsync.rejected, (state, action) => {
                state.newProfileLoading = false;
            })
            .addCase(generateRandomProfileAsync.pending, (state, action) => {
                state.newProfileLoading = true;
            })
            .addCase(generateRandomProfileAsync.fulfilled, (state, action) => {
                state.newProfileLoading = false;
                state.randomProfileData = action.payload.profile;
            })
            .addCase(generateRandomProfileAsync.rejected, (state, action) => {
                state.newProfileLoading = false;
            });
    },
});

export const {
    resetUserAgentRedux,
    resetNewProfileState,
    resetRandomGeneratedProfile,
    setBrowserVersionsRedux,
    setResolutionRedux,
    setCpuRedux,
    setGpuRedux,
    setRamRedux,
    setCountriesRedux,
} = newProfileSlice.actions;
export default newProfileSlice.reducer;
