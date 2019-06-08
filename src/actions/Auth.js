import {client} from "../constants";

export const OAUTH_VERIFY = "OAUTH_VERIFY";
export const OAUTH_REQUEST = "OAUTH_REQUEST";
export const OAUTH_REFRESH = "OAUTH_REFRESH";
export const OAUTH_LOGOUT = "OAUTH_LOGOUT";
export const OAUTH_UNREADY = "OAUTH_UNREADY";

export function oauthVerify(refresh, headers) {
	return dispatch => {
		oauthVerifyDispatch(dispatch, refresh, headers);
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

function oauthVerifyDispatch(dispatch, refresh, headers) {
	dispatch({type: `${OAUTH_VERIFY}_REQUEST`});
	// Do a quick check to see if the user has purposefully logged out
	if(((refresh == null || refresh === "") || (headers == null || headers === "")) && getCookie("crowd.token_key") == null) {
		console.log("Skipping verify (no refresh/headers)");
		dispatch({type: `${OAUTH_VERIFY}_FAILURE`});
		return;
	}
	client.get("/api/v2/oauth/valid", {headers: headers}).then( r => {
		dispatch({
			type: `${OAUTH_VERIFY}_SUCCESS`,
			data: r.data
		});
	}).catch(err => {
		console.log(`verify failed: ${err}`);
		console.log("lets try to refresh first");
		dispatch({type: `${OAUTH_VERIFY}_FAILURE`, data: err.toString()});
		oauthRefreshDispatch(dispatch, refresh, headers)
	});
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
function oauthLogoutDispatch(dispatch) {
	dispatch({type: `${OAUTH_LOGOUT}_REQUEST`});
	client.post("/api/v2/oauth/logout", {}, {headers: headers}).then( () => {
		dispatch({type: `${OAUTH_LOGOUT}_SUCCESS`});
	}).catch(err => {
		dispatch({type: `${OAUTH_LOGOUT}_FAILURE`, data: err.toString()});
	});
}

function getCookie(name) {
	let end;
	const dc = document.cookie;
	const prefix = name + "=";
	let begin = dc.indexOf("; " + prefix);
	if (begin === -1) {
		begin = dc.indexOf(prefix);
		if (begin !== 0) return null;
	}
	else
	{
		begin += 2;
		end = document.cookie.indexOf(";", begin);
		if (end === -1) {
			end = dc.length;
		}
	}
	return decodeURI(dc.substring(begin + prefix.length, end));
}