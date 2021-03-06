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

import {RSAA, RSAAAction} from "redux-api-middleware";
import {BASE_URL, METHOD_POST} from "../../../constants";

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

export const oauthLogout = (accessToken: string, headers: Record<string, string>): RSAAAction => {
	return {
		[RSAA]: {
			endpoint: `${BASE_URL}/api/auth/logout?accessToken=${accessToken}`,
			method: METHOD_POST,
			headers,
			types: [
				OAUTH_LOGOUT_REQUEST,
				OAUTH_LOGOUT_SUCCESS,
				{
					type: OAUTH_LOGOUT_FAILURE,
					meta: "An error occurred trying to logout"
				}
			]
		}
	};
};

export type AuthLogoutActionType = AuthLogoutAction | AuthLogoutFailureAction;