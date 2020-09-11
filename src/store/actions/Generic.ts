/*
 *    Copyright 2020 Django Cass
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

import {RSAA, RSAAAction} from "redux-api-middleware";
import {BASE_URL, METHOD_GET} from "../../constants";

export const SET_THEME_MODE = "SET_THEME_MODE";
export const SET_GRID_WIDTH = "SET_GRID_WIDTH";
export const SET_GENERIC_SEARCH = "SET_GENERIC_SEARCH";

export const GET_TARGET = "GET_TARGET";
export const GET_TARGET_REQUEST = "GET_TARGET_REQUEST";
export const GET_TARGET_SUCCESS = "GET_TARGET_SUCCESS";
export const GET_TARGET_FAILURE = "GET_TARGET_FAILURE";

interface SetThemeModeActionType {
	type: typeof SET_THEME_MODE;
	payload: string;
}

interface SetGridWidthActionType {
	type: typeof SET_GRID_WIDTH;
	payload: number;
}

interface SetGenericSearchActionType {
	type: typeof SET_GENERIC_SEARCH;
	payload: string;
}

interface GetTargetRequestActionType {
	type: typeof GET_TARGET_REQUEST;
}

interface GetTargetSuccessActionType {
	type: typeof GET_TARGET_SUCCESS;
	payload: {
		found: boolean;
		location: string;
	};
}

interface GetTargetFailureActionType {
	type: typeof GET_TARGET_FAILURE;
}

export const setThemeMode = (theme: string): SetThemeModeActionType => {
	return {
		type: SET_THEME_MODE,
		payload: theme
	};
};

export const setGridWidth = (width: number): SetGridWidthActionType => {
	return {
		type: SET_GRID_WIDTH,
		payload: width
	};
};

export const setGenericSearch = (search: string): SetGenericSearchActionType => {
	return {
		type: SET_GENERIC_SEARCH,
		payload: search
	};
};

export const getTarget = (path: string, query: string, headers: Record<string, string>): RSAAAction => {
	return {
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2/jump/${encodeURIComponent(btoa(path))}${query}`,
			method: METHOD_GET,
			headers,
			types: [GET_TARGET_REQUEST, GET_TARGET_SUCCESS, GET_TARGET_FAILURE]
		}
	};
};

export type GenericActionType = SetThemeModeActionType
	| SetGridWidthActionType
	| SetGenericSearchActionType
	| GetTargetRequestActionType
	| GetTargetSuccessActionType
	| GetTargetFailureActionType;