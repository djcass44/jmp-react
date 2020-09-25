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

import {Jump, Page} from "../../types";
import {
	JumpsActionType,
	SET_JUMP_EXPAND,
	SET_JUMP_OFFSET,
	SET_JUMP_SEARCH,
	SOCKET_UPDATE_FAVICON,
	SOCKET_UPDATE_TITLE
} from "../actions/jumps";
import {GET_JUMP_SUCCESS} from "../actions/jumps/GetJumps";
import {GET_SIMILAR_SUCCESS} from "../actions/jumps/GetSimilar";
import {getEmptyPage} from "../../util";
import {GET_TOP_PICKS_SUCCESS} from "../actions/jumps/GetTopPicks";

export interface JumpsState {
	jumps: Page<Jump>;
	similar: Array<Jump>;
	expanded?: number | null;
	offset: number;
	search: string;
	topPicks: Page<Jump>;
}

const initialState: JumpsState = {
	jumps: getEmptyPage(),
	similar: [],
	expanded: null,
	offset: 0,
	search: "",
	topPicks: getEmptyPage()
};

export default (state = initialState, action: JumpsActionType): JumpsState => {
	switch (action.type) {
		case SET_JUMP_EXPAND: {
			const {payload} = action;
			return {...state, expanded: state.expanded === payload ? null : payload};
		}
		case SET_JUMP_OFFSET:
			return {...state, offset: action.payload};
		case SET_JUMP_SEARCH:
			return {...state, search: action.payload};
		case GET_JUMP_SUCCESS: {
			const act = action;
			return {...state, jumps: act.payload, offset: act.payload.pageable?.offset || 0};
		}
		case GET_SIMILAR_SUCCESS:
			return {...state, similar: action.payload};
		case SOCKET_UPDATE_TITLE: {
			const {payload} = action;
			const idx = idxFromId(state.jumps.content, payload.id);
			if (idx < 0) {
				return state;
			}
			const {jumps} = state;
			jumps.content[idx].title = payload.url;
			return {...state, jumps};
		}
		case SOCKET_UPDATE_FAVICON: {
			const {payload} = action;
			const idx = idxFromId(state.jumps.content, payload.id);
			if (idx > 0) {
				return state;
			}
			const {jumps} = state;
			jumps.content[idx].image = payload.url;
			return {...state, jumps};
		}
		case GET_TOP_PICKS_SUCCESS:
			return {...state, topPicks: action.payload};
		default:
			return state;
	}
}

const idxFromId = (jumps: Array<Jump>, id: number): number => {
	for (let i = 0; i < jumps.length; i++) {
		if (jumps[i].id === id) return i;
	}
	return -1;
};