export interface ConstantsTypes {
    bearer: "Bearer ";
    valid: "valid";
    create_new_team: "Create new team";
    yes: "yes";
    no: "no";
    mainColor: "560BAD";
    emailPattern: RegExp;
    allProfilesType: "all";
    favoriteProfilesType: "favorite";
    customFolderProfilesType: "custom folder";
    execute: "execute";
    close: "close";
    cryptomus: "Cryptomus";
    convert: "Convert";
    merge: "Merge";
    paths: {
        home: "/"; // this is the login section when not authorized, and if authorized, then the account section
        sign_up: "/sign_up";
        dashboardHome: "/home";
        profiles: "/profiles";
        proxy: "/proxy";
        account: "/account";
        cookies: "/cookies";
        store: "/store";
        notifications: "/notifications";
        settings: "/settings";
        settings_security: "security";
        settings_personalization: "personalization";
        settings_team: "team";
        settings_notifications: "notifications";
        change_email: "account/change-email";
        change_password: "change-password";
        change_sidebar_menu: "change-sidebar";
        via_email: "via-email";
        via_masq_panel: "via-masq-panel";
        create_folder: "create-folder";
        subscription: "subscription";
        devices: "devices";
        teams: "teams";
        manage: "manage";
        createNewProfile: "/new_profile";
        buySubscriptionPlan: "buy-subscription";
        topUpWallet: "top-up-wallet";
        editProfile: "edit-profile";
        getResolutions: "/v2/profile/hardware/screen";
        getCores: "/v2/profile/hardware/cores";
        getVideoCards: "/v2/profile/hardware/videoCard";
        getRams: "/v2/profile/hardware/ram";
        getCountries: "/v2/profile/countries/";
    };
    endpoints: {
        userLogin: "/v2/user/login";
        registration: "/v2/user/registration";
        confirmEmail: "/v2/user/confirmEmail/";
        userAuth: "/v2/user/auth/";
        getTariffList: "/user/getTariffList/";
        removeSession: "/v2/user/removeSession/";
        logOut: "/v2/user/logout/";
        getAllNotifications: "/v2/message/";
        readAllNotifications: "/v2/message/readAll";
        readNotification: "/v2/message/read";
        checkNameFree: "/v2/user/checkNameFree/";
        sendConfirmCode: "/v2/user/sendConfirmCode";
        sendRecoveryCode: "/v2/user/sendRecoveryCode";
        checkRecoveryCode: "/v2/user/checkRecoveryCode";
        recoveryPassword: "/v2/user/recoveryPassword";
        changeName: "/v2/user/changeName/";
        removeAllSession: "/v2/user/removeAllSession/";
        changePassword: "/v2/user/changePassword/";
        getFolders: "/v2/profile/getFolders";
        createFolder: "/v2/profile/createFolder";
        getProfiles: "/v2/profile/getProfiles/";
        getProfile: "/v2/profile/getProfile/";
        changeEmailSendConfirmCode: "/v2/user/changeEmail/sendConfirmCode";
        confirmCurrentEmail: "/v2/user/changeEmail/confirmCurrentEmail/";
        setNewEmail: "/v2/user/changeEmail/setNewEmail/";
        confirmNewEmail: "/v2/user/changeEmail/confirmNewEmail/";
        setInvitesAccess: "/v2/team/setInvitesAccess/";
        appSettings: "/v2/appSettings";
        sendInviteCode: "/v2/team/sendInviteCode/";
        deleteAccount: "/v2/user/deleteAccount/";
        notificationsSettings: "/v2/notificationSettings/";
        removeOtherSessions: "/v2/user/removeOtherSessions/";
        setupTfa: "/v2/user/tfa/setup";
        verifyTfa: "/v2/user/tfa/verify";
        removeTfa: "/v2/user/tfa/remove";
        payments: "/v2/cryptomus/paymentBalance/";
        paymentsTariff: "/v2/cryptomus/paymentSub/";
        promoCode: "/v2/promoCodes/check/";
        getBrowsers: "/v2/profile/browsers";
        getBrowserVersions: "/v2/profile/browserVersions";
        tariffList: "/v2/sub/tariffList/";
        buySubscriptionPlan: "/v2/sub/buy/";
        changeFolderIcon: "/v2/profile/changeFolderIcon";
        changeFolderName: "/v2/profile/changeFolderName";
        getLanguages: "/v2/profile/languages/";
        getUserAgent: "/v2/profile/userAgent/";
        createProfile: "/v2/profile/create";
        deleteFolder: "/v2/profile/deleteFolder";
        changeTariff: "/v2/sub/changeTariff/";
        changeTeamName: "/v2/team/changeName";
        changeRole: "/v2/team/changeRole";
        getGeocode: "/v2/profile/geocode/";
        checkProxy: "/v2/proxy/check/";
        getSessions: "/v2/user/getSessions/";
        getMemberSession: "/v2/team/getMembersSessions/";
        shareFolder: "/v2/profile/shareFolder/";
        shareProfile: "/v2/profile/shareProfile/";
        deleteProfile: "/v2/profile/deleteProfile/";
        duplicateProfile: "/v2/profile/duplicate";
        updateProfile: "/v2/profile/update";
        moveProfileToFolder: "/v2/profile/moveProfileToFolder/";
        leaveFromTeam: "/v2/team/leave/";
        getTeamsInfo: "/v2/team/getInfo";
        useInviteCode: "/v2/team/useInviteCode/";
        acceptShare: "/v2/profile/acceptShare/";
        removeUserForTeam: "/v2/team/removeUser/";
        addProfilesToFolder: "/v2/profile/addProfilesToFolder/";
        getAppVersion: "/v2/appVersion";
    };
    eventsMsg: {
        types: {
            recoveryPasswordSuccess: "Password successfully recovered";
            passwordChangeSuccess: "Password successfully changed";
            emailChangeSuccess: "Email successfully changed";
        };
        headers: {
            success: "success";
        };
        messages: {
            haveNewPassword: "have_a_new_password";
            haveNewEmail: "have_a_new_email";
            accountSuccessfullyCreated: "account_successfully_created";
        };
    };
    helperModalTypes: {
        endAllSessions: "End All Sessions";
        deleteAccount: "Delete Account";
        chooseSubPlanMethod: "Merge or Convert Subscription Plan";
        leaveTeam: "Leave Team";
        deleteTeamItem: "Delete Team Item";
        deleteFolder: "Delete Folder";
        shareFolder: "Share Folder";
        shareProfile: "Share Profile";
        foundLocalProfiles: "Found Local Profiles";
        exportFolder: "Export Folder";
        importProfiles: "Import Profiles";
    };
    profilesIconsNames: [
        "icon_triangle",
        "icon_trapezoid",
        "icon_rhombus",
        "icon_parallelogram",
        "icon_pentagon",
        "icon_hexagon",
        "icon_frame",
        "icon_rabbet",
        "icon_circle",
        "icon_ellipse",
        "icon_custom_octagonal",
        "icon_custom_square",
        "icon_custom_loading",
        "icon_custom_bevel",
        "icon_custom_up",
        "icon_close"
    ];
    notifyTypes: {
        success: "#0F9918";
        invite: "#560BAD";
        error: "#E50000";
    };
    notificationTypes: {
        invite: "invite";
        share_profile: "share_profile";
        share_profile_folder: "share_profile_folder";
        message: "message";
    };
    userRoleTypes: {
        leader: "leader";
        moder: "moder";
        member: "member";
    };
    appVersionStatusTypes: {
        checking: "checking";
        invalid: "invalid";
        valid: "valid";
    };
    chooseParameterTypes: {
        folder: "Folder";
        name: "Name";
        comment: "Comment";
        os: "OS";
        platform: "Platform";
        browser: "Browser";
        browser_version: "Browser Version";
        screen_resolution: "Screen Resolution";
        cpu: "CPU";
        gpu: "GPU";
        ram: "RAM";
        country: "Country";
        language: "Language";
        timezone: "Timezone";
    };
}

