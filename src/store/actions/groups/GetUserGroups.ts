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

import {Group} from "../../../types";
import {Dispatch} from "redux";
import {RSAA} from "redux-api-middleware";
import {BASE_URL} from "../../../constants";

export const GET_USER_GROUPS = "GET_USER_GROUPS";
export const GET_USER_GROUPS_REQUEST = "GET_USER_GROUPS_REQUEST";
export const GET_USER_GROUPS_SUCCESS = "GET_USER_GROUPS_SUCCESS";
export const GET_USER_GROUPS_FAILURE = "GET_USER_GROUPS_FAILURE";

interface GetUserGroupsRequestAction {
	type: typeof GET_USER_GROUPS_REQUEST;
	payload: void;
}

interface GetUserGroupsSuccessAction {
	type: typeof GET_USER_GROUPS_SUCCESS;
	payload: Array<Group>;
}

interface GetUserGroupsFailureAction {
	type: typeof GET_USER_GROUPS_FAILURE;
	payload: Error;
}

export const getUserGroups = (dispatch: Dispatch, headers: any, uid: string): void => {
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2/user/groups?uid=${uid}`,
			method: "GET",
			headers,
			types: [GET_USER_GROUPS_REQUEST, GET_USER_GROUPS_SUCCESS, GET_USER_GROUPS_FAILURE]
		}
	});
};

export type GetUserGroupsActionType =
	GetUserGroupsRequestAction
	| GetUserGroupsSuccessAction
	| GetUserGroupsFailureAction;