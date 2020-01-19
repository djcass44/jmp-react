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

export const U2F_CREATE_RESPONSE = "U2F_CREATE_RESPONSE";
export const U2F_CREATE_RESPONSE_REQUEST = "U2F_CREATE_RESPONSE_REQUEST";
export const U2F_CREATE_RESPONSE_SUCCESS = "U2F_CREATE_RESPONSE_SUCCESS";
export const U2F_CREATE_RESPONSE_FAILURE = "U2F_CREATE_RESPONSE_FAILURE";

interface U2FCreateResponseRequestAction {
	type: typeof U2F_CREATE_RESPONSE_REQUEST;
}

interface U2FCreateResponseSuccessAction {
	type: typeof U2F_CREATE_RESPONSE_SUCCESS;
	payload: PublicKeyCredentialCreationOptions;
}

interface U2FCreateResponseFailureAction {
	type: typeof U2F_CREATE_RESPONSE_FAILURE;
	payload: Error;
}

export const u2fCreateResponse = (dispatch: Dispatch, headers: any, credential: Credential): void => {
	console.dir(credential, JSON.stringify(credential));
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/u2f/register/callback`,
			method: "POST",
			headers,
			body: JSON.stringify(credential),
			types: [U2F_CREATE_RESPONSE_REQUEST, U2F_CREATE_RESPONSE_SUCCESS, U2F_CREATE_RESPONSE_FAILURE]
		}
	});
};

export type U2FCreateResponseActionType =
	U2FCreateResponseRequestAction
	| U2FCreateResponseSuccessAction
	| U2FCreateResponseFailureAction;