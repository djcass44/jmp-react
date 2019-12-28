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

import {GetJumpsActionType} from "./GetJumps";
import {Dispatch} from "redux";
import {GetSimilarActionType} from "./GetSimilar";
import {FaviconPayload} from "../../../types";

export const SET_JUMP_EXPAND = "SET_JUMP_EXPAND";

export const SOCKET_UPDATE_TITLE = "SOCKET_UPDATE_TITLE";
export const SOCKET_UPDATE_FAVICON = "SOCKET_UPDATE_FAVICON";

interface SetJumpExpandActionType {
	type: typeof SET_JUMP_EXPAND;
	payload: number | null;
}

interface SocketUpdateActionType {
	type: typeof SOCKET_UPDATE_TITLE | typeof SOCKET_UPDATE_FAVICON;
	payload: FaviconPayload;
}

export const setJumpExpand = (dispatch: Dispatch, id: number | null) => dispatch({type: SET_JUMP_EXPAND, payload: id});

export type JumpsActionType =
	GetJumpsActionType
	| GetSimilarActionType
	| SetJumpExpandActionType
	| SocketUpdateActionType;