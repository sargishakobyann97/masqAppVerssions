import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { helpers } from "../../../../assets/helpers";
import { constants } from "../../../../assets/constants";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { EditedProfileTypes, InitialProxyDataTypes, SelectedProfileParameter } from "../../../../types";
import { clearEditedProfileRedux, getEditedProfileAsync, updateProfileAsync } from "../../../../store/features/profilesSlice";
import BackToSomePage from "../../../helpersComponents/BackToSomePage";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ProxySettings from "../../../helpersComponents/ProxySettings";
import CookiesSettings from "../../../helpersComponents/CookiesSettings";
import { showNotifyRedux } from "../../../../store/features/notifySlice";
import styles from "./edit_profile.module.scss";

const {
    paths,
    notifyTypes: { invite },
} = constants;

const initialState = {
    _id: " ",
    cookies: "",
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
        geocode: {},
        country: { name: "", code: "", flag: "" },
    },
};

const EditProfile = () => {
    const { pathname, teamInfo } = helpers.convertTeamInfo(useLocation().pathname);
    const [folderId, profileId] = pathname.split("/profiles/edit-profile/")[1].split("~");
    const { t } = useTranslation();
    const {
        profiles: { editedProfileRedux },
        account: { hash, token },
        main: { deviceInfo },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [editedProfile, setEditedProfile] = useState<EditedProfileTypes>(initialState);
    const [showProxySettings, setShowProxySettings] = useState(false);
    const [showCookiesSettings, setShowCookiesSettings] = useState(false);

    const changeProxyShow = () => setShowProxySettings(!showProxySettings);
    const changeCookiesShow = () => setShowCookiesSettings(!showCookiesSettings);

    const changeNameCommentGeo = (type: string, value: string) => {
        setEditedProfile({
            ...editedProfile,
            info: {
                ...editedProfile.info,
                [type]: value,
            },
        });
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
        let timezone = editedProfile.info.timezone;
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
        setEditedProfile({
            ...editedProfile,
            info: {
                ...editedProfile.info,
                proxy,
                geo,
                geocode,
                timezone,
            },
        });
    };
    const changeCookies = ({ cookies }: { cookies: string; fileName: string }) => {
        setEditedProfile({
            ...editedProfile,
            cookies,
        });
    };

    const selectedProfileParameters: SelectedProfileParameter[] = useMemo(
        () => [
            {
                text: t("newProfile.step_0.name"),
                value: editedProfileRedux?.info?.name,
                step: "step_0",
            },
            {
                text: t("newProfile.step_0.comment"),
                value: editedProfileRedux?.info?.comment,
                step: "step_0",
            },
            {
                text: t("newProfile.step_1.os"),
                value: editedProfileRedux?.info?.os,
                step: "step_1",
            },
            {
                text: t("newProfile.step_1.platform"),
                value: editedProfileRedux?.info?.platform,
                step: "step_1",
            },
            {
                text: t("newProfile.step_1.browser"),
                value: editedProfileRedux?.info?.browser,
                step: "step_1",
            },
            {
                text: t("newProfile.step_1.browser_version"),
                value: editedProfileRedux?.info?.browser_version,
                step: "step_1",
            },
            {
                text: t("newProfile.step_2.screen_resolution"),
                value: editedProfileRedux?.resolution?.name,
                step: "step_2",
            },
            {
                text: "CPU",
                value: editedProfileRedux?.cpu?.name,
                step: "step_2",
            },
            {
                text: "GPU",
                value: editedProfileRedux?.gpu?.name,
                step: "step_2",
            },
            {
                text: "RAM",
                value: editedProfileRedux?.ram?.name,
                step: "step_2",
            },
            {
                text: t("newProfile.step_3.countries"),
                value: editedProfileRedux?.info?.country.name,
                step: "step_3",
            },
            {
                text: t("newProfile.step_3.language"),
                value: editedProfileRedux?.languages?.join(" | "),
                step: "step_3",
            },
            {
                text: t("newProfile.step_3.timezone"),
                value: editedProfileRedux?.info?.timezone?.human,
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
        [t, editedProfileRedux]
    );

    const saveNewChanges = () => {
        if (editedProfile.info.name) {
            const back = () => {
                navigate(paths.profiles + "/" + folderId + `${teamInfo.teamId && `**teamId=${teamInfo.teamId}*teamName=${teamInfo.teamName}`}`);
            };
            dispatch(updateProfileAsync({ hash, token, deviceInfo, teamInfo, editedProfile, back }));
        } else {
            dispatch(showNotifyRedux({ type: invite, title: t("sundry.please_fill") + t("newProfile.step_0.name") + t("sundry.field") }));
        }
    };

    useEffect(() => {
        dispatch(getEditedProfileAsync({ hash, token, deviceInfo, teamInfo, profileId }));
        return () => {
            dispatch(clearEditedProfileRedux());
        };
    }, []);

    useEffect(() => {
        if (editedProfileRedux._id) {
            setEditedProfile({
                _id: editedProfileRedux._id,
                cookies: editedProfileRedux.cookies,
                info: {
                    ...editedProfileRedux.info,
                },
            });
        }
    }, [editedProfileRedux]);

    return (
        <div className={styles.edit_profile_wrapper}>
            {(showProxySettings || showCookiesSettings) && (
                <div className={styles.cookies_proxy_wrapper}>
                    <div className={styles.cookies_proxy_content}>
                        {showProxySettings && (
                            <ProxySettings
                                close={changeProxyShow}
                                changeProxy={changeProxy}
                                proxy={editedProfile.info.proxy}
                                geo={editedProfile.info.geo}
                            />
                        )}
                        {showCookiesSettings && (
                            <CookiesSettings close={changeCookiesShow} changeCookies={changeCookies} cookies={{ cookies: editedProfile.cookies }} />
                        )}
                    </div>
                </div>
            )}
            <div className={styles.left_block}>
                {!showProxySettings && !showCookiesSettings && (
                    <div className={styles.back_to_folder_btn}>
                        <BackToSomePage
                            path={
                                paths.profiles + "/" + folderId + `${teamInfo.teamId && `**teamId=${teamInfo.teamId}*teamName=${teamInfo.teamName}`}`
                            }
                            page={"folder"}
                            color="#808080"
                        />
                    </div>
                )}
                <h2 className={styles.edit_profile_title}>Editing Profile</h2>
                <h3 className={styles.edit_profile_sub_title}>Edit general profile parameters</h3>
                <div className={styles.edit_properties}>
                    <label htmlFor="">Name</label>
                    <input type="text" value={editedProfile.info.name} onChange={(e) => changeNameCommentGeo("name", e.target.value)} />
                </div>
                <div className={styles.edit_properties}>
                    <label htmlFor="">Comment</label>
                    <input type="text" value={editedProfile.info.comment} onChange={(e) => changeNameCommentGeo("comment", e.target.value)} />
                </div>
                {/* <div className={styles.edit_properties}>
                    <label htmlFor="">Geolocation</label>
                    <input type="text" value={editedProfile.info.geo} onChange={(e) => changeNameCommentGeo("geo", e.target.value)} />
                </div> */}
                <div className={styles.edit_properties}>
                    <label htmlFor="">Cookies</label>
                    <p onClick={changeCookiesShow}>
                        <span>Cookie Settings</span>
                        <ArrowForwardIosIcon />
                    </p>
                </div>
                <div className={styles.edit_properties}>
                    <label htmlFor="">Proxy</label>
                    <p onClick={changeProxyShow}>
                        <span>Proxy Settings</span>
                        <ArrowForwardIosIcon />
                    </p>
                </div>
            </div>
            <div className={styles.right_block}>
                <p className={styles.right_block_title}>Profile Parameters:</p>
                <div className={styles.selected_parameter_wrapper}>
                    {selectedProfileParameters.map((parameter) => {
                        return parameter.value ? (
                            <p key={parameter.text} title={parameter.value}>
                                {parameter.text}: {parameter.value}
                            </p>
                        ) : null;
                    })}
                </div>
                <p className={styles.save_new_changes_btn} onClick={saveNewChanges}>
                    Save
                </p>
            </div>
        </div>
    );
};

export default EditProfile;
