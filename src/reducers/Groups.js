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

import {GET_USER_GROUPS, GROUP_LOAD} from "../actions/Groups";

const groups = (state = {
	groups: [],
	userGroups: []
}, action) => {
	switch (action.type) {
		case `${GROUP_LOAD}_SUCCESS`: {
			let g = [];
			action.data.forEach(i => { g.push(i) });
			return {...state, groups: g}
		}
		case `${GET_USER_GROUPS}_SUCCESS`: {
			let g = [];
			action.data.forEach(item => {g.push(item)});
			return {...state, userGroups: g}
		}
		default:
			return state;

	}
};
export default groups;