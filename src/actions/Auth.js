import {client} from "../constants";
import {addSnackbar} from "./Snackbar";
import {failure, get, request, success} from "./index";

export const OAUTH_VERIFY = "OAUTH_VERIFY";
export const OAUTH_REQUEST = "OAUTH_REQUEST";
export const OAUTH_REFRESH = "OAUTH_REFRESH";
export const OAUTH_LOGOUT = "OAUTH_LOGOUT";
export const GET_PROVIDERS = "GET_PROVIDERS";

export const getProviders = (dispatch, headers) => get(dispatch, GET_PROVIDERS, "/api/v2_1/statistics/providers", {headers});

export const oauthVerify = (dispatch, refresh, headers) => {
	client.get("/api/v2/user", {headers}).then(r => {
		dispatch({
			type: `${OAUTH_VERIFY}_SUCCESS`,
			payload: r.data
		});
	}).catch(err => {
		dispatch({type: `${OAUTH_VERIFY}_FAILURE`, payload: err, error: true});
		oauthRefresh(dispatch, refresh, headers);
	});
};

export const oauthRequest = (dispatch, data) => {
	request(dispatch, OAUTH_REQUEST);
	client.post("/api/a2/login", JSON.stringify(data)).then(r => {
		success(dispatch, OAUTH_REQUEST, r.data);
		// Retry verification
		oauthVerify(dispatch, r.data.refresh, {'Authorization': `Bearer ${r.data.request}`});
	}).catch(err => {
		dispatch(addSnackbar({message: "Failed to authenticate", options: {key: `${OAUTH_REQUEST}_FAILURE`, variant: "error"}}));
		failure(dispatch, OAUTH_REQUEST, err);
	});
};
const oauthRefresh = (dispatch, refresh, headers) => {
	// don't bother refreshing if there's no token
	if (refresh == null || refresh === "")
		return;
	request(dispatch, OAUTH_REFRESH);
	client.get("/api/a2/refresh", {headers, params: {refreshToken: refresh}}).then(r => {
		success(dispatch, OAUTH_REFRESH, r.data);
		// re-verify so that we can get user information
		oauthVerify(dispatch, refresh, headers);
	}).catch(err => {
		dispatch(addSnackbar({message: "Failed to refresh token", options: {key: `${OAUTH_REFRESH}_FAILURE`, variant: "error"}}));
		failure(dispatch, OAUTH_REFRESH, err);
	});
};

export const oauthLogout = (dispatch, accessToken, headers) => {
	request(dispatch, OAUTH_LOGOUT);
	client.post("/api/a2/logout", {}, {params: {accessToken}, headers}).then(() => {
		success(dispatch, OAUTH_LOGOUT, null);
	}).catch(err => {
		dispatch(addSnackbar({message: "Failed to logout", options: {key: `${OAUTH_LOGOUT}_FAILURE`, variant: "error"}}));
		failure(dispatch, OAUTH_LOGOUT, err);
	});
};
