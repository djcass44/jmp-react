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
import {RSAA, RSAAAction} from "redux-api-middleware";
import {BASE_URL} from "../../../constants";

export const PATCH_USER_ROLE = "PATCH_USER_ROLE";
export const PATCH_USER_ROLE_REQUEST = "PATCH_USER_ROLE_REQUEST";
export const PATCH_USER_ROLE_SUCCESS = "PATCH_USER_ROLE_SUCCESS";
export const PATCH_USER_ROLE_FAILURE = "PATCH_USER_ROLE_FAILURE";


interface PatchUserRoleRequestAction {
	type: typeof PATCH_USER_ROLE_REQUEST;
	payload: void;
}

interface PatchUserRoleSuccessAction {
	type: typeof PATCH_USER_ROLE_SUCCESS;
	payload: void;
}

interface PatchUserRoleFailureAction {
	type: typeof PATCH_USER_ROLE_FAILURE;
	payload: Error;
}

export const patchUserRole = (headers: any, uid: string, admin = false): RSAAAction => {
	return {
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2/user?uid=${uid}&admin=${admin}`,
			method: "PATCH",
			headers,
			types: [PATCH_USER_ROLE_REQUEST, PATCH_USER_ROLE_SUCCESS, PATCH_USER_ROLE_FAILURE]
		}
	};
};

export type PatchUserRoleActionType =
	PatchUserRoleRequestAction
	| PatchUserRoleSuccessAction
	| PatchUserRoleFailureAction;
