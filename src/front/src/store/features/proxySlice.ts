import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { constants } from "../../assets/constants";
import { CheckProxyAsyncTypes, GetGeocodeTypesAsync, ProxyInitialStateTypes } from "../../types";
import { showNotifyRedux } from "./notifySlice";
import { t } from "i18next";

const {
    endpoints,
    notifyTypes: { success, error },
} = constants;

export const getGeocodeAsync = createAsyncThunk(
    "main/getGeocodeAsync",
    async ({ deviceInfo, token, hash, geolocation, teamInfo }: GetGeocodeTypesAsync) => {
        const { teamId } = teamInfo;
        const response = await fetch(process.env.REACT_APP_API_URL + endpoints.getGeocode + geolocation + `${teamId && "?team=true"}`, {
            method: "GET",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                os: `${deviceInfo.os.platform} ${deviceInfo.os.type} ${deviceInfo.os.release}`,
                cpu: deviceInfo.cpu[0].model,
                app: "MASQ Panel " + process.env.REACT_APP_APP_VERSION,
                hash: hash,
                Authorization: token,
                team: teamId,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });
        const data = await response.json();
        if (data.message) throw new Error(data.message);
        return data;
    }
);

export const checkProxyAsync = createAsyncThunk(
    "profiles/checkProxyAsync",
    async ({ deviceInfo, hash, token, proxyData, close, changeProxy, teamInfo }: CheckProxyAsyncTypes, { dispatch }) => {
        try {
            const { teamId } = teamInfo;
            const i = proxyData.hostAndPort.indexOf(":");
            const host = proxyData.hostAndPort.slice(0, i);
            const port = proxyData.hostAndPort.slice(i + 1);

            const proxy = {
                host,
                port,
                protocol: proxyData.protocol.toLowerCase(),
                login: proxyData.login,
                password: proxyData.password,
            };

            const response = await fetch(process.env.REACT_APP_API_URL + endpoints.checkProxy + `${teamId && "?team=true"}`, {
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
                body: JSON.stringify(proxy),
            });
            const data = await response.json();
            if ((!data.valid || !proxyData.hostAndPort) && !changeProxy) {
                // error
                dispatch(
                    showNotifyRedux({
                        type: error,
                        title: "Proxy not actual",
                        duration: 5000,
                    })
                );
            } else if (changeProxy && close) {
                // change proxy
                const fullProxyData = {
                    ...proxyData,
                    timezone: data.timezone || {},
                };
                changeProxy(fullProxyData);
                close && close();
            } else if (data.valid) {
                // check proxy
                dispatch(showNotifyRedux({ type: success, title: t("event_modals.success"), subTitle: "Proxy speed " + data.time + "ms" }));
            }

            return data;
        } catch (e) {
            const fullProxyData = {
                ...proxyData,
                timezone: {},
            };
            changeProxy && changeProxy(fullProxyData);
            close && close();
        }
    }
);

const initialState: ProxyInitialStateTypes = {
    proxyLoading: false,
    geocodeRedux: {},
};

const proxySlice = createSlice({
    name: "proxy",
    initialState,
    reducers: {
        resetGeocodeRedux(state) {
            state.geocodeRedux = initialState.geocodeRedux;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getGeocodeAsync.pending, (state) => {
                state.proxyLoading = true;
            })
            .addCase(getGeocodeAsync.fulfilled, (state, action) => {
                state.proxyLoading = false;
                state.geocodeRedux = action.payload.items[0] || initialState.geocodeRedux;
            })
            .addCase(getGeocodeAsync.rejected, (state) => {
                state.proxyLoading = false;
            })
            .addCase(checkProxyAsync.pending, (state) => {
                state.proxyLoading = true;
            })
            .addCase(checkProxyAsync.fulfilled, (state, action) => {
                state.proxyLoading = false;
            })
            .addCase(checkProxyAsync.rejected, (state) => {
                state.proxyLoading = false;
            });
    },
});

export const { resetGeocodeRedux } = proxySlice.actions;
export default proxySlice.reducer;
