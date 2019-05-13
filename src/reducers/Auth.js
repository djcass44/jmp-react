import {LS_HEADERS, LS_REFRESH, LS_REQUEST, LS_USER} from "../constants";

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
		case "OAUTH_VERIFY_SUCCESS": {
			localStorage.setItem(LS_USER, JSON.stringify(action.data));
			let username = '';
			if(action.data.username != null) username = action.data.username;
			return {...state,
				userProfile: action.data,
				username: username,
				isLoggedIn: true,
				isAdmin: action.data.role === 'ADMIN'
			}
		}
		case "OAUTH_REQUEST_SUCCESS": {
			const headers = {'Authorization': `Bearer ${action.data.request}`};
			localStorage.setItem(LS_REQUEST, action.data.request);
			localStorage.setItem(LS_REFRESH, action.data.refresh);
			localStorage.setItem(LS_HEADERS, JSON.stringify(headers));
			return {...state,
				request: action.data.request,
				refresh: action.data.refresh,
				headers: headers,
				isLoggedIn: true
			}
		}
		case "OAUTH_VERIFY_FAILURE":
		case "OAUTH_REQUEST_FAILURE": // this one shouldn't redirect to /login
		case "OAUTH_REFRESH_FAILURE":
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