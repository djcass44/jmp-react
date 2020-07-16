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

import {Page, User} from "../../types";
import {USER_LOAD_SUCCESS} from "../actions/users/GetUsers";
import {SET_USER_OFFSET, SET_USER_SEARCH, UsersActionType} from "../actions/users";

export interface UsersState {
	users: Page<User>;
	offset: number;
	search: string;
}

const initialState: UsersState = {
	users: {
		content: [],
		size: 0,
		totalPages: 0,
		totalElements: 0,
		numberOfElements: 0,
		number: 0
	},
	offset: 0,
	search: ""
};

export default (state = initialState, action: UsersActionType): UsersState => {
	switch (action.type) {
		case USER_LOAD_SUCCESS:
			return {...state, users: action.payload};
		case SET_USER_OFFSET:
			return {...state, offset: action.payload};
		case SET_USER_SEARCH:
			return {...state, search: action.payload};
		default:
			return state;
	}
}