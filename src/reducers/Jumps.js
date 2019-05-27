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

import {GET_SIMILAR, JUMP_LOAD} from "../actions/Jumps";

const jumps = (state = {jumps: [], similar: []}, action) => {
	switch (action.type) {
		case `${JUMP_LOAD}_SUCCESS`: {
			let items = action.data.map(i => {return i});
			return {...state, jumps: items}
		}
		case `${GET_SIMILAR}_SUCCESS`: {
			let items = action.data.map(i => {return i});
			return {...state, similar: items}
		}
		default:
			return state;
	}
};
export default jumps;