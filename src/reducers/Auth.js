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

import {LS_HEADERS, LS_REFRESH, LS_REQUEST, LS_USER} from "../constants";
import {OAUTH_LOGOUT, OAUTH_REFRESH, OAUTH_REQUEST, OAUTH_VERIFY} from "../actions/Auth";

const auth = (state = {
	request: localStorage.getItem(LS_REQUEST) || '',
	refresh: localStorage.getItem(LS_REFRESH) || '',
	userProfile: localStorage.getItem(LS_USER) || {},
	headers: JSON.parse(localStorage.getItem(LS_HEADERS)) || {},
	isLoggedIn: false,
	isAdmin: false, // This is just an assumption, the API dictates whether you're an admin or not
	username: '',
	ready: false
}, action) => {
	switch(action.type) {
		case `${OAUTH_VERIFY}_SUCCESS`: {
			localStorage.setItem(LS_USER, JSON.stringify(action.data));
			let username = '';
			if(action.data.username != null) username = action.data.username;
			// console.log(`username: ${username}`);
			return {...state,
				userProfile: action.data,
				username: username,
				isLoggedIn: true,
				isAdmin: action.data.role === 'ADMIN',
				ready: true
			}
		}
		case `${OAUTH_REFRESH}_SUCCESS`:
		case `${OAUTH_REQUEST}_SUCCESS`: {
			console.log(action);
			const headers = {'Authorization': `Bearer ${action.data.request}`};
			localStorage.setItem(LS_REQUEST, action.data.request);
			localStorage.setItem(LS_REFRESH, action.data.refresh);
			localStorage.setItem(LS_HEADERS, JSON.stringify(headers));
			return {...state,
				request: action.data.request,
				refresh: action.data.refresh,
				headers: headers,
				isLoggedIn: true,
				ready: true
			}
		}
		case `${OAUTH_VERIFY}_FAILURE`: // probably never sent
		case `${OAUTH_REQUEST}_FAILURE`: // this one shouldn't redirect to /login
		case `${OAUTH_REFRESH}_FAILURE`:
		case OAUTH_LOGOUT: {
			localStorage.removeItem(LS_REQUEST);
			localStorage.removeItem(LS_REFRESH);
			localStorage.removeItem(LS_HEADERS);
			localStorage.removeItem(LS_USER);
			return {...state,
				request: '',
				refresh: '',
				userProfile: {},
				headers: {},
				isLoggedIn: false,
				isAdmin: false,
				username: '',
				ready: true
			}
		}
		default:
			return state;
	}
};
export default auth;