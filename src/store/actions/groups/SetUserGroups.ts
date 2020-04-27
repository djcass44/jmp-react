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
import {Group} from "../../../types";
import {BASE_URL} from "../../../constants";

export const SET_USER_GROUPS = "SET_USER_GROUPS";
export const SET_USER_GROUPS_REQUEST = "SET_USER_GROUPS_REQUEST";
export const SET_USER_GROUPS_SUCCESS = "SET_USER_GROUPS_SUCCESS";
export const SET_USER_GROUPS_FAILURE = "SET_USER_GROUPS_FAILURE";

interface SetUserGroupsRequestAction {
	type: typeof SET_USER_GROUPS_REQUEST;
	payload: void;
}

interface SetUserGroupsSuccessAction {
	type: typeof SET_USER_GROUPS_SUCCESS;
	payload: Array<Group>;
}

interface SetUserGroupsFailureAction {
	type: typeof SET_USER_GROUPS_FAILURE;
	payload: Error;
}

export const setUserGroups = (dispatch: Dispatch, headers: any, uid: string, payload: string): void => {
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2_1/group/mod?uid=${uid}`,
			method: "PATCH",
			headers,
			body: payload,
			types: [SET_USER_GROUPS_REQUEST, SET_USER_GROUPS_SUCCESS, SET_USER_GROUPS_FAILURE]
		}
	});
};

export type SetUserGroupsActionType =
	SetUserGroupsRequestAction
	| SetUserGroupsSuccessAction
	| SetUserGroupsFailureAction;