import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import accountSlice from "./features/accountSlice";
import mainSlice from "./features/mainSlice";
import notificationsSlice from "./features/notificationsSlice";
import signUpSlice from "./features/signUpSlice";
import settingsSlice from "./features/settingsSlice";
import eventsModalSlice from "./features/eventsModalSlice";
import profilesSlice from "./features/profilesSlice";
import newProfileSlice from "./features/newProfileSlice";
import notifySlice from "./features/notifySlice";
import helperModalSlice from "./features/helperModalSlice";
import proxySlice from "./features/proxySlice";

export const store = configureStore({
    reducer: {
        main: mainSlice,
        account: accountSlice,
        notifications: notificationsSlice,
        signUp: signUpSlice,
        settings: settingsSlice,
        eventsModal: eventsModalSlice,
        profiles: profilesSlice,
        newProfileSlice: newProfileSlice,
        notify: notifySlice,
        helperModal: helperModalSlice,
        proxy: proxySlice,
    },
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
