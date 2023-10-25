import { createSlice } from "@reduxjs/toolkit";
import { NotifyInitialStateTypes } from "../../types";
import { constants } from "../../assets/constants";
import { v4 as uuid } from "uuid";

const {
    notifyTypes: { success },
} = constants;

const initialState: NotifyInitialStateTypes = {
    notify: {
        notifyId: "", // No need to specify it
        type: "",
        title: "",
        subTitle: "",
        duration: 5000,
    },
};

const notifySlice = createSlice({
    name: "notify",
    initialState,
    reducers: {
        showNotifyRedux(state, action) {
            const notify = {
                ...action.payload,
                notifyId: uuid(),
            };
            state.notify = notify;
        },
        hideNotifyRedux(state) {
            state.notify = initialState.notify;
        },
    },
});

export const { showNotifyRedux, hideNotifyRedux } = notifySlice.actions;
export default notifySlice.reducer;
