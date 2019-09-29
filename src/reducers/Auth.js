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

import {LS_ADM, LS_HEADERS, LS_LOGIN, LS_NAME, LS_REFRESH, LS_REQUEST, LS_SOURCE, LS_USER} from "../constants";
import {GET_PROVIDERS, OAUTH_LOGOUT, OAUTH_REFRESH, OAUTH_REQUEST, OAUTH_UNREADY, OAUTH_VERIFY} from "../actions/Auth";
import {OAUTH2_CALLBACK, OAUTH2_DISCOVER, OAUTH2_LOGOUT, OAUTH2_REFRESH} from "../actions/Oauth";

const initialState = {
	request: localStorage.getItem(LS_REQUEST) || '',
	refresh: localStorage.getItem(LS_REFRESH) || '',
	source: localStorage.getItem(LS_SOURCE) || '',
	userProfile: JSON.parse(localStorage.getItem(LS_USER)) || {},
	headers: JSON.parse(localStorage.getItem(LS_HEADERS)) || {},
	isLoggedIn: localStorage.getItem(LS_LOGIN) === 'true' || false,
	isAdmin: localStorage.getItem(LS_ADM) === 'true' || false, // This is just an assumption, the API dictates whether you're an admin or not
	username: localStorage.getItem(LS_NAME) || '',
	ready: false,
	providers: {},
	allProviders: []
};

const auth = (state = initialState, action) => {
	switch(action.type) {
		case `${GET_PROVIDERS}_SUCCESS`:
			return {...state, allProviders: action.payload};
		case `${OAUTH_VERIFY}_SUCCESS`: {
			localStorage.setItem(LS_USER, JSON.stringify(action.payload));
			localStorage.setItem(LS_LOGIN, "true");
			localStorage.setItem(LS_ADM, (action.payload.role === 'ADMIN').toString());
			let username = '';
			if(action.payload.username != null) username = action.payload.username;
			localStorage.setItem(LS_NAME, username);
			return {...state,
				userProfile: action.payload,
				username: username,
				isLoggedIn: true,
				isAdmin: action.payload.role === 'ADMIN',
				ready: true
			}
		}
		case `${OAUTH2_CALLBACK}_SUCCESS`:
		case `${OAUTH2_REFRESH}_SUCCESS`:
		case `${OAUTH_REFRESH}_SUCCESS`:
		case `${OAUTH_REQUEST}_SUCCESS`: {
			const source = action.payload.source || '';
			const headers = {'Authorization': `Bearer ${action.payload.request}`, 'X-Auth-Source': source};
			localStorage.setItem(LS_REQUEST, action.payload.request);
			localStorage.setItem(LS_REFRESH, action.payload.refresh);
			localStorage.setItem(LS_SOURCE, source); // will be null if not using OAuth2
			localStorage.setItem(LS_HEADERS, JSON.stringify(headers));
			localStorage.setItem(LS_LOGIN, "true");
			return {...state,
				request: action.payload.request,
				refresh: action.payload.refresh,
				source: source,
				headers: headers,
				isLoggedIn: true,
				ready: true
			}
		}
		case `${OAUTH_VERIFY}_FAILURE`:
			return state;
		case `${OAUTH_REQUEST}_FAILURE`: // this one shouldn't redirect to /login
		case `${OAUTH_REFRESH}_FAILURE`:
		case `${OAUTH2_LOGOUT}_SUCCESS`:
		case `${OAUTH2_LOGOUT}_REQUEST`:
		case `${OAUTH_LOGOUT}_SUCCESS`:
		case `${OAUTH_LOGOUT}_REQUEST`: {
			// Only clear localstorage if we truly want to logout
			if(action.type === `${OAUTH_LOGOUT}_SUCCESS` || action.type === `${OAUTH_LOGOUT}_REQUEST`) {
				localStorage.removeItem(LS_REQUEST);
				localStorage.removeItem(LS_REFRESH);
				localStorage.removeItem(LS_SOURCE);
				localStorage.removeItem(LS_HEADERS);
			}
			localStorage.removeItem(LS_USER);
			localStorage.removeItem(LS_LOGIN);
			localStorage.removeItem(LS_ADM);
			localStorage.removeItem(LS_NAME);
			return {...state,
				request: '',
				refresh: '',
				source: '',
				userProfile: {},
				headers: {},
				isLoggedIn: false,
				isAdmin: false,
				username: '',
				ready: true
			}
		}
		case `${OAUTH_UNREADY}_REQUEST`:
			return {...state, ready: false};
		case `${OAUTH2_DISCOVER}_SUCCESS`: {
			// Attempt to set the provider status
			const {providers} = state;
			providers[action.payload['provider']] = action.payload['active'];
			return {...state, providers};
		}
		default:
			return state;
	}
};
export default auth;
