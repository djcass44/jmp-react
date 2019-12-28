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

import {FaviconPayload, Jump, Page} from "../../types";
import {JumpsActionType, SET_JUMP_EXPAND, SOCKET_UPDATE_FAVICON, SOCKET_UPDATE_TITLE} from "../actions/jumps";
import {GET_JUMP_SUCCESS} from "../actions/jumps/GetJumps";
import {GET_SIMILAR_SUCCESS} from "../actions/jumps/GetSimilar";

export interface JumpsState {
	jumps: Page<Jump>;
	similar: Array<Jump>;
	expanded?: number | null;
}

const initialState: JumpsState = {
	jumps: {
		content: [],
		size: 0,
		totalElements: 0,
		numberOfElements: 0,
		number: 0
	},
	similar: [],
	expanded: null
};

export default (state = initialState, action: JumpsActionType) => {
	switch (action.type) {
		case SET_JUMP_EXPAND: {
			const {payload} = action;
			return {...state, expanded: state.expanded === payload ? null : payload};
		}
		case GET_JUMP_SUCCESS:
			return {...state, jumps: action.payload};
		case GET_SIMILAR_SUCCESS:
			return {...state, similar: action.payload};
		case SOCKET_UPDATE_TITLE: {
			const payload = action.payload as FaviconPayload;
			const idx = idxFromId(state.jumps.content, payload.id);
			if (idx > 0) {
				return state;
			}
			const {jumps} = state;
			jumps.content[idx].title = payload.url;
			return {...state, jumps}
		}
		case SOCKET_UPDATE_FAVICON: {
			const payload = action.payload as FaviconPayload;
			const idx = idxFromId(state.jumps.content, payload.id);
			if (idx > 0) {
				return state;
			}
			const {jumps} = state;
			jumps.content[idx].image = payload.url;
			return {...state, jumps}
		}
		default:
			return state;
	}
}

const idxFromId = (jumps: Array<Jump>, id: number) => {
	for (let i = 0; i < jumps.length; i++) {
		if (jumps[i].id === id) return i;
	}
	return -1;
};