import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {Object} The initial state.
 */
export const createInitialDefaultSettingsState = () => get( window, "wpseoScriptData.defaultSettings", {} );

const slice = createSlice( {
	name: "defaultSettings",
	initialState: createInitialDefaultSettingsState(),
	reducers: {},
} );

export const defaultSettingsSelectors = {
	selectDefaultSetting: ( state, setting, defaultValue = {} ) => get( state, `defaultSettings.${ setting }`, defaultValue ),
	selectDefaultSettings: state => get( state, "defaultSettings", {} ),
};

export const defaultSettingsActions = slice.actions;

export default slice.reducer;