export interface ActiveSubTypes {
    type: string;
    tariffId: string;
    tariffWeight: number;
    buyTime: number;
    duration: number;
    userLimit: number;
    profileLimit: number;
    users: string[];
    owner: string;
    activated: boolean;
    ended: boolean;
    deactivated: boolean;
    createAt: number;
    _id: string;
    end: number;
    start: number;
}

export interface TariffListTypes {
    name: string;
    price: number;
    duration: number;
    userLimit: number;
    profileLimit: number;
    deviceLimit: number;
    userWithAccess: string;
    createAt: number;
    weight: number;
    _id: string;
}

export interface AccountInitialStateTeamsTypes {
    name: string;
    subs: [
        {
            type: string;
            tariffId: string;
            buyTime: number;
            duration: number;
            userLimit: number;
            profileLimit: number;
            owner: string;
            activated: boolean;
            ended: boolean;
            deactivated: boolean;
            createAt: number;
            _id: string;
            end: number;
            start: number;
        }
    ];
    activeSub: {
        type: "Team";
        tariffId: "FRS90WLxSD89YtfM";
        buyTime: number;
        duration: number;
        userLimit: number;
        profileLimit: number;
        owner: string;
        activated: boolean;
        ended: boolean;
        deactivated: boolean;
        createAt: number;
        _id: string;
        end: number;
        start: number;
    };
    userCount: number;
    userLimit: number;
    owner: string;
    role: string;
    inviteCode: string;
    _id: string;
}

export interface MemberSessionsListTypes {
    name: string;
    id: string;
    sessions: {
        os: string;
        cpu: string;
        app: string;
        hash: string;
    }[];
}

export interface TeamsInfoTypes {
    name: string;
    users: {
        id: string;
        name: string;
        email: string;
        dateAdded: number;
        role: string;
    }[];
    owner: {
        id: string;
        name: string;
        email: string;
    };
    inviteCode: string;
    createAt: number;
    _id: string;
    userLimit: number;
    subs: {
        type: string;
        tariffId: string;
        tariffWeight: number;
        buyTime: number;
        duration: number;
        profileLimit: number;
        owner: string;
        activated: boolean;
        ended: boolean;
        deactivated: boolean;
        createAt: number;
        _id: string;
        end: number;
        start: number;
    }[];
    activeSub: {
        type: string;
        tariffId: string;
        tariffWeight: number;
        buyTime: number;
        duration: number;
        profileLimit: number;
        owner: string;
        activated: number;
        ended: number;
        deactivated: number;
        createAt: number;
        _id: string;
        end: number;
        start: number;
    };
}
export interface AccountInitialStateTypes {
    accountLoading: boolean;
    confirmCodeSent: boolean | string;
    recoveryEmail: string;
    isConfirmCodeValid: boolean;
    isConfirmCodeInvalid: boolean;
    isTfaConfirmCodeInvalid: boolean;
    paymentUrl: string;
    paymentTariffUrl: string;
    signInError: string;
    nameError: string;
    passwordStatus: string;
    requiredTfa: boolean;
    promoCodeError: string;
    discountedTariffList: TariffListTypes[];
    tfaInfos: {
        message: string;
        dataURL: string;
        secretKey: string;
    };
    user: {
        name: string;
        email: string;
        balance: number;
        invitesDisabled: boolean;
        type: string;
        messages: {
            header: string;
            headerRus: string;
            text: string;
            textRus: string;
            usersType: string;
            buttonName: string;
            buttonNameRus: string;
            buttonUrl: string;
            _id: string;
        }[];
        emailConfirmed: boolean;
        tfaEnabled: boolean;
        passwordUpdateAt: string | undefined;
        sessions: {
            os: string;
            cpu: string;
            app: string;
            hash: string;
        }[];
    };
    subs: {
        type: string;
        buyTime: number;
        duration: number;
        userLimit: number;
        profileLimit: number;
        users: string[];
        owner: string;
        activated: boolean;
        ended: boolean;
        _id: string;
        end: number;
        start: number;
    }[];
    teams: AccountInitialStateTeamsTypes[];
    memberSessionsList: MemberSessionsListTypes[];
    activeSub: ActiveSubTypes;
    teamsInfo: TeamsInfoTypes;
    token: string;
    hash: string;
    manageTeamInfo: {
        name: string;
        users: {
            name: string;
            email: string;
            dateAdded: number;
            id: string;
            role: string;
        }[];
        owner: {
            name: string;
            email: string;
        };
        inviteCode: string;
        createAt: number;
        _id: string;
        userLimit: number;
        subs: [
            {
                type: string;
                tariffId: string;
                tariffWeight: number;
                buyTime: number;
                duration: number;
                userLimit: number;
                profileLimit: number;
                owner: string;
                activated: boolean;
                ended: boolean;
                deactivated: boolean;
                createAt: number;
                _id: string;
                end: number;
                start: number;
            }
        ];
        activeSub: {
            type: string;
            tariffId: string;
            tariffWeight: number;
            buyTime: number;
            duration: number;
            userLimit: number;
            profileLimit: number;
            owner: string;
            activated: boolean;
            ended: boolean;
            deactivated: boolean;
            createAt: number;
            _id: string;
            end: number;
            start: number;
        };
    };
}

