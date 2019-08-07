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

export const OAUTH2_REFRESH = "OAUTH2_REFRESH";
export const OAUTH2_CALLBACK = "OAUTH2_CALLBACK";
export const OAUTH2_LOGOUT = "OAUTH2_LOGOUT";
export const OAUTH2_DISCOVER = "OAUTH2_DISCOVER";

export function oauth2Refresh(refresh, source, headers) {
	return dispatch => { oauth2RefreshDispatch(dispatch, refresh, source, headers) }
}
export function oauth2Callback(query, headers) {
	return dispatch => { oauth2CallbackDispatch(dispatch, query, headers) }
}
export function oauth2Logout(accessToken, source, headers) {
	return dispatch => { oauth2LogoutDispatch(dispatch, accessToken, source, headers) }
}
export function oauth2Discover(provider) {
	return dispatch => { oauth2DiscoverDispatch(dispatch, provider) }
}

function oauth2RefreshDispatch(dispatch, refresh, source, headers) {
	dispatch({type: `${OAUTH2_REFRESH}_REQUEST`});
	client.get("/api/v2/oauth2/refresh", {headers: headers, params: {refreshToken: refresh, provider: source}}).then(r => {
		console.log("v2: refresh success");
		dispatch({
			type: `${OAUTH2_REFRESH}_SUCCESS`,
			data: r.data
		});
	}).catch(err => {
		console.log(`v2: refresh failed: ${err}`);
		dispatch({type: `${OAUTH2_REFRESH}_FAILURE`, data: err.toString()});
	});
}
function oauth2CallbackDispatch(dispatch, query, headers) {
	dispatch({type: `${OAUTH2_CALLBACK}_REQUEST`});
	client.get("/api/v2/oauth2/callback", {headers: headers, params: query}).then(r => {
		console.log("v2: callback success");
		dispatch({
			type: `${OAUTH2_CALLBACK}_SUCCESS`,
			data: r.data
		});
	}).catch(err => {
		console.log(`v2: callback failed: ${err}`);
		dispatch({type: `${OAUTH2_CALLBACK}_FAILURE`, data: err.toString()});
	});
}
function oauth2LogoutDispatch(dispatch, accessToken, source, headers) {
	dispatch({type: `${OAUTH2_LOGOUT}_REQUEST`});
	client.post("/api/v2/oauth2/logout", {}, {headers: headers, params: {accessToken: accessToken, provider: source}}).then(r => {
		console.log("v2: logout success");
		dispatch({
			type: `${OAUTH2_LOGOUT}_SUCCESS`,
			data: r.data
		});
	}).catch(err => {
		console.log(`v2: logout failed: ${err}`);
		dispatch({type: `${OAUTH2_LOGOUT}_FAILURE`, data: err.toString()});
	});
}
function oauth2DiscoverDispatch(dispatch, provider) {
	dispatch({type: `${OAUTH2_DISCOVER}_REQUEST`});
	client.head("/api/v2/oauth2/authorise", {params: {provider: provider}}).then(() => {
		dispatch({
			type: `${OAUTH2_DISCOVER}_SUCCESS`,
			data: {provider: provider, active: true}
		});
	}).catch(() => {
		dispatch({type: `${OAUTH2_DISCOVER}_SUCCESS`, data: {provider: provider, active: false}});
	});
}