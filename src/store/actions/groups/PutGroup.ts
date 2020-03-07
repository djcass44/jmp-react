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

export const PUT_GROUP = "PUT_GROUP";
export const PUT_GROUP_REQUEST = "PUT_GROUP_REQUEST";
export const PUT_GROUP_SUCCESS = "PUT_GROUP_SUCCESS";
export const PUT_GROUP_FAILURE = "PUT_GROUP_FAILURE";

interface PutGroupRequestAction {
	type: typeof PUT_GROUP_REQUEST;
	payload: void;
}

interface PutGroupSuccessAction {
	type: typeof PUT_GROUP_SUCCESS;
	payload: void;
}

interface PutGroupFailureAction {
	type: typeof PUT_GROUP_FAILURE;
	payload: Error;
}

export const putGroup = (dispatch: Dispatch, headers: any, name: string): void => {
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2_1/group`,
			method: "PUT",
			headers,
			body: JSON.stringify({
				name,
				public: false,
				defaultFor: null
			}),
			types: [PUT_GROUP_REQUEST, PUT_GROUP_SUCCESS, PUT_GROUP_FAILURE]
		}
	});
};

export type PutGroupActionType = PutGroupRequestAction | PutGroupSuccessAction | PutGroupFailureAction;