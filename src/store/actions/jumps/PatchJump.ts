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

export const PATCH_JUMP = "PATCH_JUMP";
export const PATCH_JUMP_REQUEST = "PATCH_JUMP_REQUEST";
export const PATCH_JUMP_SUCCESS = "PATCH_JUMP_SUCCESS";
export const PATCH_JUMP_FAILURE = "PATCH_JUMP_FAILURE";

interface PatchJumpRequestAction {
	type: typeof PATCH_JUMP_REQUEST;
	payload: string;
}

interface PatchJumpSuccessAction {
	type: typeof PATCH_JUMP_SUCCESS;
	payload: void;
}

interface PatchJumpFailureAction {
	type: typeof PATCH_JUMP_FAILURE;
	payload: Error;
}

export const patchJump = (dispatch: Dispatch, headers: any, jump: string): void => {
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2/jump`,
			method: "PUT",
			headers,
			body: jump,
			types: [PATCH_JUMP_REQUEST, PATCH_JUMP_SUCCESS, PATCH_JUMP_FAILURE]
		}
	});
};

export type PatchJumpActionType = PatchJumpRequestAction | PatchJumpSuccessAction | PatchJumpFailureAction;