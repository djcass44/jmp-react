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

import {Group, Page} from "../../types";
import {GROUP_LOAD_SUCCESS} from "../actions/groups/GetGroups";
import {GET_USER_GROUPS_SUCCESS} from "../actions/groups/GetUserGroups";
import {GroupsActionType, SET_GROUP_OFFSET} from "../actions/groups";

export interface GroupsState {
	groups: Page<Group>;
	userGroups: Array<Group>;
	offset: number;
}

const initialState: GroupsState = {
	groups: {
		content: [],
		size: 0,
		totalPages: 0,
		totalElements: 0,
		numberOfElements: 0,
		number: 0
	},
	userGroups: [],
	offset: 0
};

export default (state = initialState, action: GroupsActionType) => {
	switch (action.type) {
		case GROUP_LOAD_SUCCESS:
			return {...state, groups: action.payload};
		case GET_USER_GROUPS_SUCCESS:
			return {...state, userGroups: action.payload};
		case SET_GROUP_OFFSET:
			return {...state, offset: action.payload};
		default:
			return state;
	}
};
