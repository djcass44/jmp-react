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
import {Token} from "../../../types";
import {BASE_URL, METHOD_POST} from "../../../constants";
import {oauthVerify} from "./AuthVerify";
import {OAUTH_REFRESH_SUCCESS} from "./AuthRefresh";

export const OAUTH_REQUEST = "OAUTH_REQUEST";
export const OAUTH_REQUEST_REQUEST = "OAUTH_REQUEST_REQUEST";
export const OAUTH_REQUEST_SUCCESS = "OAUTH_REQUEST_SUCCESS";
export const OAUTH_REQUEST_FAILURE = "OAUTH_REQUEST_FAILURE";

interface AuthRequestRequestAction {
	type: typeof OAUTH_REQUEST_REQUEST;
}

interface AuthRequestSuccessAction {
	type: typeof OAUTH_REQUEST_SUCCESS | typeof OAUTH_REFRESH_SUCCESS;
	payload: Token;
}

interface AuthRequestFailureAction {
	type: typeof OAUTH_REQUEST_FAILURE;
	payload: Error;
}

export const oauthRequest = (dispatch: Dispatch, data: any): void => {
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/auth/login`,
			method: METHOD_POST,
			body: JSON.stringify(data),
			types: [OAUTH_REQUEST_REQUEST, OAUTH_REQUEST_SUCCESS, OAUTH_REQUEST_FAILURE]
		}
	}).then((r) => {
		// retry verification
		const payload = r.payload as Token;
		oauthVerify(dispatch, payload.refresh, {"Authorization": `Bearer ${payload.request}`});
	});
};

export type AuthRequestActionType = AuthRequestRequestAction | AuthRequestSuccessAction | AuthRequestFailureAction;