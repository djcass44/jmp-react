import {client} from "../constants";
import {addSnackbar} from "./Snackbar";

export const OAUTH_VERIFY = "OAUTH_VERIFY";
export const OAUTH_REQUEST = "OAUTH_REQUEST";
export const OAUTH_REFRESH = "OAUTH_REFRESH";
export const OAUTH_LOGOUT = "OAUTH_LOGOUT";
export const OAUTH_UNREADY = "OAUTH_UNREADY";

export const oauthPreverifyDispatch = (dispatch, refresh, headers) => {
	dispatch({type: `${OAUTH_VERIFY}_REQUEST`});
	let hasCookie = false;
	client.get("/api/v2/oauth/cookie", {headers: headers}).then(r => {
		hasCookie = r.data;
		if(shouldVerify(refresh, headers) || hasCookie) {
			oauthVerifyDispatch(dispatch, refresh, headers, hasCookie);
		}
		else {
			dispatch({type: `${OAUTH_VERIFY}_FAILURE`, error: true});
		}
	}).catch(() => {
		// No sso token, but headers may be okay
		if(shouldVerify(refresh, headers)) {
			oauthVerifyDispatch(dispatch, refresh, headers, false);
		}
		else {
			dispatch({type: `${OAUTH_VERIFY}_FAILURE`, error: true});
		}
	});
};
const oauthVerifyDispatch = (dispatch, refresh, headers, hasCookie) => {
	client.get("/api/v2/oauth/valid", {headers}).then(r => {
		dispatch({
			type: `${OAUTH_VERIFY}_SUCCESS`,
			payload: r.data
		});
		if(hasCookie === true) {
			oauthRequest2Dispatch(dispatch, headers);
		}
	}).catch(err => {
		dispatch({type: `${OAUTH_VERIFY}_FAILURE`, payload: err, error: true});
		oauthRefreshDispatch(dispatch, refresh, headers)
	});
};
function oauthRequest2Dispatch(dispatch, headers) {
	dispatch({type: `${OAUTH_REQUEST}_REQUEST`});
	client.post("/api/v2/oauth/token", {}, {headers}).then(r => {
		dispatch({type: `${OAUTH_REQUEST}_SUCCESS`, payload: r.data});
	}).catch(err => {
		dispatch(addSnackbar({message: "Failed to authenticate", options: {key: `${OAUTH_REQUEST}_FAILURE`, variant: "error"}}));
		dispatch({type: `${OAUTH_REQUEST}_FAILURE`, payload: err, error: true});
	})
}

export const oauthRequest = (dispatch, data) => {
	let headers = {
		'Authorization': `Basic ${data}`,
		'Content-Type': 'application/json'
	};
	dispatch({type: `${OAUTH_REFRESH}_REQUEST`});
	client.post("/api/v2/oauth/token", {}, {headers}).then(r => {
		dispatch({
			type: `${OAUTH_REQUEST}_SUCCESS`,
			payload: r.data
		});
		// Retry verification
		oauthVerifyDispatch(dispatch, r.data.refresh, {'Authorization': `Bearer ${r.data.request}`});
	}).catch(err => {
		dispatch(addSnackbar({message: "Failed to authenticate", options: {key: `${OAUTH_REQUEST}_FAILURE`, variant: "error"}}));
		dispatch({type: `${OAUTH_REQUEST}_FAILURE`, payload: err, error: true});
	});
};
function oauthRefreshDispatch(dispatch, refresh, headers) {
	dispatch({type: `${OAUTH_REFRESH}_REQUEST`});
	client.get("/api/v2/oauth/refresh", {headers, params: {refreshToken: refresh}}).then(r => {
		dispatch({
			type: `${OAUTH_REFRESH}_SUCCESS`,
			payload: r.data
		});
	}).catch(err => {
		dispatch(addSnackbar({message: "Failed to refresh token", options: {key: `${OAUTH_REFRESH}_FAILURE`, variant: "error"}}));
		dispatch({type: `${OAUTH_REFRESH}_FAILURE`, payload: err, error: true});
	});
}

export const oauthLogout = (dispatch, headers) => {
	dispatch({type: `${OAUTH_LOGOUT}_REQUEST`});
	client.post("/api/v2/oauth/logout", {}, {headers}).then(() => {
		dispatch({type: `${OAUTH_LOGOUT}_SUCCESS`});
	}).catch(err => {
		dispatch(addSnackbar({message: "Failed to logout", options: {key: `${OAUTH_LOGOUT}_FAILURE`, variant: "error"}}));
		dispatch({type: `${OAUTH_LOGOUT}_FAILURE`, payload: err, error: true});
	});
};

const shouldVerify = (refresh, headers) => {
	// Do a quick check to see if the user has purposefully logged out
	return !((refresh == null || refresh === "") || (headers == null || headers === ""));
};
