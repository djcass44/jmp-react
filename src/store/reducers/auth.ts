/*
 *    Copyright 2019 Django Cass
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

import {AuthHeaders, User} from "../../types";
import {LS_REFRESH, LS_REQUEST, LS_SOURCE} from "../../constants";
import {AuthActionType} from "../actions/auth";
import {OAUTH_LOGOUT_REQUEST, OAUTH_LOGOUT_SUCCESS} from "../actions/auth/AuthLogout";
import {OAUTH_VERIFY_SUCCESS} from "../actions/auth/AuthVerify";
import {OAUTH_REQUEST_SUCCESS} from "../actions/auth/AuthRequest";
import {OAUTH_REFRESH_SUCCESS} from "../actions/auth/AuthRefresh";

export interface AuthState {
	request: string | null;
	refresh: string | null;
	source: string | null;
	headers: AuthHeaders;
	userProfile: User | null;
	isLoggedIn: boolean;
	isAdmin: boolean;
	providers: Map<string, any>;
	allProviders: Array<any>;
}

const initialState: AuthState = {
	request: localStorage.getItem(LS_REQUEST) || null,
	refresh: localStorage.getItem(LS_REFRESH) || null,
	source: localStorage.getItem(LS_SOURCE) || null,
	headers: {
		Authorization: `Bearer ${localStorage.getItem(LS_REQUEST) || ""}`,
		'X-Auth-Source': localStorage.getItem(LS_SOURCE) || ""
	},
	userProfile: null,
	isLoggedIn: false,
	isAdmin: false,
	providers: new Map<string, any>(),
	allProviders: []
};

export default (state = initialState, action: AuthActionType) => {
	switch (action.type) {
		case OAUTH_VERIFY_SUCCESS: {
			// if there's not request token there's no point saving the userProfile
			// weird hack to stop the userProfile coming in AFTER a successful logout
			if (state.refresh == null || state.refresh === "")
				return state;
			return {
				...state,
				userProfile: action.payload,
				isLoggedIn: true,
				isAdmin: action.payload.admin
			}
		}
		case OAUTH_REFRESH_SUCCESS:
		case OAUTH_REQUEST_SUCCESS: {
			const {request, refresh, source = null} = action.payload;
			const headers = {
				"Authorization": `Bearer ${request}`,
				"X-Auth-Source": source
			};
			localStorage.setItem(LS_REQUEST, request);
			localStorage.setItem(LS_REFRESH, refresh);
			localStorage.setItem(LS_SOURCE, source ?? "");
			return {
				...state,
				request,
				refresh,
				source,
				headers,
				isLoggedIn: true,
			}
		}
		case OAUTH_LOGOUT_REQUEST:
		case OAUTH_LOGOUT_SUCCESS: {
			// drop values from localStorage
			localStorage.removeItem(LS_REQUEST);
			localStorage.removeItem(LS_REFRESH);
			localStorage.removeItem(LS_SOURCE);
			return {
				...state,
				request: null,
				refresh: null,
				source: null,
				headers: {},
				userProfile: null,
				isLoggedIn: false,
				isAdmin: false,
			}
		}
		default:
			return state;
	}
}