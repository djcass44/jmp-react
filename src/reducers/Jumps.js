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

import {GET_SIMILAR, JUMP_LOAD, SOCKET_UPDATE_FAVICON, SOCKET_UPDATE_TITLE} from "../actions/Jumps";

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
		case SOCKET_UPDATE_TITLE: {
			let idx = indexFromId(state.jumps, action.data.id);
			if(idx < 0) {
				console.error(`${SOCKET_UPDATE_TITLE}: Failed to find item with id: ${action.data.id}`);
				return state;
			}
			const {jumps} = state;
			jumps[idx].title = action.data.url; // the name is for class reuse api-side
			return {...state, jumps};
		}
		case SOCKET_UPDATE_FAVICON: {
			let idx = indexFromId(state.jumps, action.data.id);
			if(idx < 0) {
				console.error(`${SOCKET_UPDATE_FAVICON}: Failed to find item with id: ${action.data.id}`);
				return state;
			}
			const {jumps} = state;
			jumps[idx].image = action.data.url; // the name is for class reuse api-side
			return {...state, jumps};
		}
		default:
			return state;
	}
};
function indexFromId(jumps, id) {
	for (let i = 0; i < jumps.length; i++) {
		if(jumps[i].id === id) return i;
	}
	return -1;
}
export default jumps;