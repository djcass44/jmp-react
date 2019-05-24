import axios from "axios";
import {BASE_URL} from "../constants";

export const OAUTH_VERIFY = "OAUTH_VERIFY";
export const OAUTH_REQUEST = "OAUTH_REQUEST";
export const OAUTH_REFRESH = "OAUTH_REFRESH";
export const OAUTH_LOGOUT = "OAUTH_LOGOUT";

export const client = axios.create({
	baseURL: BASE_URL
});

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
export function oauthLogout() {
	return dispatch => {
		oauthLogoutDispatch(dispatch);
	}
}

function oauthVerifyDispatch(dispatch, refresh, headers) {
	dispatch({type: OAUTH_VERIFY});
	client.get("/api/v2/oauth/valid", {headers: headers}).then( r => {
		console.log(`verify valid`);
		dispatch({
			type: `${OAUTH_VERIFY}_SUCCESS`,
			data: r.data
		});
	}).catch(err => {
		console.log(`verify failed: ${err}`);
		console.log("lets try to refresh first");
		// dispatch({type: `${OAUTH_VERIFY}_FAILURE`});
		oauthRefreshDispatch(dispatch, refresh, headers)
	});
}
function oauthRequestDispatch(dispatch, data) {
	let headers = {
		'Authorization': `Basic ${data}`,
		'Content-Type': 'application/json'
	};
	dispatch({type: OAUTH_REFRESH});
	client.post("/api/v2/oauth/token", {}, {headers: headers}).then(r => {
		console.log(`request success`);
		dispatch({
			type: `${OAUTH_REQUEST}_SUCCESS`,
			data: r.data
		})
	}).catch(err => {
		console.log(`request failed: ${err}`);
		dispatch({type: `${OAUTH_REQUEST}_FAILURE`, data: err.toString()});
	});
}
function oauthRefreshDispatch(dispatch, refresh, headers) {
	console.log(`refreshing: ${refresh}, ${headers}`);
	dispatch({type: OAUTH_REFRESH});
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
	dispatch({type: OAUTH_LOGOUT});
}