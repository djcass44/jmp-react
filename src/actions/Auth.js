import {client} from "../constants";

export const OAUTH_VERIFY = "OAUTH_VERIFY";
export const OAUTH_REQUEST = "OAUTH_REQUEST";
export const OAUTH_REFRESH = "OAUTH_REFRESH";
export const OAUTH_LOGOUT = "OAUTH_LOGOUT";
export const OAUTH_UNREADY = "OAUTH_UNREADY";

export function oauthVerify(refresh, headers) {
	return dispatch => {
		oauthPreverifyDispatch(dispatch, refresh, headers);
	}
}
export function oauthRequest(data) {
	return dispatch => {
		oauthRequestDispatch(dispatch, data);
	}
}
export function oauthRefresh(refresh, headers) {
	return dispatch => {
		oauthRefreshDispatch(dispatch, refresh, headers);
	}
}
export function oauthLogout(headers) {
	return dispatch => {
		oauthLogoutDispatch(dispatch, headers);
	}
}
export function oauthUnready() {
	return dispatch => {dispatch({type: OAUTH_UNREADY});}
}
function oauthPreverifyDispatch(dispatch, refresh, headers) {
	let hasCookie = false;
	client.get("/api/v2/oauth/cookie", {headers: headers}).then(r => {
		hasCookie = r.data === "true";
		console.log(`SSO cookie: ${hasCookie}`);
		if(shouldVerify(refresh, headers) || hasCookie) {
			oauthVerifyDispatch(dispatch, refresh, headers);
		}
	}).catch(err => {
		console.log(`probably no sso setup: ${err.toString()}`);
		// No sso token, but headers may be okay
		if(shouldVerify(refresh, headers)) {
			oauthVerifyDispatch(dispatch, refresh, headers);
		}
	});
}
function oauthVerifyDispatch(dispatch, refresh, headers) {
	dispatch({type: `${OAUTH_VERIFY}_REQUEST`});
	client.get("/api/v2/oauth/valid", {headers: headers}).then( r => {
		dispatch({
			type: `${OAUTH_VERIFY}_SUCCESS`,
			data: r.data
		});
		oauthRequest2Dispatch(dispatch, headers);
	}).catch(err => {
		console.log(`verify failed: ${err}`);
		console.log("lets try to refresh first");
		dispatch({type: `${OAUTH_VERIFY}_FAILURE`, data: err.toString()});
		oauthRefreshDispatch(dispatch, refresh, headers)
	});
}
function oauthRequest2Dispatch(dispatch, headers) {
	dispatch({type: `${OAUTH_REQUEST}_REQUEST`});
	client.post("/api/v2/oauth/token", {}, {headers: headers}).then(r => {
		dispatch({type: `${OAUTH_REQUEST}_SUCCESS`, data: r.data});
	}).catch(err => {
		dispatch({type: `${OAUTH_REQUEST}_FAILURE`, data: err.toString()});
	})
}
function oauthRequestDispatch(dispatch, data) {
	let headers = {
		'Authorization': `Basic ${data}`,
		'Content-Type': 'application/json'
	};
	dispatch({type: `${OAUTH_REFRESH}_REQUEST`});
	client.post("/api/v2/oauth/token", {}, {headers: headers}).then(r => {
		console.log(`request success`);
		dispatch({
			type: `${OAUTH_REQUEST}_SUCCESS`,
			data: r.data
		});
		// Retry verification
		oauthVerifyDispatch(dispatch, r.data['refresh'], {'Authorization': `Bearer ${r.data.request}`});
	}).catch(err => {
		console.log(`request failed: ${err}`);
		dispatch({type: `${OAUTH_REQUEST}_FAILURE`, data: err.toString()});
	});
}
function oauthRefreshDispatch(dispatch, refresh, headers) {
	dispatch({type: `${OAUTH_REFRESH}_REQUEST`});
	client.get("/api/v2/oauth/refresh", {headers: headers, params: {refreshToken: refresh}}).then( r => {
		console.log(`refresh success`);
		dispatch({
			type: `${OAUTH_REFRESH}_SUCCESS`,
			data: r.data
		});
	}).catch(err => {
		console.log(`refresh failed: ${err}`);
		dispatch({type: `${OAUTH_REFRESH}_FAILURE`, data: err.toString()});
	});
}
function oauthLogoutDispatch(dispatch, headers) {
	dispatch({type: `${OAUTH_LOGOUT}_REQUEST`});
	client.post("/api/v2/oauth/logout", {}, {headers: headers}).then( () => {
		dispatch({type: `${OAUTH_LOGOUT}_SUCCESS`});
	}).catch(err => {
		dispatch({type: `${OAUTH_LOGOUT}_FAILURE`, data: err.toString()});
	});
}

function getCookie(name) {
	function escape(s) {
		return s.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
	}
	const match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
	return match ? match[1] : null;
}
function shouldVerify(refresh, headers) {
	// Do a quick check to see if the user has purposefully logged out
	if((refresh == null || refresh === "") || (headers == null || headers === "")) {
		console.log("Skipping verify (no refresh/headers)");
		return false;
	}
	return true;
}