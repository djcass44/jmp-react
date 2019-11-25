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

import {client} from "../constants";
import {addSnackbar} from "./Snackbar";
import {failure, request, success} from "./index";

export const OAUTH2_REFRESH = "OAUTH2_REFRESH";
export const OAUTH2_CALLBACK = "OAUTH2_CALLBACK";
export const OAUTH2_LOGOUT = "OAUTH2_LOGOUT";
export const OAUTH2_DISCOVER = "OAUTH2_DISCOVER";

export const oauth2Callback = (dispatch, query) => {
	request(dispatch, OAUTH2_CALLBACK);
	client.get("/api/o2/callback", {params: query}).then(r => {
		success(dispatch, OAUTH2_CALLBACK, r.data);
	}).catch(err => {
		console.log(`v2: callback failed: ${err}`);
		dispatch(addSnackbar({message: "OAuth callback failed", options: {key: `${OAUTH2_CALLBACK}_FAILURE`, variant: "error"}}));
		failure(dispatch, OAUTH2_CALLBACK, err);
	});
};

export const oauth2Logout = (dispatch, accessToken, source, headers) => {
	request(dispatch, OAUTH2_LOGOUT, {source});
	client.post(`/api/o2/logout/${source}`, {}, {headers, params: {accessToken}}).then(r => {
		success(dispatch, OAUTH2_LOGOUT, r.data);
	}).catch(err => {
		dispatch(addSnackbar({message: "Failed to logout", options: {key: `${OAUTH2_LOGOUT}_FAILURE`, variant: "error"}}));
		failure(dispatch, OAUTH2_LOGOUT, err);
	});
};
export const oauth2Discover = (dispatch, provider) => {
	request(dispatch, OAUTH2_DISCOVER, {provider});
	client.get(`/api/o2/${provider}`)
		.then(r => success(dispatch, OAUTH2_DISCOVER, r.data))
		.catch(err => failure(dispatch, OAUTH2_DISCOVER, err));
};