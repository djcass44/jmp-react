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

import {Dispatch} from "redux";
import {RSAA} from "redux-api-middleware";
import {BASE_URL} from "../../../constants";

export const OAUTH_LOGOUT = "OAUTH_LOGOUT";
export const OAUTH_LOGOUT_REQUEST = "OAUTH_LOGOUT_REQUEST";
export const OAUTH_LOGOUT_SUCCESS = "OAUTH_LOGOUT_SUCCESS";
export const OAUTH_LOGOUT_FAILURE = "OAUTH_LOGOUT_FAILURE";

interface AuthLogoutAction {
	type: typeof OAUTH_LOGOUT_SUCCESS | typeof OAUTH_LOGOUT_REQUEST;
}

interface AuthLogoutFailureAction {
	type: typeof OAUTH_LOGOUT_FAILURE;
	payload: Error;
}

export const oauthLogout = (dispatch: Dispatch, accessToken: string, headers: any): void => {
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/a2/logout?accessToken=${accessToken}`,
			method: "POST",
			headers,
			types: [OAUTH_LOGOUT_REQUEST, OAUTH_LOGOUT_SUCCESS, OAUTH_LOGOUT_FAILURE]
		}
	});
};

export type AuthLogoutActionType = AuthLogoutAction | AuthLogoutFailureAction;