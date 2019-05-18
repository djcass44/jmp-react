import {LS_HEADERS, LS_REFRESH, LS_REQUEST, LS_USER} from "../constants";
import {OAUTH_REFRESH, OAUTH_REQUEST, OAUTH_VERIFY} from "../actions/Auth";

const auth = (state = {
	request: localStorage.getItem(LS_REQUEST) || '',
	refresh: localStorage.getItem(LS_REFRESH) || '',
	userProfile: localStorage.getItem(LS_USER) || {},
	headers: localStorage.getItem(LS_HEADERS) || {},
	isLoggedIn: false,
	isAdmin: false, // This is just an assumption, the API dictates whether you're an admin or not
	username: ''
}, action) => {
	switch(action.type) {
		case `${OAUTH_VERIFY}_SUCCESS`: {
			localStorage.setItem(LS_USER, JSON.stringify(action.payload.data));
			let username = '';
			if(action.payload.data.username != null) username = action.payload.data.username;
			return {...state,
				userProfile: action.payload.data,
				username: username,
				isLoggedIn: true,
				isAdmin: action.payload.data.role === 'ADMIN'
			}
		}
		case `${OAUTH_REFRESH}_SUCCESS`:
		case `${OAUTH_REQUEST}_SUCCESS`: {
			console.log(action);
			const headers = {'Authorization': `Bearer ${action.payload.data.request}`};
			localStorage.setItem(LS_REQUEST, action.payload.data.request);
			localStorage.setItem(LS_REFRESH, action.payload.data.refresh);
			localStorage.setItem(LS_HEADERS, JSON.stringify(headers));
			return {...state,
				request: action.payload.data.request,
				refresh: action.payload.data.refresh,
				headers: headers,
				isLoggedIn: true
			}
		}
		case `${OAUTH_VERIFY}_FAILURE`:
		case `${OAUTH_REQUEST}_FAILURE`: // this one shouldn't redirect to /login
		case `${OAUTH_REFRESH}_FAILURE`:
		case "OAUTH_LOGOUT": {
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
				username: ''
			}
		}
		default:
			return state;
	}
};
export default auth;