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
import {Page, User} from "../../../types";
import {BASE_URL} from "../../../constants";

export const USER_LOAD = "USER_LOAD";
export const USER_LOAD_REQUEST = "USER_LOAD_REQUEST";
export const USER_LOAD_SUCCESS = "USER_LOAD_SUCCESS";
export const USER_LOAD_FAILURE = "USER_LOAD_FAILURE";


interface GetUsersRequestAction {
	type: typeof USER_LOAD_REQUEST;
	payload: void;
}

interface GetUsersSuccessAction {
	type: typeof USER_LOAD_SUCCESS;
	payload: Page<User>;
}

interface GetUsersFailureAction {
	type: typeof USER_LOAD_FAILURE;
	payload: Error;
}

export const getUsers = (headers: any, query = "", page = 0, size = 8): RSAAAction => {
	let queryString = `page=${page}&size=${size}`;
	if (query.length > 0) {
		queryString += `&query=${query}`;
	}
	return {
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2/user?${queryString}`,
			method: "GET",
			headers,
			types: [USER_LOAD_REQUEST, USER_LOAD_SUCCESS, USER_LOAD_FAILURE]
		}
	};
};

export type GetUsersActionType = GetUsersRequestAction | GetUsersSuccessAction | GetUsersFailureAction;
