import { createSlice } from "@reduxjs/toolkit";
import { EventsModalTypes } from "../../types";

const initialState: EventsModalTypes = {
    isEventsMessage: {
        type: "",
        header: "",
        message: "",
        customMessage: "",
        iconName: "",
    },
};

const eventsModalSlice = createSlice({
    name: "eventsModal",
    initialState,
    reducers: {
        setEventsMessageRedux(state, action) {
            state.isEventsMessage = action.payload || initialState.isEventsMessage;
        },
        resetByDefaultEventsMessageRedux(state) {
            state.isEventsMessage = initialState.isEventsMessage;
        },
        resetEventsModalStateToInitialRedux(state) {
            state.isEventsMessage = initialState.isEventsMessage;
        },
    },
});

export const { setEventsMessageRedux, resetByDefaultEventsMessageRedux, resetEventsModalStateToInitialRedux } = eventsModalSlice.actions;

export default eventsModalSlice.reducer;