export interface DeviceInfoTypes {
    os: {
        type: string;
        release: string;
        platform: string;
    };
    cpu: {
        model: string;
        speed: number;
        times: {
            user: number;
            nice: number;
            sys: number;
            idle: number;
            irq: number;
        };
    }[];
    hash: string;
}

export interface LocalTariffListTypes {
    name: string;
    price: number;
    duration: number;
    userLimit: number;
    profileLimit: number;
    deviceLimit: number;
}

export interface AppSettingsTypes {
    currency: string;
    sidebar: {
        home: boolean;
        profiles: boolean;
        proxy: boolean;
        account: boolean;
        cookies: boolean;
        store: boolean;
        notifications: boolean;
        settings: boolean;
    };
    sidebarOder: string[];
    sidebarMenuStyle: string;
    defaultScreen: string;
    language: string;
    createAt: number;
}

export interface LocalProfilesTypes {
    attributes: string[];
    id: string;
    name: string;
    comment: string;
    folderId?: string;
    proxy: {
        name: string;
        hostAndPort: string;
        login: string;
        password: string;
    };
    country: {
        name: string;
        code: string;
        flag: string;
    };
    cookies: {
        jsonObj: {};
        string: string;
        file: null;
    };
    resolution: {
        name: string;
        type: string;
        data: {
            width: number;
            height: number;
            colorDepth: number;
        };
        _id: string;
        platforms: string;
    };
    ram: {
        name: string;
        type: string;
        data: {
            amount: string;
        };
        _id: string;
    };
    browser: string;
    browser_version: string;
    cpu: {
        name: string;
        type: string;
        data: {
            amount: string;
        };
        _id: string;
    };
    gpu: {
        name: string;
        type: string;
        data: {
            corp: string;
            model: string;
        };
        _id: string;
    };
    timezone: {
        location: string;
        city: string;
        region: string;
        standard: string;
        daylight: string;
        human: string;
        offset: number;
    };
    language: string[];
    platform: string;
    user_agent: string;
    created_at: string;
    geo: string;
    acceptEncoding: string;
    acceptStr: string;
    jsBaseCode: string;
    jsATDCode: string;
    geocode: {};
    status: string;
}
export interface MainInitialStateTypes {
    mainLoading: boolean;
    appVersion: string;
    appVersionStatus: string;
    tariffList: TariffListTypes[];
    localProfiles: LocalProfilesTypes[];
    deviceInfo: DeviceInfoTypes;
    appSettings: AppSettingsTypes;
    emailNotificationsSettings: InitialNotificationsSettingsTypes;
    appNotificationsSettings: InitialNotificationsSettingsTypes;
}

export interface ProxyInitialStateTypes {
    proxyLoading: boolean;
    geocodeRedux: {};
}

export interface InitialProxyDataTypes {
    hostAndPort: string;
    protocol: string;
    login: string;
    password: string;
    geo: string;
    geocode: {};
    name: string;
    timezone: {
        daylight: string;
        location: string;
        offset: number;
        standard: string;
    };
}

export interface CheckProxyAsyncTypes extends TokenDeviceInfoHashTypes {
    proxyData: InitialProxyDataTypes;
    close?: Function;
    changeProxy?: Function;
    teamInfo: TeamInfoBody;
}

export interface TokenDeviceInfoTypes {
    token: string;
    deviceInfo: DeviceInfoTypes;
}

export interface TokenDeviceInfoHashTypes {
    token: string;
    deviceInfo: DeviceInfoTypes;
    hash: string;
}

export interface GetBrowsersAsyncTypes extends TokenDeviceInfoHashTypes {
    teamInfo: TeamInfoBody;
}

export interface GetFoldersAsyncTypes extends TokenDeviceInfoHashTypes {
    teamInfo: TeamInfoBody;
}
export interface GetHardwareAndCountriesAsyncTypes extends TokenDeviceInfoHashTypes {
    teamInfo: TeamInfoBody;
}

export type NotificationsTypes = {
    header: string;
    headerRus: string;
    text: string;
    textRus: string;
    usersType: string;
    type: string;
    buttonName: string;
    buttonNameRus: string;
    buttonUrl: string;
    createAt: number | string;
    _id: string;
    id: string;
    isRead: boolean;
    code: string;
    teamName: string;
    inviterName: string;
    ownerName: string;
    name: string;
};

export interface NotificationsInitialStateTypes {
    notificationsLoading: boolean;
    isUnread: boolean;
    notificationsList: NotificationsTypes[];
}

export interface FormData {
    name: string;
    email: string;
    password: string;
    repeatPassword: string;
}

export interface CheckNameFreeTypes {
    deviceInfo: DeviceInfoTypes;
    name: string;
    email: string;
}

export interface SignUpInitialStateTypes {
    signUpLoading: boolean;
    isFree: boolean;
    nameError: string;
    emailError: string;
    isCodeSentAgain: string;
    confirmCodeSent: boolean;
}

