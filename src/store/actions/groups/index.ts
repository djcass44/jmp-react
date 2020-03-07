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

import {GetGroupsActionType} from "./GetGroups";
import {GetUserGroupsActionType} from "./GetUserGroups";
import {PatchGroupActionType} from "./PatchGroup";
import {PutGroupActionType} from "./PutGroup";
import {SetUserGroupsActionType} from "./SetUserGroups";
import {Dispatch} from "redux";

export const SET_GROUP_OFFSET = "SET_GROUP_OFFSET";

export const SOCKET_UPDATE_GROUPS = "EVENT_UPDATE_GROUP";

interface SetGroupOffsetActionType {
	type: typeof SET_GROUP_OFFSET;
	payload: number;
}

export const setGroupOffset = (dispatch: Dispatch, offset: number) => dispatch({
	type: SET_GROUP_OFFSET,
	payload: offset
});

export type GroupsActionType =
	GetGroupsActionType
	| SetGroupOffsetActionType
	| GetUserGroupsActionType
	| PatchGroupActionType
	| PutGroupActionType
	| SetUserGroupsActionType;