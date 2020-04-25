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

import prefersColorScheme from "prefers-color-scheme";
import {Action} from "../../types";
import {GENERIC_FILTER_SET} from "../../actions/Generic";
import {SET_THEME_MODE} from "../actions/Generic";

export interface GenericState {
	themeMode: string;
	searchFilter: string;
	version: string;
}

const wantedTheme = prefersColorScheme();

const initialState: GenericState = {
	themeMode: wantedTheme,
	searchFilter: "",
	version: ""
};

export default (state = initialState, action: Action) => {
	switch (action.type) {
		case SET_THEME_MODE:
			return {...state, themeMode: action.payload};
		case GENERIC_FILTER_SET:
			return {...state, searchFilter: action.payload};
		default:
			return state;
	}
}