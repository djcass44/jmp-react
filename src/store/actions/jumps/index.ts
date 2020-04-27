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

import {Dispatch} from "redux";
import {FaviconPayload} from "../../../types";
import {GET_SIMILAR} from "../../../actions/Jumps";
import {GetJumpsActionType} from "./GetJumps";
import {GetSimilarActionType, GetSimilarFailureAction} from "./GetSimilar";
import {DeleteJumpActionType} from "./DeleteJump";
import {PutJumpActionType} from "./PutJump";
import {PatchJumpActionType} from "./PatchJump";

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

export const getSimilarFail = (dispatch: Dispatch, error: any): GetSimilarFailureAction => dispatch({
	type: `${GET_SIMILAR}_FAILURE`,
	payload: error,
	error: true
});

export const setJumpExpand = (dispatch: Dispatch, id: number | null): SetJumpExpandActionType => dispatch({
	type: SET_JUMP_EXPAND,
	payload: id
});

export const setJumpOffset = (dispatch: Dispatch, offset: number): SetJumpOffsetActionType => dispatch({
	type: SET_JUMP_OFFSET,
	payload: offset
});

export const setJumpSearch = (dispatch: Dispatch, search: string): SetJumpSearchActionType => dispatch({
	type: SET_JUMP_SEARCH,
	payload: search
});

export type JumpsActionType =
	GetJumpsActionType
	| DeleteJumpActionType
	| PutJumpActionType
	| PatchJumpActionType
	| GetSimilarActionType
	| SetJumpExpandActionType
	| SetJumpOffsetActionType
	| SetJumpSearchActionType
	| SocketUpdateActionType;