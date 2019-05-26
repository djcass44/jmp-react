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

import {GENERIC_FILTER_SET, GENERIC_GET_VERSION} from "../actions/Generic";

const generic = (state = {
	searchFilter: ''
}, action) => {
	switch(action.type) {
		case `${GENERIC_FILTER_SET}_REQUEST`: {
			return {...state, searchFilter: action.data}
		}
		case `${GENERIC_GET_VERSION}_SUCCESS`: {
			return {...state, version: action.data}
		}
		default:
			return state;
	}
};
export default generic;