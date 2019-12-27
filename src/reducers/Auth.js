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

import {LS_REFRESH, LS_REQUEST, LS_SOURCE} from "../constants";
import {GET_PROVIDERS, OAUTH_LOGOUT, OAUTH_REFRESH, OAUTH_REQUEST, OAUTH_VERIFY} from "../actions/Auth";
import {OAUTH2_CALLBACK, OAUTH2_DISCOVER, OAUTH2_LOGOUT, OAUTH2_REFRESH} from "../actions/Oauth";

const initialState = {
	request: localStorage.getItem(LS_REQUEST) || '',
	refresh: localStorage.getItem(LS_REFRESH) || '',
	source: localStorage.getItem(LS_SOURCE) || '',
	headers: {
		'Authorization': `Bearer ${localStorage.getItem(LS_REQUEST) || ""}`,
		'X-Auth-Source': localStorage.getItem(LS_SOURCE) || ""
	},
	userProfile: {},
	isLoggedIn: false,
	isAdmin: false,

	providers: {},
	allProviders: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case `${GET_PROVIDERS}_SUCCESS`:
			return {...state, allProviders: action.payload};
		case `${OAUTH_VERIFY}_SUCCESS`: {
			// if there's not request token there's no point saving the userProfile
			// weird hack to stop the userProfile coming in AFTER a successful logout
			if (state.request == null || state.request === "")
				return state;
			return {...state, userProfile: action.payload, isLoggedIn: true, isAdmin: action.payload.admin === true};
		}
		case `${OAUTH2_CALLBACK}_SUCCESS`:
		case `${OAUTH2_REFRESH}_SUCCESS`:
		case `${OAUTH_REFRESH}_SUCCESS`:
		case `${OAUTH_REQUEST}_SUCCESS`: {
			const {request, refresh, source = ""} = action.payload;
			const headers = {
				'Authorization': `Bearer ${request}`,
				'X-Auth-Source': source
			};
			localStorage.setItem(LS_REQUEST, request);
			localStorage.setItem(LS_REFRESH, refresh);
			localStorage.setItem(LS_SOURCE, source);
			return {...state,
				request,
				refresh,
				source,
				headers,
				isLoggedIn: true,
			}
		}
		case `${OAUTH2_LOGOUT}_SUCCESS`:
		case `${OAUTH2_LOGOUT}_REQUEST`:
		case `${OAUTH_LOGOUT}_SUCCESS`:
		case `${OAUTH_LOGOUT}_REQUEST`: {
			// Only clear localstorage if we truly want to logout
			if (action.type === `${OAUTH_LOGOUT}_SUCCESS` || action.type === `${OAUTH_LOGOUT}_REQUEST` || action.type === `${OAUTH2_LOGOUT}_REQUEST` || action.type === `${OAUTH2_LOGOUT}_SUCCESS`) {
				localStorage.removeItem(LS_REQUEST);
				localStorage.removeItem(LS_REFRESH);
				localStorage.removeItem(LS_SOURCE);
			}
			return {...state,
				request: '',
				refresh: '',
				source: '',
				headers: {},
				userProfile: {},
				isLoggedIn: false,
				isAdmin: false,
			}
		}
		case `${OAUTH2_DISCOVER}_SUCCESS`: {
			const {first, second} = action.payload;
			return {...state, providers: {...state.providers, [first]: second}};
		}
		default:
			return state;
	}
};
