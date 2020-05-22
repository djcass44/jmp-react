/*
 *    Copyright 2020 Django Cass
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 */

import {PersistConfig} from "redux-persist/es/types";
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import {GenericActionType, SET_GENERIC_SEARCH, SET_GRID_WIDTH, SET_THEME_MODE} from "../actions/Generic";

export interface GenericState {
	themeMode: string;
	searchFilter: string;
	version: string;
	gridWidth: number;
}

const wantedTheme = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";

const initialState: GenericState = {
	themeMode: wantedTheme,
	searchFilter: "",
	version: "",
	gridWidth: 0
};

const generic = (state = initialState, action: GenericActionType): GenericState => {
	switch (action.type) {
		case SET_THEME_MODE:
			return {...state, themeMode: action.payload};
		case SET_GRID_WIDTH:
			return {...state, gridWidth: action.payload};
		case SET_GENERIC_SEARCH:
			return {...state, searchFilter: action.payload};
		default:
			return state;
	}
};
const persistConfig: PersistConfig<GenericState> = {
	key: "jmp-generic",
	storage,
	whitelist: ["themeMode"]
};
export default persistReducer(persistConfig, generic);