export interface InitialFormDateTypes {
    name: string;
    nameLocalError: string;
    email: string;
    emailLocalError: string;
    password: string;
    confirmPassword: string;
}

export type ConfirmCodePropsTypes = {
    name: string;
    email?: string;
    confirmTitle: string;
    confirmText: string;
    setRecoveryData?: React.Dispatch<React.SetStateAction<RecoveryDateTypes>>;
    backToSignIn: Function;
    navigateFn?: Function;
};

export interface HelperInputPropsTypes {
    type: string;
    name: string;
    value: string;
    onChange: Function;
    keyDow?: Function;
    isDisable?: boolean;
    errorMessage?: string;
    errorWithoutMessage?: string;
    placeholder?: string;
    onlyErrorInfo?: boolean;
    style?: { width: number; height: number; borderRadius: number; borderColor?: string; top?: string; errorInfoLeft?: number };
}

export interface RecoveryDateTypes {
    name: string;
    recoveryCode: string;
    password: string;
    confirmPassword: string;
}

export interface ReadNotificationAsyncTypes extends TokenDeviceInfoHashTypes {
    ids: string[];
}

export interface SignInFormData {
    name: string;
    password: string;
    isSigned: boolean;
}

export interface LoginAsyncTypes {
    formData: SignInFormData;
    deviceInfo: DeviceInfoTypes;
    tfaToken?: string;
}

export interface RegistrationFormDataTypes {
    name: string;
    email: string;
    password: string;
}
export interface RegistrationAsyncTypes {
    formData: RegistrationFormDataTypes;
    deviceInfo: DeviceInfoTypes;
}

export interface ConfirmEmailAsyncTypes {
    confirmCode: string;
    deviceInfo: DeviceInfoTypes;
}

export interface RemoveSessionAsyncTypes extends TokenDeviceInfoTypes {
    hashToDelete: string;
    myHash: string;
}

export interface NameDeviceInfoTypes {
    deviceInfo: DeviceInfoTypes;
    name: string;
}

export interface CheckRecoveryCodeAsyncTypes {
    deviceInfo: DeviceInfoTypes;
    name: string;
    recoveryCode: string;
}

export interface RecoveryPasswordAsyncTypes {
    deviceInfo: DeviceInfoTypes;
    name: string;
    recoveryCode: string;
    password: string;
    goToSignIn?: Function;
}

export interface ChangeNameAsyncTypes extends TokenDeviceInfoHashTypes {
    name: string;
}

export interface UseInviteCodeAsyncTypes extends TokenDeviceInfoHashTypes {
    code: string;
    teamName: string;
}
export interface AcceptShareAsyncTypes extends TokenDeviceInfoHashTypes {
    id: string;
    acceptType: string;
}

export interface ChangeEmailInitialStateTypes {
    email: string;
    password: string;
    isPasswordConfirmed: boolean;
    passwordLocalError: string;
    newEmail: string;
    newEmailLocalError: string;
    confirmActualEmail: string;
    confirmNewEmail: string;
}
export interface EditedProfileTypes {
    _id: string;
    cookies: string;
    info: {
        os: string;
        platform: string;
        browser: string;
        browser_version: string;
        name: string;
        comment: string;
        timezone: {
            location: string;
            city: string;
            region: string;
            standard: string;
            daylight: string;
            human: string;
            offset: number;
        };
        proxy: {
            name: string;
            protocol: string;
            login: string;
            password: string;
            hostAndPort: string;
        };
        geo: string;
        geocode: {};
        country: { name: string; code: string; flag: string };
    };
}
export interface ChangeEmailAsyncTypes extends TokenDeviceInfoHashTypes {
    email: string;
    password: string;
}

export interface ChangePasswordInitialStateTypes {
    oldPassword: string;
    oldPasswordLocalError: string;
    isOldPasswordConfirmed: boolean;
    newPassword: string;
    newPasswordConfirm: string;
    isForgotPassword: boolean;
    confirmEmail: string;
}

export interface ChangePasswordAsyncTypes extends TokenDeviceInfoHashTypes {
    oldPassword: string;
    newPassword: string;
}

export interface SelectsMenuItemsTypes {
    id: number | string;
    value: string;
    text: string;
    src?: string;
    icon?: string;
    selected?: boolean;
    disabled?: boolean;
}
export interface HardwareAllTypes {
    name?: string;
    platforms?: string;
    code?: string;
    flag?: string;
    type?: string;
    data?: {
        width?: number;
        height?: number;
        colorDepth?: number;
        corp?: string;
        model?: string;
        amount?: string;
    };
    _id?: string;
}
export interface HelperSelectPropsTypes {
    selectValue?: string;
    selectItem?: HardwareAllTypes;
    menuItems?: SelectsMenuItemsTypes[];
    menuItemsList?: HardwareAllTypes[];
    onChange?: Function;
    type?: string;
    customStyles?: {
        height?: string;
        width?: string;
        background?: string;
        borderRadius?: string;
        border?: string;
    };
    disabled?: boolean;
    chooseParameterType?: string;
}

export interface SettingsSliceTypes {
    settingsLoading: boolean;
    passwordStatus: string;
    currentEmailConfirmCodeSent: boolean;
    isConfirmCodeValid: boolean;
    isConfirmCodeInvalid: boolean;
    confirmCodeSent: boolean;
    sidebarMenuStyle: string;
    nameError: string;
    nameSaved: boolean;
    isPasswordForDeleteAccountIncorrect: boolean;
}

export interface SearchItemPropsTypes {
    type: "menuItemsList" | "menuItems";
    menuL?: SelectsMenuItemsTypes[];
    menuIL?: HardwareAllTypes[];
    changeMenuItems: Function;
}

export interface HelperSwitchTypes {
    checked: boolean;
    onChange: Function;
    disabled?: boolean;
}

export interface FoldersItemTypes {
    name: string;
    icon?: string;
    profiles: string[];
    updateAt: number;
    createAt: number;
    _id: string;
}

