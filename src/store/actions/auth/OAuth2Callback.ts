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
import {BASE_URL, METHOD_GET} from "../../../constants";

export const OAUTH2_CALLBACK = "OAUTH2_CALLBACK";
export const OAUTH2_CALLBACK_REQUEST = "OAUTH2_CALLBACK_REQUEST";
export const OAUTH2_CALLBACK_SUCCESS = "OAUTH2_CALLBACK_SUCCESS";
export const OAUTH2_CALLBACK_FAILURE = "OAUTH2_CALLBACK_FAILURE";

interface OAuth2CallbackRequestAction {
	type: typeof OAUTH2_CALLBACK_REQUEST;
}

interface OAuth2CallbackSuccessAction {
	type: typeof OAUTH2_CALLBACK_SUCCESS;
	payload: Token;
}

interface OAuth2CallbackFailureAction {
	type: typeof OAUTH2_CALLBACK_FAILURE;
	payload: Error;
}

export const oauth2Callback = (query: string): RSAAAction => {
	return {
		[RSAA]: {
			endpoint: `${BASE_URL}/api/oauth2/callback?${query}`,
			method: METHOD_GET,
			types: [
				OAUTH2_CALLBACK_REQUEST,
				OAUTH2_CALLBACK_SUCCESS,
				{
					type: OAUTH2_CALLBACK_FAILURE,
					meta: "An error occurred during login"
				}
			]
		}
	};
};

export type OAuth2CallbackActionType =
	OAuth2CallbackRequestAction
	| OAuth2CallbackSuccessAction
	| OAuth2CallbackFailureAction;