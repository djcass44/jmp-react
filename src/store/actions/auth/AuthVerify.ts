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

import {User} from "../../../types";
import {Dispatch} from "redux";
import {RSAA} from "redux-api-middleware";
import {BASE_URL} from "../../../constants";
import {oauthRefresh} from "./AuthRefresh";

export const OAUTH_VERIFY = "OAUTH_VERIFY";
export const OAUTH_VERIFY_REQUEST = "OAUTH_VERIFY_REQUEST";
export const OAUTH_VERIFY_SUCCESS = "OAUTH_VERIFY_SUCCESS";
export const OAUTH_VERIFY_FAILURE = "OAUTH_VERIFY_FAILURE";

interface AuthVerifyRequestAction {
	type: typeof OAUTH_VERIFY_REQUEST;
}

interface AuthVerifySuccessAction {
	type: typeof OAUTH_VERIFY_SUCCESS;
	payload: User;
}

interface AuthVerifyFailureAction {
	type: typeof OAUTH_VERIFY_FAILURE;
	payload: Error;
}

export const oauthVerify = (dispatch: Dispatch, refresh: string, headers: any): void => {
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2/user/me`,
			method: "GET",
			headers,
			types: [OAUTH_VERIFY_REQUEST, OAUTH_VERIFY_SUCCESS, OAUTH_VERIFY_FAILURE]
		}
	}).catch(() => {
		oauthRefresh(dispatch, refresh, headers);
	})
};

export type AuthVerifyActionType = AuthVerifyRequestAction | AuthVerifySuccessAction | AuthVerifyFailureAction;