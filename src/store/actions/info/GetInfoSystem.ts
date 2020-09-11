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

import {RSAA, RSAAAction} from "redux-api-middleware";
import {BASE_URL, METHOD_GET} from "../../../constants";
import {SystemInfo} from "../../../config/types/SystemInfo";

export const GET_INFO_SYS = "GET_INFO_SYS";
export const GET_INFO_SYS_REQUEST = "GET_INFO_SYS_REQUEST";
export const GET_INFO_SYS_SUCCESS = "GET_INFO_SYS_SUCCESS";
export const GET_INFO_SYS_FAILURE = "GET_INFO_SYS_FAILURE";

interface GetInfoSystemRequestAction {
	type: typeof GET_INFO_SYS_REQUEST;
	payload: void;
}

interface GetInfoSystemSuccessAction {
	type: typeof GET_INFO_SYS_SUCCESS;
	payload: SystemInfo;
}

interface GetInfoSystemFailureAction {
	type: typeof GET_INFO_SYS_FAILURE;
	payload: Error;
}

export const getInfoSystem = (headers: Record<string, string>): RSAAAction => {
	return {
		[RSAA]: {
			endpoint: `${BASE_URL}/api/actuator/info`,
			method: METHOD_GET,
			headers,
			types: [GET_INFO_SYS_REQUEST, GET_INFO_SYS_SUCCESS, GET_INFO_SYS_FAILURE]
		}
	};
};

export type GetInfoSystemActionType =
	GetInfoSystemRequestAction
	| GetInfoSystemSuccessAction
	| GetInfoSystemFailureAction;