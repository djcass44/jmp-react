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

import {AuthHeaders, Pair, PublicKeyGet, Token, User} from "../../types";
import {LS_REFRESH, LS_REQUEST, LS_SOURCE} from "../../constants";
import {AuthActionType} from "../actions/auth";
import {OAUTH_LOGOUT_REQUEST, OAUTH_LOGOUT_SUCCESS} from "../actions/auth/AuthLogout";
import {OAUTH_VERIFY_SUCCESS} from "../actions/auth/AuthVerify";
import {OAUTH_REQUEST_SUCCESS} from "../actions/auth/AuthRequest";
import {OAUTH_REFRESH_SUCCESS} from "../actions/auth/AuthRefresh";
import {GET_PROVIDERS_SUCCESS} from "../actions/auth/GetProviders";
import {DISCOVER_OAUTH_SUCCESS} from "../actions/auth/DiscoverOAuth";
import {OAUTH2_CALLBACK_SUCCESS} from "../actions/auth/OAuth2Callback";
import {getHeaders} from "../../util";
import {OAUTH2_LOGOUT_REQUEST, OAUTH2_LOGOUT_SUCCESS} from "../actions/auth/OAuth2Logout";
import {U2F_GET_RESPONSE_SUCCESS} from "../actions/settings/general/U2FGetResponse";
import {WEB_U2F_CHALLENGE_FAILURE} from "../actions/settings/general";

export interface AuthState {
	request: string | null;
	refresh: string | null;
	source: string | null;
	headers: AuthHeaders;
	userProfile: User | null;
	isLoggedIn: boolean;
	isAdmin: boolean;
	providers: Map<string, any>;
	allProviders: Array<Pair<string, number>>;
	u2f: {
		uid: string | null;
		publicKey: PublicKeyCredentialRequestOptions | null;
	}
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
	allProviders: [],
	u2f: {
		uid: null,
		publicKey: null
	}
};

export default (state = initialState, action: AuthActionType) => {
	switch (action.type) {
		case WEB_U2F_CHALLENGE_FAILURE:
			return {...state, u2f: {uid: null, publicKey: null}};
		case GET_PROVIDERS_SUCCESS:
			return {...state, allProviders: action.payload};
		case DISCOVER_OAUTH_SUCCESS: {
			const {first, second} = action.payload;
			return {...state, providers: {...state.providers, [first]: second}}
		}
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
		case U2F_GET_RESPONSE_SUCCESS:
		case OAUTH2_CALLBACK_SUCCESS:
		case OAUTH_REFRESH_SUCCESS:
		case OAUTH_REQUEST_SUCCESS: {
			if (action.payload as Pair<string, PublicKeyGet>) {
				const {first, second} = action.payload as Pair<string, PublicKeyGet>;
				// we got a U2F request
				return {...state, u2f: {uid: first, publicKey: second}}
			}
			const {request, refresh, source = null} = action.payload as Token;
			const headers = getHeaders(action.payload as Token);
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
		case OAUTH2_LOGOUT_REQUEST:
		case OAUTH2_LOGOUT_SUCCESS:
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