export interface ProfilesTypes {
    info: {
        platform: string;
        browser: string;
        browser_version: string;
        name: string;
        comment: string;
        geo: string;
        os: string;
        geocode: {};
        AAP: boolean;
        ACP: boolean;
        AFP: boolean;
        AWP: boolean;
        country: {
            name: string;
            code: string;
            flag: string;
        };
        cpu: {
            name: string;
            type: string;
            data: {
                amount: number;
            };
            _id: string;
        };
        gpu: {
            name: string;
            type: string;
            data: {
                corp: string;
                model: string;
            };
            _id: string;
        };
        ram: {
            name: string;
            protocol: string;
            login: string;
            password: string;
            hostAndPort: string;
        };
        resolution: {
            name: string;
            type: string;
            data: {
                width: number;
                height: number;
                colorDepth: number;
            };
            _id: string;
            platforms: string;
        };
        cookies: {
            fileName: string;
            cookies: string;
        };
        proxy: {
            hostAndPort: string;
            login: string;
            name: string;
            password: string;
            protocol: string;
        };
        timezone: TimezoneTypes;
    };
    updateAt: number;
    createAt: number;
    execute?: boolean | undefined;
    _id: string;
}

export interface ProfileEdTypes {
    info: {
        os: string;
        platform: string;
        browser: string;
        browser_version: string;
        name: string;
        comment: string;
        timezone: {
            location: string;
            city: string;
            region: string;
            standard: string;
            daylight: string;
            human: string;
            offset: number;
        };
        proxy: {
            name: string;
            protocol: string;
            login: string;
            password: string;
            hostAndPort: string;
        };
        geo: string;
        geocode: {};
        cookies: {
            fileName: string;
            cookies: string;
        };
        country: {
            name: string;
            code: string;
            flag: string;
        };
        ram: {
            name: string;
            type: string;
            data: {
                amount: string;
            };
            _id: string;
        };
        cpu: {
            name: string;
            type: string;
            data: {
                amount: number;
            };
            _id: string;
        };
        resolution: {
            name: string;
            type: string;
            data: {
                width: number;
                height: number;
                colorDepth: number;
            };
            _id: string;
            platforms: string;
        };
        gpu: {
            name: string;
            type: string;
            data: {
                corp: string;
                model: string;
            };
            _id: string;
        };
        AFP: boolean;
        AWP: boolean;
        AAP: boolean;
        ACP: boolean;
    };
    updateAt: number;
    createAt: number;
    _id: string;
}

export interface GetOneProfileTypes {
    info: {
        os: string;
        platform: string;
        browser: string;
        browser_version: string;
        name: string;
        comment: string;
        timezone: {
            location: string;
            city: string;
            region: string;
            standard: string;
            daylight: string;
            human: string;
            offset: number;
        };
        proxy: {
            name: string;
            protocol: string;
            login: string;
            password: string;
            hostAndPort: string;
        };
        geo: string;
        geocode: {
            title: string;
            id: string;
            resultType: string;
            localityType: string;
            address: {
                label: string;
                countryCode: string;
                countryName: string;
                state: string;
                countyCode: string;
                county: string;
                city: string;
                postalCode: string;
            };
            position: {
                lat: number;
                lng: number;
            };
            mapView: {
                west: number;
                south: number;
                east: number;
                north: number;
            };
            scoring: {
                queryScore: number;
                fieldScore: {
                    city: number;
                };
            };
        };
        country: {
            name: string;
            code: string;
            flag: string;
        };
    };
    name: string;
    cpu: {
        name: string;
        type: string;
        data: {
            amount: number;
        };
        _id: string;
    };
    gpu: {
        name: string;
        type: string;
        data: {
            corp: string;
            model: string;
        };
        _id: string;
    };
    ram: {
        name: string;
        type: string;
        data: {
            amount: string;
        };
        _id: string;
    };
    resolution: {
        name: string;
        type: string;
        data: {
            width: number;
            height: number;
            colorDepth: number;
        };
        _id: string;
        platforms: string;
    };
    cookies: string;
    userAgentStr: string;
    acceptLanguages: string;
    languages: string[];
    acceptEncoding: string;
    acceptStr: string;
    timezoneOffsetStr: string;
    jsBaseCode: string;
    isSummerTime: boolean;
    jsATDCode: string;
    updateAt: number;
    createAt: number;
    _id: string;
}
export interface ProfileInitialStateTypes {
    profilesLoading: boolean;
    folderNameError: string;
    changeFolderNameError: string;
    isChooseParameter: string;
    foldersList: { allProfilesFolder: FoldersItemTypes; favoriteProfilesFolder: FoldersItemTypes; folders: FoldersItemTypes[] };
    allProfilesList: ProfilesTypes[];
    favoriteProfilesList: ProfilesTypes[];
    customFoldersProfilesList: ProfilesTypes[];
    startedProfiles: [string, string, string, { teamId: string; teamName: string }][];
    teamsProfilesList: ProfilesTypes[];
    editedProfileRedux: GetOneProfileTypes;
    teamsFolders: TestTeamsObject;
}

export interface CreateFolderAsyncTypes extends TokenDeviceInfoHashTypes {
    teamInfo: TeamInfoBody;
    name: string;
    icon: string;
    profileIds: string[];
    navigateProfilesPage?: Function;
    isDuplicate?: boolean | undefined;
}

export interface CreateFolderInitialStateTypes {
    name: string;
    icon: string;
    isSelectIconOpen: string;
    profileIds: string[];
}

export interface GetProfilesAsyncTypes extends TokenDeviceInfoHashTypes {
    id: string;
    type?: string;
    teamInfo: TeamInfoBody;
}
export interface GetEditedProfileAsyncTypes extends TokenDeviceInfoHashTypes {
    teamInfo: TeamInfoBody;
    profileId: string;
}
export interface GetTeamsFoldersAsyncTypes extends TokenDeviceInfoHashTypes {
    teams: AccountInitialStateTeamsTypes[];
}
export interface GetLanguagesAsyncTypes extends TokenDeviceInfoHashTypes {
    country: string;
    teamInfo: TeamInfoBody;
}

