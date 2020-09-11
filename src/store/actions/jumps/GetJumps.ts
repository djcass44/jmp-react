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
import {Jump, Page} from "../../../types";
import {APP_NOUN, BASE_URL, METHOD_GET} from "../../../constants";

export const GET_JUMP = "GET_JUMP";
export const GET_JUMP_REQUEST = "GET_JUMP_REQUEST";
export const GET_JUMP_SUCCESS = "GET_JUMP_SUCCESS";
export const GET_JUMP_FAILURE = "GET_JUMP_FAILURE";

interface GetJumpsRequestAction {
	type: typeof GET_JUMP_REQUEST;
	payload: string;
}

export interface GetJumpsSuccessAction {
	type: typeof GET_JUMP_SUCCESS;
	payload: Page<Jump>;
}

interface GetJumpsFailureAction {
	type: typeof GET_JUMP_FAILURE;
	payload: Error;
}

export const getJumps = (headers: Record<string, string>, query = "", page = 0, size = 8): RSAAAction => {
	let queryString = `page=${page}&size=${size}`;
	if (query.length > 0) {
		queryString += `&query=${query}`;
	}
	return {
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2/jump?${queryString}`,
			method: METHOD_GET,
			headers,
			types: [GET_JUMP_REQUEST, GET_JUMP_SUCCESS, {
				type: GET_JUMP_FAILURE,
				meta: `Failed to load ${APP_NOUN}s`
			}]
		}
	};
};

export type GetJumpsActionType = GetJumpsRequestAction | GetJumpsSuccessAction | GetJumpsFailureAction;