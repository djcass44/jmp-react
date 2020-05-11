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
import {Group, Page} from "../../../types";
import {BASE_URL} from "../../../constants";

export const GROUP_LOAD = "GROUP_LOAD";
export const GROUP_LOAD_REQUEST = "GROUP_LOAD_REQUEST";
export const GROUP_LOAD_SUCCESS = "GROUP_LOAD_SUCCESS";
export const GROUP_LOAD_FAILURE = "GROUP_LOAD_FAILURE";

interface GetGroupsRequestAction {
	type: typeof GROUP_LOAD_REQUEST;
	payload: void;
}

interface GetGroupsSuccessAction {
	type: typeof GROUP_LOAD_SUCCESS;
	payload: Page<Group>;
}

interface GetGroupsFailureAction {
	type: typeof GROUP_LOAD_FAILURE;
	payload: Error;
}

export const getGroups = (dispatch: Dispatch, headers: any, query = "", page = 0, size = 8): void => {
	let queryString = `page=${page}&size=${size}`;
	if (query.length > 0) {
		queryString += `&query=${query}`;
	}
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2_1/group?${queryString}`,
			method: "GET",
			headers,
			types: [
				GROUP_LOAD_REQUEST,
				GROUP_LOAD_SUCCESS,
				{
					type: GROUP_LOAD_FAILURE,
					meta: "Something went wrong loading groups"
				}
			]
		}
	});
};

export type GetGroupsActionType = GetGroupsRequestAction | GetGroupsSuccessAction | GetGroupsFailureAction;