export interface GetUserAgentAsyncTypes extends TokenDeviceInfoHashTypes {
    params: string;
    teamInfo: TeamInfoBody;
}

export interface SendInviteCodeAsyncTypes extends TokenDeviceInfoHashTypes {
    userName: string;
    team: string;
}

export interface CreateNewProfileAsyncTypes extends TokenDeviceInfoHashTypes {
    newProfile: InitialNewProfileStateTypes;
    closeCreateProfilePage?: Function;
    selectedFolderIcon: string;
    teamInfo: TeamInfoBody;
    isConvert?: number;
    isImported?: boolean;
    folderId?: string;
}
export interface ConfirmCurrentEmailTypes extends TokenDeviceInfoHashTypes {
    currentEmailConfirmCode: string;
}

export interface SetNewEmailAsyncTypes extends TokenDeviceInfoHashTypes {
    email: string;
    password: string;
}

export interface ConfirmNewEmailAsyncTypes extends TokenDeviceInfoHashTypes {
    newEmailConfirmCode: string;
    email: string;
    fn: Function;
}

export interface TeamInfoBody {
    teamId: string;
    teamName: string;
}

export interface ProfileSearchListTypes {
    id: string;
    name: string;
    road: string;
    path: string;
}

export interface ConvertTeamInfoResultTypes {
    pathname: string;
    teamInfo: TeamInfoBody;
}

export interface SetInvitesAccessAsyncTypes extends TokenDeviceInfoHashTypes {
    enable: boolean;
}

export interface SetAppSettingsAsyncTypes extends TokenDeviceInfoHashTypes {
    appSettings: AppSettingsTypes;
}

export interface SettingsSecurityInitialStateTypes {
    isDeleteAccountModalOpen: boolean;
    isTfaModalOpen: boolean;
}

export interface DeleteAccountAsyncTypes extends TokenDeviceInfoHashTypes {
    password: string;
}

export interface GetNotificationsSettingsAsyncTypes extends TokenDeviceInfoHashTypes {
    receiverType: string;
}

export interface InitialNotificationsSettingsTypes {
    all: boolean;
    message: boolean;
    invite: boolean;
    share_profile: boolean;
    share_profile_folder: boolean;
    update: boolean;
    subscription: boolean;
    marketing: boolean;
    gifts: boolean;
    news: boolean;
}

export interface SetNotificationsSettingsAsyncTypes extends TokenDeviceInfoHashTypes {
    receiverType: string;
    notificationsSettings: InitialNotificationsSettingsTypes;
}
export interface ExportProfileOrCookiesAsyncTypes extends TokenDeviceInfoHashTypes {
    teamInfo: TeamInfoBody;
    profileId: string;
    exportType: string;
}

export interface ExportProfilesAsyncTypes extends TokenDeviceInfoHashTypes {
    teamInfo: TeamInfoBody;
    profileIds: string[];
}

export interface TfaInitialStateTypes {
    canScan: boolean;
    isVerifyPageOpen: boolean;
    confirmCode: string;
    isCopied: boolean;
}

export interface VerifyTwoFactorAuthenticationAsyncTypes extends TokenDeviceInfoHashTypes {
    confirmCode: string;
    closeModalFn: Function;
}

export interface SignInInitialFormDataTypes {
    name: string;
    password: string;
    isSigned: boolean;
    tfaToken: string;
}

export interface HelperSearchTypes {
    style?: {
        width?: string;
        height?: string;
        fontSize?: string;
        iconTop?: string;
        iconLeft?: string;
        iconWidth?: number;
        borderRadius?: string;
        inpPaddingLeft?: string;
    };
    placeholder: string;
}

export interface AccountPageInitialStateTypes {
    isSearchOpen: boolean;
    isAccountMoreOptionOpen: boolean;
    searchValue: string;
}

export interface AccountMoreOptionsItemsTypes {
    id: string;
    logo: Function;
    name: string;
    path: string;
}

export interface SearchDataRoadTypes {
    id: string;
    name: string;
    path: string;
}

export interface SearchDataTypes {
    id: string;
    path: string;
    name: string;
    type: string;
    road: SearchDataRoadTypes[];
    disabled?: boolean;
}
export interface RouteType {
    id: string;
    path: string;
    element: JSX.Element;
}
export interface StepZeroPropsTypes {
    initialValues: {
        allFoldersNameList: SelectsMenuItemsTypes[];
        profileName: string;
        changeProfileName: Function;
        name: string;
        changeName: Function;
        comment: string;
        changeComment: Function;
    };
    changeStep: Function;
}

export interface StepOnePropsTypes {
    initialValues: {
        os: string;
        changeOs: Function;
        platform: string;
        changePlatform: Function;
        browser: string;
        changeBrowser: Function;
        browserVersion: string;
        changeBrowserVersion: Function;
    };
    changeStep: Function;
}

export interface StepTwoPropsTypes {
    initialValues: {
        resolution: ResolutionTypes;
        changeResolution: Function;
        cpu: CPUTypes;
        changeCPU: Function;
        gpu: GPUTypes;
        changeGPU: Function;
        ram: RAMTypes;
        changeRAM: Function;
    };
    os: string;
    changeStep: Function;
}

export interface StepThreePropsTypes {
    initialValues: {
        country: CountryTypes;
        changeCountry: Function;
        language: string[];
        changeLanguage: Function;
        timezone: TimezoneTypes;
        changeTimezone: Function;
    };
    changeStep: Function;
}

export interface StepFourPropsTypes {
    initialValues: {
        AFP: boolean;
        AWP: boolean;
        AAP: boolean;
        ACP: boolean;
        changeFingerprintValues: Function;
        proxy: { name: string; protocol: string; login: string; password: string; hostAndPort: string };
        changeProxy: Function;
        cookies: { fileName: string; cookies: string };
        changeCookies: Function;
        geo: string;
    };
    changeStep: Function;
}

export interface GetBrowserVersionTypes extends TokenDeviceInfoHashTypes {
    info: string;
    teamInfo: TeamInfoBody;
}

export interface GetManageTeamsInfoAsyncTypes extends TokenDeviceInfoHashTypes {
    team: string;
}

