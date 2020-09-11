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
import {Token} from "../../../types";
import {BASE_URL, METHOD_POST} from "../../../constants";

export const OAUTH2_LOGOUT = "OAUTH2_LOGOUT";
export const OAUTH2_LOGOUT_REQUEST = "OAUTH2_LOGOUT_REQUEST";
export const OAUTH2_LOGOUT_SUCCESS = "OAUTH2_LOGOUT_SUCCESS";
export const OAUTH2_LOGOUT_FAILURE = "OAUTH2_LOGOUT_FAILURE";

interface OAuth2LogoutRequestAction {
	type: typeof OAUTH2_LOGOUT_REQUEST;
}

interface OAuth2LogoutSuccessAction {
	type: typeof OAUTH2_LOGOUT_SUCCESS;
	payload: Token;
}

interface OAuth2LogoutFailureAction {
	type: typeof OAUTH2_LOGOUT_FAILURE;
	payload: Error;
}

export const oauth2Logout = (accessToken: string, source: string, headers: Record<string, string>): RSAAAction => {
	// strip the leading 'oauth2/'
	const sourceName = source.startsWith("oauth2/") ? source.split("/")[1] : source;
	return {
		[RSAA]: {
			endpoint: `${BASE_URL}/api/oauth2/logout/${sourceName}?accessToken=${accessToken}`,
			method: METHOD_POST,
			headers,
			types: [
				OAUTH2_LOGOUT_REQUEST,
				OAUTH2_LOGOUT_SUCCESS,
				{
					type: OAUTH2_LOGOUT_FAILURE,
					meta: "An error occurred trying to logout"
				}
			]
		}
	};
};

export type OAuth2LogoutActionType = OAuth2LogoutRequestAction | OAuth2LogoutSuccessAction | OAuth2LogoutFailureAction;