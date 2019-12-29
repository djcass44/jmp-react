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

import {Jump, Page} from "../../../types";
import {Dispatch} from "redux";
import {RSAA} from "redux-api-middleware";
import {BASE_URL} from "../../../constants";

export const GET_JUMP = "GET_JUMP";
export const GET_JUMP_REQUEST = "GET_JUMP_REQUEST";
export const GET_JUMP_SUCCESS = "GET_JUMP_SUCCESS";
export const GET_JUMP_FAILURE = "GET_JUMP_FAILURE";

interface GetJumpsRequestAction {
	type: typeof GET_JUMP_REQUEST;
	payload: string;
}

interface GetJumpsSuccessAction {
	type: typeof GET_JUMP_SUCCESS;
	payload: Page<Jump>;
}

interface GetJumpsFailureAction {
	type: typeof GET_JUMP_FAILURE;
	payload: Error;
}

export const getJumps = (dispatch: Dispatch, headers: any, query = "", page = 0, size = 8): void => {
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2/jump?query=${query}&page=${page}&size=${size}`,
			method: "GET",
			headers,
			types: [GET_JUMP_REQUEST, GET_JUMP_SUCCESS, GET_JUMP_FAILURE]
		}
	});
};

export type GetJumpsActionType = GetJumpsRequestAction | GetJumpsSuccessAction | GetJumpsFailureAction;