export interface DeleteManageTeamItemAsyncTypes extends TokenDeviceInfoHashTypes {
    teamId: string;
    userId: string;
}
export interface GetGeocodeTypesAsync extends TokenDeviceInfoHashTypes {
    geolocation: string;
    teamInfo: TeamInfoBody;
}

export interface NotifyInitialStateTypes {
    notify: {
        notifyId?: string;
        type?: string;
        title?: string;
        subTitle?: string;
        duration?: number;
    };
}

export interface UsernameBalanceTypes {
    modalRef: React.RefObject<HTMLDivElement> | null;
    isOpen: boolean;
    changeOpen: Function;
}

export interface BuyPlanInitialStateTypes {
    isAccountMoreOptionOpen: boolean;
    buyYearly: boolean;
    subName: string;
    subPrice: string;
    subId: string;
    subWeight: number;
}

export interface PayForSubInitialStateTypes {
    promoCode: string;
    isPromoCodeOpen: boolean;
    isPaymentMethodOpen: boolean;
    paymentMethod: string;
}

export interface PaymentsAsyncAsync extends TokenDeviceInfoHashTypes {
    price: string;
    currency: string;
}

export interface PaymentsTariffAsyncAsync extends TokenDeviceInfoHashTypes {
    tariffId: string;
    teamId: string | undefined;
    currency: string;
    promoCode?: string;
}

export interface PayForSubscriptionPlanTypes {
    price: string;
    name: string;
    subId: string;
}

export interface CheckPromoCodeAsyncTypes extends TokenDeviceInfoHashTypes {
    promocode: string;
}

export interface TopUpInitialStateTypes {
    isAccountMoreOptionOpen: boolean;
    isPaymentPageOpen: boolean;
    price: string;
}

export interface TopUpPaymentPageTypes {
    price: string;
    closePaymentFn: Function;
}

export interface BuySubscriptionPlanAsyncTypes extends TokenDeviceInfoHashTypes {
    subId: string;
    promoCode?: string;
    isTeam: boolean;
    closePaymentPageFn: Function;
    renewTeamId: string | undefined;
    subName: string;
}

export interface TopUpBalanceModalTypes {
    price: string;
    subId: string;
    closeModalFn: Function;
}
export interface FolderPageInitialStateTypes {
    isSelectIconOpen: boolean;
    changingName: boolean;
    searchProfile: string;
}
export interface ChangeFolderIconAsyncTypes extends TokenDeviceInfoHashTypes {
    id: string;
    icon: string;
    teamInfo: TeamInfoBody;
}
export interface ChangeFolderNameAsyncTypes extends TokenDeviceInfoHashTypes {
    id: string;
    name: string;
    teamInfo: TeamInfoBody;
}

export interface HelperMoreItemsMenuItemsTypes {
    id: string;
    icon: Function;
    name: string;
    callBack: Function;
    disabled?: boolean;
}
export interface HelperMoteItemsTypes {
    menuItems: HelperMoreItemsMenuItemsTypes[];
    profileId?: string;
    fromFolderId?: string;
}
export interface SelectedProfileParameter {
    text: string;
    value: string;
    step: string;
}
export interface OldStartedProfilesTypes {
    idForServer: string;
    idForElectron: string;
    type: string;
    teamInfo: TeamInfoBody;
    intervalId: NodeJS.Timer;
}

export interface ResolutionTypes {
    name: string;
    type: string;
    data: {
        width: number;
        height: number;
        colorDepth: number;
    };
    _id: string;
    platforms: string;
}
export interface CPUTypes {
    name: string;
    type: string;
    data: {
        amount: string;
    };
    _id: string;
}
export interface GPUTypes {
    name: string;
    type: string;
    data: {
        corp: string;
        model: string;
    };
    _id: string;
}
export interface RAMTypes {
    name: string;
    type: string;
    data: {
        amount: string;
    };
    _id: string;
}

export interface CountryTypes {
    name: string;
    code: string;
    flag: string;
}
export interface TimezoneTypes {
    location: string;
    city: string;
    region: string;
    standard: string;
    daylight: string;
    human: string;
    offset: number;
}
export interface InitialNewProfileStateTypes {
    folderId: string;
    name: string;
    os: string;
    platform: string;
    browser: string;
    browserVersion: string;
    resolution: ResolutionTypes;
    cpu: CPUTypes;
    gpu: GPUTypes;
    ram: RAMTypes;
    country: CountryTypes;
    language: string[];
    timezone: TimezoneTypes;
    proxy: {
        name: string;
        protocol: string;
        login: string;
        password: string;
        hostAndPort: string;
    };
    geo: string;
    geocode: {};
    cookies: { fileName: string; cookies: string };
    AFP: boolean;
    AWP: boolean;
    AAP: boolean;
    ACP: boolean;
    user_agent: string;
    comment: string;
    acceptEncoding: string; // Will be added after purchasing a profile.
    acceptStr: string; // Will be added after purchasing a profile.
    jsBaseCode: string; // Will be added after purchasing a profile.
    jsATDCode: string; // Will be added after purchasing a profile.
}
export interface InitialNewProfileSliceTypes {
    newProfileLoading: boolean;
    browsers: {}; //--->> os, platforms, browsers
    browserVersions: [];
    resolutionsList: ResolutionTypes[];
    cpuList: CPUTypes[];
    gpuList: GPUTypes[];
    ramList: RAMTypes[];
    countriesList: CountryTypes[];
    languages: string[];
    userAgent: string;
    randomProfileData: InitialNewProfileStateTypes;
}

export interface OffsetsTypes {
    location: string;
    city: string;
    region: string;
    standard: string;
    daylight: string;
    human: string;
    offset: number;
}

export interface EventsModalTypes {
    isEventsMessage: {
        type: string;
        header: string;
        message: string;
        customMessage?: string;
        iconName?: string;
    };
}

export interface FolderPageMoreItemsTypes {
    id: string;
    icon: Function;
    name: string;
    callBack: Function;
    disabled?: boolean;
}

