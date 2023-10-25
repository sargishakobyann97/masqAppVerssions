import { useEffect } from "react";
import Listeners from "./components/Listeners";
import Loading from "./components/Loader";
import EventsModal from "./components/helpersComponents/EventsModal";
import HelperModal from "./components/helpersComponents/HelperModal";
import Notify from "./components/helpersComponents/Notify";
import Router from "./router";
import { useAppDispatch, useAppSelector } from "./store";
import { getAppVersionAsync } from "./store/features/mainSlice";
import { constants } from "./assets/constants";
import UpdateCheck from "./components/UpdateCheck";

function App() {
    const { appVersionStatusTypes } = constants;
    const dispatch = useAppDispatch();
    const {
        main: { appVersion, appVersionStatus },
    } = useAppSelector((state) => state);

    useEffect(() => {
        dispatch(getAppVersionAsync());
    }, [appVersion]);

    if (appVersionStatus !== appVersionStatusTypes.valid) return <UpdateCheck appVersionStatus={appVersionStatus} />;

    return (
        <div>
            <Router />
            <Listeners />
            <EventsModal />
            <Notify />
            <Loading />
            <HelperModal />
        </div>
    );
}

export default App;
