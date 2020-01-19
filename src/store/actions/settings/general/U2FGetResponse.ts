/*
 *    Copyright 2020 Django Cass
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
import {BASE_URL} from "../../../../constants";
import {Token} from "../../../../types";
import {oauthVerify} from "../../auth/AuthVerify";

export const U2F_GET_RESPONSE = "U2F_GET_RESPONSE";
export const U2F_GET_RESPONSE_REQUEST = "U2F_GET_RESPONSE_REQUEST";
export const U2F_GET_RESPONSE_SUCCESS = "U2F_GET_RESPONSE_SUCCESS";
export const U2F_GET_RESPONSE_FAILURE = "U2F_GET_RESPONSE_FAILURE";

interface U2FGetResponseRequestAction {
	type: typeof U2F_GET_RESPONSE_REQUEST;
}

interface U2FGetResponseSuccessAction {
	type: typeof U2F_GET_RESPONSE_SUCCESS;
	payload: Token;
}

interface U2FGetResponseFailureAction {
	type: typeof U2F_GET_RESPONSE_FAILURE;
	payload: Error;
}

export const u2FGetResponse = (dispatch: Dispatch, credential: Credential, userId: string): void => {
	console.dir(credential, JSON.stringify(credential));
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/a2/login/callback?userId=${userId}`,
			method: "POST",
			body: JSON.stringify(credential),
			types: [U2F_GET_RESPONSE_REQUEST, U2F_GET_RESPONSE_SUCCESS, U2F_GET_RESPONSE_FAILURE]
		}
	}).then((r) => {
		// retry verification
		const payload = r.payload as Token;
		oauthVerify(dispatch, payload.refresh, {'Authorization': `Bearer ${payload.request}`});
	});
};

export type U2FGetResponseActionType =
	U2FGetResponseRequestAction
	| U2FGetResponseSuccessAction
	| U2FGetResponseFailureAction;