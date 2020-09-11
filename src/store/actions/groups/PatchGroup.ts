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
import {BASE_URL, METHOD_PATCH} from "../../../constants";
import {Group} from "../../../types";

export const PATCH_GROUP = "PATCH_GROUP";
export const PATCH_GROUP_REQUEST = "PATCH_GROUP_REQUEST";
export const PATCH_GROUP_SUCCESS = "PATCH_GROUP_SUCCESS";
export const PATCH_GROUP_FAILURE = "PATCH_GROUP_FAILURE";

interface PatchGroupRequestAction {
	type: typeof PATCH_GROUP_REQUEST;
	payload: void;
}

interface PatchGroupSuccessAction {
	type: typeof PATCH_GROUP_SUCCESS;
	payload: void;
}

interface PatchGroupFailureAction {
	type: typeof PATCH_GROUP_FAILURE;
	payload: Error;
}

export const patchGroup = (headers: Record<string, string>, group: Group): RSAAAction => {
	return {
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2_1/group`,
			method: METHOD_PATCH,
			headers,
			body: JSON.stringify(group),
			types: [PATCH_GROUP_REQUEST, PATCH_GROUP_SUCCESS, PATCH_GROUP_FAILURE]
		}
	};
};

export type PatchGroupActionType = PatchGroupRequestAction | PatchGroupSuccessAction | PatchGroupFailureAction;