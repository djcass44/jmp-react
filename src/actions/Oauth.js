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

export const OAUTH2_REFRESH = "OAUTH2_REFRESH";
export const OAUTH2_CALLBACK = "OAUTH2_CALLBACK";
export const OAUTH2_LOGOUT = "OAUTH2_LOGOUT";
export const OAUTH2_DISCOVER = "OAUTH2_DISCOVER";

export const oauth2Callback = (query, headers) => dispatch => oauth2CallbackDispatch(dispatch, query, headers);

function oauth2CallbackDispatch(dispatch, query, headers) {
	dispatch({type: `${OAUTH2_CALLBACK}_REQUEST`});
	client.get("/api/v2/oauth2/callback", {headers: headers, params: query}).then(r => {
		console.log("v2: callback success");
		dispatch({
			type: `${OAUTH2_CALLBACK}_SUCCESS`,
			payload: r.data
		});
	}).catch(err => {
		console.log(`v2: callback failed: ${err}`);
		dispatch(addSnackbar({message: "OAuth callback failed", options: {key: `${OAUTH2_CALLBACK}_FAILURE`, variant: "error"}}));
		dispatch({type: `${OAUTH2_CALLBACK}_FAILURE`, payload: err, error: true});
	});
}

export const oauth2Logout = (dispatch, accessToken, source, headers) => {
	dispatch({type: `${OAUTH2_LOGOUT}_REQUEST`});
	client.post("/api/v2/oauth2/logout", {}, {headers, params: {accessToken, provider: source}}).then(r => {
		dispatch({
			type: `${OAUTH2_LOGOUT}_SUCCESS`,
			payload: r.data
		});
	}).catch(err => {
		dispatch(addSnackbar({message: "Failed to logout", options: {key: `${OAUTH2_LOGOUT}_FAILURE`, variant: "error"}}));
		dispatch({type: `${OAUTH2_LOGOUT}_FAILURE`, payload: err, error: true});
	});
};
export const oauth2Discover = (dispatch, provider) => {
	dispatch({type: `${OAUTH2_DISCOVER}_REQUEST`});
	client.head("/api/v2/oauth2/authorise", {params: {provider: provider}}).then(() => {
		dispatch({
			type: `${OAUTH2_DISCOVER}_SUCCESS`,
			payload: {provider: provider, active: true}
		});
	}).catch(err => {
		dispatch({
			type: `${OAUTH2_DISCOVER}_SUCCESS`,
			payload: {provider: provider, active: false},
			meta: err,
			error: true
		});
	});
};