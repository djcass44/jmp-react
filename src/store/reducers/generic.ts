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

import {Action} from "../../types";
import {GENERIC_FILTER_SET, GENERIC_GET_VERSION, GENERIC_SET_SORT, SOCKET_APP_INIT} from "../../actions/Generic";
import {LS_APPID, LS_DARK, LS_SORT} from "../../constants";
import prefersColorScheme from "prefers-color-scheme";
import {SET_THEME_MODE} from "../actions/Generic";

export interface GenericState {
	themeMode: string;
	searchFilter: string;
	sort: string;
	version: string;
}

const wantedTheme = prefersColorScheme();
const initialTheme = localStorage.getItem(LS_DARK);

const initialState: GenericState = {
	themeMode: initialTheme || wantedTheme,
	searchFilter: "",
	sort: "",
	version: ""
};

export default (state = initialState, action: Action) => {
	switch (action.type) {
		case SET_THEME_MODE:
			return {...state, themeMode: action.payload};
		case GENERIC_FILTER_SET:
			return {...state, searchFilter: action.payload};
		case GENERIC_SET_SORT:
			localStorage.setItem(LS_SORT, action.payload);
			return {...state, sort: action.payload};
		case `${GENERIC_GET_VERSION}_SUCCESS`:
			return {...state, version: action.payload};
		case `${SOCKET_APP_INIT}`: {
			const id = localStorage.getItem(LS_APPID);
			if (id !== action.payload) {
				localStorage.setItem(LS_APPID, action.payload);
				window.location.reload();
			}
			return state;
		}
		default:
			return state;
	}
}