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

import {PersistConfig, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import {Pair, User} from "../../types";
import {AuthActionType} from "../actions/auth";
import {OAUTH_LOGOUT_REQUEST, OAUTH_LOGOUT_SUCCESS} from "../actions/auth/AuthLogout";
import {OAUTH_VERIFY_SUCCESS} from "../actions/auth/AuthVerify";
import {OAUTH_REQUEST_SUCCESS} from "../actions/auth/AuthRequest";
import {OAUTH_REFRESH_SUCCESS} from "../actions/auth/AuthRefresh";
import {GET_PROVIDERS_SUCCESS} from "../actions/auth/GetProviders";
import {DISCOVER_OAUTH_SUCCESS} from "../actions/auth/DiscoverOAuth";
import {OAUTH2_CALLBACK_SUCCESS} from "../actions/auth/OAuth2Callback";
import {OAUTH2_LOGOUT_REQUEST, OAUTH2_LOGOUT_SUCCESS} from "../actions/auth/OAuth2Logout";

export interface AuthState {
	request: string | null;
	refresh: string | null;
	source: string | null;
	userProfile: User | null;
	isLoggedIn: boolean;
	isAdmin: boolean;
	providers: Map<string, any>;
	allProviders: Array<Pair<string, number>>;
}

const initialState: AuthState = {
	request: null,
	refresh: null,
	source: null,
	userProfile: null,
	isLoggedIn: false,
	isAdmin: false,
	providers: new Map<string, any>(),
	allProviders: []
};

const auth = (state = initialState, action: AuthActionType): AuthState => {
	switch (action.type) {
		case GET_PROVIDERS_SUCCESS:
			return {...state, allProviders: action.payload};
		case DISCOVER_OAUTH_SUCCESS: {
			const {first, second} = action.payload;
			const {providers} = state;
			providers.set(first, second);
			return {...state, providers};
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
		case OAUTH2_CALLBACK_SUCCESS:
		case OAUTH_REFRESH_SUCCESS:
		case OAUTH_REQUEST_SUCCESS: {
			const {request, refresh, source = null} = action.payload;
			return {
				...state,
				request,
				refresh,
				source,
				isLoggedIn: true,
			}
		}
		case OAUTH2_LOGOUT_REQUEST:
		case OAUTH2_LOGOUT_SUCCESS:
		case OAUTH_LOGOUT_REQUEST:
		case OAUTH_LOGOUT_SUCCESS: {
			return {
				...state,
				request: null,
				refresh: null,
				source: null,
				userProfile: null,
				isLoggedIn: false,
				isAdmin: false
			}
		}
		default:
			return state;
	}
}
const authPersistConfig: PersistConfig<AuthState> = {
	key: "auth",
	storage,
	whitelist: ["request", "refresh", "source"]
};
export default persistReducer(authPersistConfig, auth);