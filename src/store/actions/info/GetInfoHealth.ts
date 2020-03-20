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
import {RSAA} from "redux-api-middleware";
import {BASE_URL} from "../../../constants";

export const GET_INFO_STAT = "GET_INFO_STAT";
export const GET_INFO_STAT_REQUEST = "GET_INFO_STAT_REQUEST";
export const GET_INFO_STAT_SUCCESS = "GET_INFO_STAT_SUCCESS";
export const GET_INFO_STAT_FAILURE = "GET_INFO_STAT_FAILURE";

interface GetInfoHealthRequestAction {
	type: typeof GET_INFO_STAT_REQUEST;
	payload: void;
}

interface GetInfoHealthSuccessAction {
	type: typeof GET_INFO_STAT_SUCCESS;
	payload: any;
}

interface GetInfoHealthFailureAction {
	type: typeof GET_INFO_STAT_FAILURE;
	payload: Error;
}

export const getInfoHealth = (dispatch: Dispatch, headers: any): void => {
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/actuator/health`,
			method: "GET",
			headers,
			types: [GET_INFO_STAT_REQUEST, GET_INFO_STAT_SUCCESS, GET_INFO_STAT_FAILURE]
		}
	});
};

export type GetInfoHealthActionType =
	GetInfoHealthRequestAction
	| GetInfoHealthSuccessAction
	| GetInfoHealthFailureAction;