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

import {FaviconPayload} from "../../../types";
import {GetJumpsActionType} from "./GetJumps";
import {GET_SIMILAR_FAILURE, GetSimilarActionType, GetSimilarFailureAction} from "./GetSimilar";
import {DeleteJumpActionType} from "./DeleteJump";
import {PutJumpActionType} from "./PutJump";
import {PatchJumpActionType} from "./PatchJump";
import {GetTopPicksActionType} from "./GetTopPicks";

export const SET_JUMP_EXPAND = "SET_JUMP_EXPAND";
export const SET_JUMP_OFFSET = "SET_JUMP_OFFSET";
export const SET_JUMP_SEARCH = "SET_JUMP_SEARCH";

export const SOCKET_UPDATE_JUMP = "EVENT_UPDATE";
export const SOCKET_UPDATE_TITLE = "EVENT_UPDATE_TITLE";
export const SOCKET_UPDATE_FAVICON = "SOCKET_UPDATE_FAVICON";

export interface SetJumpExpandActionType {
	type: typeof SET_JUMP_EXPAND;
	payload: number | null;
}

export interface SetJumpOffsetActionType {
	type: typeof SET_JUMP_OFFSET;
	payload: number;
}

export interface SetJumpSearchActionType {
	type: typeof SET_JUMP_SEARCH;
	payload: string;
}

interface SocketUpdateActionType {
	type: typeof SOCKET_UPDATE_TITLE | typeof SOCKET_UPDATE_FAVICON;
	payload: FaviconPayload;
}

export const getSimilarFail = (error: any): GetSimilarFailureAction => {
	return {
		type: GET_SIMILAR_FAILURE,
		payload: error,
		error: true
	};
}

export const setJumpExpand = (id: number | null): SetJumpExpandActionType => {
	return {
		type: SET_JUMP_EXPAND,
		payload: id
	};
}

export const setJumpOffset = (offset: number): SetJumpOffsetActionType => {
	return {
		type: SET_JUMP_OFFSET,
		payload: offset
	};
}
export type JumpsActionType =
	GetTopPicksActionType
	| GetJumpsActionType
	| DeleteJumpActionType
	| PutJumpActionType
	| PatchJumpActionType
	| GetSimilarActionType
	| SetJumpExpandActionType
	| SetJumpOffsetActionType
	| SetJumpSearchActionType
	| SocketUpdateActionType;