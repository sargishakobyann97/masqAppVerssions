import { createSlice } from "@reduxjs/toolkit";
import { HelperModalTypes } from "../../types";
import { constants } from "../../assets/constants";

const { merge, convert } = constants;

const initialState: HelperModalTypes = {
    type: "",
    configs: {},
    methodForBuySub: convert,
    isMergeOrConvertPageOpen: false,
};

const helperModalSlice = createSlice({
    name: "helperModal",
    initialState,
    reducers: {
        setHelperModalTypeRedux(state, action) {
            state.type = action.payload.type || initialState.type;
            state.configs = action.payload.configs || initialState.configs;
        },
        setHelperModalMethodForBuySubRedux(state, action) {
            state.methodForBuySub = action.payload;
            state.type = initialState.type;
            state.isMergeOrConvertPageOpen = true;
        },
        setHelperModalMethodToMerge(state) {
            state.isMergeOrConvertPageOpen = true;
            state.methodForBuySub = merge;
        },
        resetHelperModalTypeRedux(state) {
            state.type = initialState.type;
        },
        resetHelperModalStateToInitialRedux(state) {
            state.type = initialState.type;
            state.methodForBuySub = initialState.methodForBuySub;
            state.isMergeOrConvertPageOpen = initialState.isMergeOrConvertPageOpen;
            state.configs = initialState.configs;
        },
        resetHelperModalConfigsRedux(state) {
            state.configs = initialState.configs;
        },
        changeModalConfigsRedux(state, action) {
            state.configs = {
                ...state.configs,
                [action.payload.type]: action.payload.value,
            };
        },
    },
});

export const {
    setHelperModalTypeRedux,
    resetHelperModalTypeRedux,
    resetHelperModalStateToInitialRedux,
    setHelperModalMethodForBuySubRedux,
    setHelperModalMethodToMerge,
    resetHelperModalConfigsRedux,
    changeModalConfigsRedux,
} = helperModalSlice.actions;

export default helperModalSlice.reducer;
