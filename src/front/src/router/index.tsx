import { Route, Routes } from "react-router-dom";
import { constants } from "../assets/constants";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Dashboard from "../components/Dashboard";
import Account from "../components/PrivatePages/Account";
import Home from "../components/PrivatePages/Home";
import Profiles from "../components/PrivatePages/Profiles";
import Proxy from "../components/PrivatePages/Proxy";
import Cookies from "../components/PrivatePages/Cookies";
import Store from "../components/PrivatePages/Store";
import Notifications from "../components/PrivatePages/Notifications";
import Settings from "../components/PrivatePages/Settings";
import SettingsAccount from "../components/PrivatePages/Settings/SettingsAccount";
import SettingsSecurity from "../components/PrivatePages/Settings/SettingsSecurity";
import SettingsPersonalization from "../components/PrivatePages/Settings/SettingsPersonalization";
import SettingsTeam from "../components/PrivatePages/Settings/SettingsTeam";
import SettingsNotifications from "../components/PrivatePages/Settings/SettingsNotifications";
import ChangeEmail from "../components/PrivatePages/Settings/SettingsSecurity/ChangeEmail";
import ChangePassword from "../components/PrivatePages/Settings/SettingsSecurity/ChangePassword";
import ChangeSidebarMenu from "../components/PrivatePages/Settings/SettingsPersonalization/ChangeSidebarMenu";
import NotificationsViaEmail from "../components/PrivatePages/Settings/SettingsNotifications/NotificationsViaEmail";
import NotificationsViaMasqPanel from "../components/PrivatePages/Settings/SettingsNotifications/NotificationsViaMasqPanel";
import CreateFolder from "../components/PrivatePages/Profiles/CreateFolder";
import FolderPage from "../components/PrivatePages/Profiles/FolderPage";
import SubscriptionInfo from "../components/PrivatePages/Account/accountPages/SubscriptionInfo";
import DevicesInfo from "../components/PrivatePages/Account/accountPages/DevicesInfo";
import TeamsInfo from "../components/PrivatePages/Account/accountPages/TeamsInfo";
import NewProfile from "../components/PrivatePages/Profiles/NewProfile";
import { useAppSelector } from "../store";
import { RouteType } from "../types";
import BuySubscriptionPlan from "../components/PrivatePages/Account/accountPages/BuySubscriptionPlan";
import TopUpWallet from "../components/PrivatePages/Account/accountPages/TopUpWallet";
import TeamsManage from "../components/PrivatePages/Account/accountPages/TeamsInfo/TeamsManage";
import EditProfile from "../components/PrivatePages/Profiles/EditProfile";
const { paths } = constants;

const publicRoutes: RouteType[] = [
    { id: "SignIn", path: paths.home, element: <SignIn /> },
    { id: "SignUp", path: paths.sign_up, element: <SignUp /> },
    { id: "other", path: "*", element: <SignIn /> },
];
const privateRoutes: RouteType[] = [
    { id: "Home", path: paths.dashboardHome, element: <Home /> },
    { id: "Profiles", path: paths.profiles, element: <Profiles /> },
    { id: "Proxy", path: paths.proxy, element: <Proxy /> },
    { id: "Account", path: paths.account, element: <Account /> },
    { id: "Cookies", path: paths.cookies, element: <Cookies /> },
    { id: "Store", path: paths.store, element: <Store /> },
    { id: "Notifications", path: paths.notifications, element: <Notifications /> },
    { id: "Settings", path: paths.settings, element: <Settings /> },
    { id: "None", path: "/none", element: <></> },
    {
        id: "Profiles_Create_Folder",
        path: paths.profiles + "/" + paths.create_folder,
        element: <CreateFolder />,
    },
    {
        id: "Profiles_Folder_Page",
        path: paths.profiles + "/:id",
        element: <FolderPage />,
    },
    {
        id: "Account_Subscription_Info",
        path: paths.account + "/" + paths.subscription,
        element: <SubscriptionInfo />,
    },
    {
        id: "Account_Devices_Info",
        path: paths.account + "/" + paths.devices,
        element: <DevicesInfo />,
    },
    {
        id: "Account_Teams_Info",
        path: paths.account + "/" + paths.teams,
        element: <TeamsInfo />,
    },
    {
        id: "Account_Buy_Subscription_plan",
        path: paths.account + "/" + paths.buySubscriptionPlan,
        element: <BuySubscriptionPlan />,
    },
    {
        id: "NewProfile",
        path: paths.createNewProfile + "/:id",
        element: <NewProfile />,
    },
    {
        id: "Account_Top_Up_Wallet",
        path: paths.account + "/" + paths.topUpWallet,
        element: <TopUpWallet />,
    },
    {
        id: "Account_Teams_Manage",
        path: paths.account + "/" + paths.teams + "/:id",
        element: <TeamsManage />,
    },
    {
        id: "Profile_Edit_Profile",
        path: paths.profiles + "/" + paths.editProfile + "/:id",
        element: <EditProfile />,
    },
    {
        id: "Profile_Edit_Profilecc",
        path: paths.profiles + "/" + paths.create_folder + "/:id",
        element: <CreateFolder />,
    },
    { id: "other", path: "*", element: <Account /> },
];

const settingsRoutes = [
    { id: "Settings_Account", element: <SettingsAccount />, index: true },
    { id: "Settings_Security", path: paths.settings_security, element: <SettingsSecurity /> },
    {
        id: "Settings_Personalization",
        path: paths.settings_personalization,
        element: <SettingsPersonalization />,
    },
    { id: "Settings_Team", path: paths.settings_team, element: <SettingsTeam /> },
    {
        id: "Settings_Notifications",
        path: paths.settings_notifications,
        element: <SettingsNotifications />,
    },
    { id: "Settings_Security_Change_Email", path: paths.settings + "/" + paths.change_email, element: <ChangeEmail /> },
    {
        id: "Settings_Security_Change_Password",
        path: paths.settings_security + "/" + paths.change_password,
        element: <ChangePassword />,
    },
    {
        id: "Settings_Personalization_Change_Sidebar_Menu",
        path: paths.settings_personalization + "/" + paths.change_sidebar_menu,
        element: <ChangeSidebarMenu />,
    },
    {
        id: "Settings_Notifications_Via_Email",
        path: paths.settings_notifications + "/" + paths.via_email,
        element: <NotificationsViaEmail />,
    },
    {
        id: "Settings_Notifications_Via_Masq_Panel",
        path: paths.settings_notifications + "/" + paths.via_masq_panel,
        element: <NotificationsViaMasqPanel />,
    },
];

function Router() {
    const {
        account: {
            user: { emailConfirmed },
        },
        main: {
            appSettings: { sidebarOder },
        },
    } = useAppSelector((state) => state);

    return emailConfirmed && sidebarOder.length ? (
        <Dashboard>
            <Routes>
                {privateRoutes.map(({ path, element, id }) =>
                    path !== paths.settings ? (
                        <Route path={path} element={element} key={id} />
                    ) : (
                        <Route path={paths.settings} key={id} element={element}>
                            {settingsRoutes.map(({ id, path, element, index }) => (
                                <Route path={path} element={element} key={id} index={!!index} />
                            ))}
                        </Route>
                    )
                )}
            </Routes>
        </Dashboard>
    ) : (
        <Routes>
            {publicRoutes.map(({ path, element, id }) => (
                <Route path={path} element={element} key={id} />
            ))}
        </Routes>
    );
}

export default Router;
