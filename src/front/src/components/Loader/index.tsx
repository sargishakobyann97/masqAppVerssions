import { useAppSelector } from "../../store";
import styles from "./loader.module.scss";

function Loader() {
    const {
        account: { accountLoading },
        main: { mainLoading },
        notifications: { notificationsLoading },
        signUp: { signUpLoading },
        settings: { settingsLoading },
        profiles: { profilesLoading },
        newProfileSlice: { newProfileLoading },
        proxy: { proxyLoading },
    } = useAppSelector((state) => state);

    const loading = [
        accountLoading,
        mainLoading,
        notificationsLoading,
        signUpLoading,
        settingsLoading,
        profilesLoading,
        newProfileLoading,
        proxyLoading,
    ].some((l) => l);

    if (!loading) return <></>;

    return (
        <div className={styles.loader_wrapper}>
            <div id={styles.preloader}>
                <div id={styles.loader}></div>
            </div>
        </div>
    );
}

export default Loader;
