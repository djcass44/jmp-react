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
import {Pair} from "../../../../types";

export const U2F_STATUS = "U2F_STATUS";
export const U2F_STATUS_REQUEST = "U2F_STATUS_REQUEST";
export const U2F_STATUS_SUCCESS = "U2F_STATUS_SUCCESS";
export const U2F_STATUS_FAILURE = "U2F_STATUS_FAILURE";

interface U2FStatusRequestAction {
	type: typeof U2F_STATUS_REQUEST;
}

interface U2FStatusSuccessAction {
	type: typeof U2F_STATUS_SUCCESS;
	payload: Pair<string | null, string>;
}

interface U2FStatusFailureAction {
	type: typeof U2F_STATUS_FAILURE;
	payload: Error;
}

export const u2FStatus = (dispatch: Dispatch, headers: any): void => {
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/u2f`,
			method: "GET",
			headers,
			types: [U2F_STATUS_REQUEST, U2F_STATUS_SUCCESS, U2F_STATUS_FAILURE]
		}
	});
};

export type U2FStatusActionType = U2FStatusRequestAction | U2FStatusSuccessAction | U2FStatusFailureAction;