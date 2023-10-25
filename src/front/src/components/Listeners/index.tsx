///@ts-nocheck
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { constants } from "../../assets/constants";
import { useAppDispatch, useAppSelector } from "../../store";
import { loginByTokenAsync } from "../../store/features/accountSlice";
import { getAppSettingsAsync, getDeviceInfoAsync, getNotificationsSettingsAsync, getTariffListAsync } from "../../store/features/mainSlice";
import { getAllNotificationsAsync } from "../../store/features/notificationsSlice";
import { changeCookiesAsync, changeProfileExecutedStatusRedux } from "../../store/features/profilesSlice";
import { OldStartedProfilesTypes } from "../../types";

const { execute, close } = constants;

function Listeners() {
    const { i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        main: {
            deviceInfo,
            appSettings: { language },
        },
        account: {
            user: { emailConfirmed },
            token,
            hash,
        },
        profiles: { startedProfiles },
    } = useAppSelector((state) => state);
    const oldStartedProfiles = useRef<OldStartedProfilesTypes[]>([]);
    const oldStartedCookies = useRef<{ id: string; cookies: string }[]>([]);

    useEffect(() => {
        if (startedProfiles.length > oldStartedProfiles.current.length) {
            startedProfiles.forEach((profileInfo) => {
                const idForServer = profileInfo[0];
                const idForElectron = profileInfo[1];
                const type = profileInfo[2];
                const teamInfo = profileInfo[3];

                if (!oldStartedProfiles.current.some((pr) => pr.idForElectron === idForElectron)) {
                    const intervalId: NodeJS.Timer = setInterval(async () => {
                        const profileForElectron = await window.api.profile.get(idForElectron);
                        const findItem = oldStartedCookies.current.find((el) => el.id === idForElectron);

                        if (!findItem || findItem.cookies !== profileForElectron.cookies) {
                            if (!findItem) {
                                oldStartedCookies.current.push({
                                    id: idForElectron,
                                    cookies: profileForElectron.cookies,
                                });
                            } else {
                                oldStartedCookies.current = oldStartedCookies.current.map((el) => {
                                    if (el.id === idForElectron) el.cookies = profileForElectron.cookies;
                                    return el;
                                });
                                dispatch(
                                    changeCookiesAsync({
                                        deviceInfo,
                                        token,
                                        hash,
                                        teamInfo,
                                        cookies: profileForElectron.cookies,
                                        profileId: idForServer,
                                    })
                                );
                            }
                        }
                    }, 15000);

                    oldStartedProfiles.current.push({
                        idForServer,
                        idForElectron,
                        type,
                        teamInfo,
                        intervalId,
                    });
                }
            });
        } else {
            oldStartedProfiles.current = oldStartedProfiles.current.filter((pr) => {
                if (!startedProfiles.map((el) => el[0]).some((id) => id === pr.idForServer)) {
                    clearInterval(pr.intervalId);
                    oldStartedCookies.current = oldStartedCookies.current.filter((el) => el.id !== pr.idForElectron);
                    return false;
                }
                return true;
            });
        }
    }, [startedProfiles]);

    useEffect(() => {
        if (emailConfirmed) {
            dispatch(getAllNotificationsAsync({ token, deviceInfo, hash }));
            dispatch(getAppSettingsAsync({ deviceInfo, token, hash }));
            dispatch(getNotificationsSettingsAsync({ deviceInfo, hash, token }));
            dispatch(getTariffListAsync({ deviceInfo, hash, token }));
        }
    }, [emailConfirmed, deviceInfo]);

    useEffect(() => {
        dispatch(getDeviceInfoAsync());
    }, [dispatch]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        deviceInfo.os.platform && token && dispatch(loginByTokenAsync({ token, deviceInfo }));
    }, [deviceInfo.os.platform]);

    useEffect(() => {
        if (language !== localStorage.getItem("i18nextLng")) i18n.changeLanguage(language);
    }, [language]);

    const changeStatus = (id: string, type: string) => {
        dispatch(changeProfileExecutedStatusRedux({ id, type }));
        if (type === close) window.api.profile.delete(id);
    };

    useEffect(() => {
        // window.api.profile.delete_all();
        window.api.profile.events(execute, ({ id }: { id: string }) => changeStatus(id, execute));
        window.api.profile.events(close, ({ id }: { id: string }) => changeStatus(id, close));
    }, []);

    return <></>;
}

export default Listeners;
