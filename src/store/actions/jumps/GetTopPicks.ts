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
import {Jump, Page} from "../../../types";
import {BASE_URL, METHOD_GET} from "../../../constants";

export const GET_TOP_PICKS = "GET_TOP_PICKS";
const GET_TOP_PICKS_REQUEST = "GET_TOP_PICKS_REQUEST";
export const GET_TOP_PICKS_SUCCESS = "GET_TOP_PICKS_SUCCESS";
const GET_TOP_PICKS_FAILURE = "GET_TOP_PICKS_FAILURE";

interface GetTopPicksRequestActionType {
	type: typeof GET_TOP_PICKS_REQUEST;
}

interface GetTopPicksSuccessActionType {
	type: typeof GET_TOP_PICKS_SUCCESS;
	payload: Page<Jump>;
}

interface GetTopPicksFailureActionType {
	type: typeof GET_TOP_PICKS_FAILURE;
}

export const getTopPicks = (headers: Record<string, string>, amount: number = 2): RSAAAction => {
	return {
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2/analytics/jump/top?amount=${amount}`,
			method: METHOD_GET,
			headers,
			types: [GET_TOP_PICKS_REQUEST, GET_TOP_PICKS_SUCCESS, GET_TOP_PICKS_FAILURE]
		}
	};
};

export type GetTopPicksActionType =
	GetTopPicksRequestActionType |
	GetTopPicksSuccessActionType |
	GetTopPicksFailureActionType;