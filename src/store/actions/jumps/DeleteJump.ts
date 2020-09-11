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
import {BASE_URL, METHOD_DELETE} from "../../../constants";

export const DELETE_JUMP = "DELETE_JUMP";
export const DELETE_JUMP_REQUEST = "DELETE_JUMP_REQUEST";
export const DELETE_JUMP_SUCCESS = "DELETE_JUMP_SUCCESS";
export const DELETE_JUMP_FAILURE = "DELETE_JUMP_FAILURE";

interface DeleteJumpRequestAction {
	type: typeof DELETE_JUMP_REQUEST;
	payload: string;
}

interface DeleteJumpSuccessAction {
	type: typeof DELETE_JUMP_SUCCESS;
	payload: void;
}

interface DeleteJumpFailureAction {
	type: typeof DELETE_JUMP_FAILURE;
	payload: Error;
}

export const deleteJump = (headers: Record<string, string>, id: string): RSAAAction => {
	return {
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2/jump/${id}`,
			method: METHOD_DELETE,
			headers,
			types: [DELETE_JUMP_REQUEST, DELETE_JUMP_SUCCESS, DELETE_JUMP_FAILURE]
		}
	};
};

export type DeleteJumpActionType = DeleteJumpRequestAction | DeleteJumpSuccessAction | DeleteJumpFailureAction;