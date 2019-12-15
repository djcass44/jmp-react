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

import {
	GET_SIMILAR,
	GET_TARGET,
	JUMP_LOAD,
	JUMP_SET,
	JUMP_SET_EXPAND,
	SOCKET_UPDATE_FAVICON,
	SOCKET_UPDATE_TITLE
} from "../actions/Jumps";

const initialState = {
	jumps: [],
	similar: [],
	expanded: null,
	target: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case JUMP_SET_EXPAND: {
			const {payload} = action;
			return {...state, expanded: state.expanded === payload ? null : payload};
		}
		case `${GET_TARGET}_SUCCESS`:
			return {...state, target: action.payload};
		case JUMP_SET:
		case `${JUMP_LOAD}_SUCCESS`:
			return {...state, jumps: action.payload};
		case `${GET_SIMILAR}_SUCCESS`:
			return {...state, similar: action.payload};
		case SOCKET_UPDATE_TITLE: {
			const {payload} = action;
			const idx = indexFromId(state.jumps, payload.id);
			if (idx < 0) {
				console.error(`${SOCKET_UPDATE_TITLE}: Failed to find item with id: ${payload.id}`);
				return state;
			}
			const j = state.jumps;
			j[idx].title = payload.url; // the name is for class reuse api-side
			return {...state, jumps: j};
		}
		case SOCKET_UPDATE_FAVICON: {
			const {payload} = action;
			const idx = indexFromId(state.jumps, payload.id);
			if (idx < 0) {
				console.error(`${SOCKET_UPDATE_FAVICON}: Failed to find item with id: ${payload.id}`);
				return state;
			}
			const j = state.jumps;
			j[idx].image = payload.url; // the name is for class reuse api-side
			return {...state, jumps: j};
		}
		default:
			return state;
	}
};
function indexFromId(item, id) {
	for (let i = 0; i < item.length; i++) {
		if(item[i].id === id) return i;
	}
	return -1;
}
