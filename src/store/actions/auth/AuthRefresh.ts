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

import {Token} from "../../../types";
import {Dispatch} from "redux";
import {RSAA} from "redux-api-middleware";
import {BASE_URL} from "../../../constants";
import {oauthVerify} from "./AuthVerify";

export const OAUTH_REFRESH = "OAUTH_REFRESH";
export const OAUTH_REFRESH_REQUEST = "OAUTH_REFRESH_REQUEST";
export const OAUTH_REFRESH_SUCCESS = "OAUTH_REFRESH_SUCCESS";
export const OAUTH_REFRESH_FAILURE = "OAUTH_REFRESH_FAILURE";

interface AuthRefreshRequestAction {
	type: typeof OAUTH_REFRESH_REQUEST;
}

interface AuthRefreshSuccessAction {
	type: typeof OAUTH_REFRESH_SUCCESS;
	payload: Token;
}

interface AuthRefreshFailureAction {
	type: typeof OAUTH_REFRESH_FAILURE;
	payload: Error;
}

export const oauthRefresh = (dispatch: Dispatch, refresh: string, headers: any): void => {
	// don't refresh if there's no token
	if (refresh === "")
		return;
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/auth/refresh?refreshToken=${refresh}`,
			method: "GET",
			headers: headers,
			types: [OAUTH_REFRESH_REQUEST, OAUTH_REFRESH_SUCCESS, OAUTH_REFRESH_FAILURE]
		}
	}).then((r) => {
		// retry verification for user information
		const payload = r.payload as Token;
		oauthVerify(dispatch, payload.refresh, {'Authorization': `Bearer ${payload.request}`});
	});
};

export type AuthRefreshActionType = AuthRefreshRequestAction | AuthRefreshSuccessAction | AuthRefreshFailureAction;