export interface DeleteFolderAsyncTypes extends TokenDeviceInfoHashTypes {
    id: string;
    navigateFn: Function;
    teamInfo: TeamInfoBody;
}

export interface HelperModalTypes {
    type: string;
    configs?: {
        renewTeamId?: string;
        teamName?: string;
        id?: string;
        folderName?: string;
        folderIcon?: string;
        profileName?: string;
        userName?: string;
        userId?: string;
        teamId?: string;
        folderId?: string;
        type?: string;
        profilesList?: ImportNewProfileTypes[];
    };
    methodForBuySub: string;
    isMergeOrConvertPageOpen: boolean;
}

export interface HelperModalInitialStateTypes {
    password: string;
    showPassword: boolean;
    emailOrNickname: string;
    exportProfileIds: string[];
    isProfileLimitExceeded: boolean;
}

export interface ChangeTariffAsyncTypes extends TokenDeviceInfoHashTypes {
    subId: string;
    tariffId: string;
    subName: string;
}

export interface ChangeTeamNameAsyncTypes extends TokenDeviceInfoHashTypes {
    teamId: string;
    newName: string;
}

export interface ChangeRoleAsyncTypes extends TokenDeviceInfoHashTypes {
    teamId: string;
    role: string;
    userId: string;
}
export interface ProxySettingsPropsTypes {
    close: Function;
    proxy: { name: string; protocol: string; login: string; password: string; hostAndPort: string };
    changeProxy: Function;
    geo: string;
}
export interface CookiesSettingsPropsTypes {
    close: Function;
    cookies: { fileName?: string; cookies: string };
    changeCookies: Function;
}

export interface GetMemberSessionsAsyncTypes extends TokenDeviceInfoHashTypes {
    team: string;
}

export interface FolderPageMoreItemsMenuItemsTypes {
    itemId?: string;
}

export interface DeleteFolderAsyncTypes extends TokenDeviceInfoHashTypes {
    id: string;
    navigateFn: Function;
}

export interface ShareFolderAsyncTypes extends TokenDeviceInfoHashTypes {
    id: string;
    userName: string;
    teamInfo: TeamInfoBody;
}

export interface ShareProfileAsyncTypes extends TokenDeviceInfoHashTypes {
    id: string;
    userName: string;
    teamInfo: TeamInfoBody;
}

export interface DeleteProfileAsyncTypes extends TokenDeviceInfoHashTypes {
    id: string;
    teamInfo: TeamInfoBody;
}
export interface DuplicateProfileAsyncTypes extends TokenDeviceInfoHashTypes {
    folderId: string;
    profileId: string;
    teamInfo: TeamInfoBody;
    type: string;
    id: string;
}
export interface UpdateProfileAsyncTypes extends TokenDeviceInfoHashTypes {
    teamInfo: TeamInfoBody;
    editedProfile: EditedProfileTypes;
    back: Function;
}

export interface ChangeCookiesAsyncTypes extends TokenDeviceInfoHashTypes {
    teamInfo: TeamInfoBody;
    cookies: string;
    profileId: string;
}

export interface MoveProfileToFolderAsyncTypes extends TokenDeviceInfoHashTypes {
    profileId: string;
    fromFolderId: string;
    toFolderId: string;
    teamInfo: TeamInfoBody;
}

export interface LeaveFromTeamAsyncTypes extends TokenDeviceInfoHashTypes {
    teamId: string;
}

export interface AddProfilesToFolderAsyncTypes extends TokenDeviceInfoHashTypes {
    folderId: string;
    profileIds: string[];
    teamInfo: TeamInfoBody;
}

export interface TestProfileList {
    name: string;
    profiles: string[];
    updateAt: number;
    createAt: number;
    _id: string;
}

export interface TestCustomFolder {
    name: string;
    icon: string;
    profiles: string[];
    updateAt: number;
    createAt: number;
    _id: string;
}

export interface TestTeam {
    allProfilesList: TestProfileList;
    favoriteProfilesList: TestProfileList;
    customFoldersProfilesList: TestCustomFolder[];
}

export interface TestTeamsObject {
    [key: string]: TestTeam;
}

export interface HomeInitialStateTypes {
    isAccountMoreOptionOpen: boolean;
}

export interface UpdateCheckTypes {
    [key: string]: JSX.Element | undefined;
}

export interface ImportNewProfileTypes {
    acceptEncoding: string;
    acceptLanguages: string;
    acceptStr: string;
    folderId: string;
    AAP: boolean;
    ACP: boolean;
    AFP: boolean;
    AWP: boolean;
    info: {
        platform: string;
        browser: string;
        browser_version: string;
        name: string;
        comment: string;
        geo: string;
        os: string;
        geocode: {};
        country: {
            name: string;
            code: string;
            flag: string;
        };

        proxy: {
            hostAndPort: string;
            login: string;
            name: string;
            password: string;
            protocol: string;
        };
        timezone: TimezoneTypes;
    };
    cpu: {
        name: string;
        type: string;
        data: {
            amount: string;
        };
        _id: string;
    };
    gpu: {
        name: string;
        type: string;
        data: {
            corp: string;
            model: string;
        };
        _id: string;
    };
    ram: {
        data: { amount: string };
        name: string;
        type: string;
        _id: string;
    };
    resolution: {
        name: string;
        type: string;
        data: {
            width: number;
            height: number;
            colorDepth: number;
        };
        _id: string;
        platforms: string;
    };
    cookies: {
        fileName: string;
        cookies: string;
    };
    languages: string[];
    updateAt: number;
    createAt: number;
    userAgentStr: string;
    jsBaseCode: string;
    jsATDCode: string;
    execute?: boolean | undefined;
    _id: string;
}

export interface HelpersProfileConverterTypes {
    localProfiles?: LocalProfilesTypes[];
    importedNewProfiles?: ImportNewProfileTypes[];
    isImportProfile?: boolean;
}

export interface GenerateRandomProfileAsyncTypes extends TokenDeviceInfoHashTypes {
    teamInfo: TeamInfoBody;
    folderId: string;
    browsers: {};
}
