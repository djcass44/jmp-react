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

import {Jump} from "../../../types";
import {Dispatch} from "redux";
import {RSAA} from "redux-api-middleware";
import {BASE_URL} from "../../../constants";

export const GET_SIMILAR = "GET_SIMILAR";
export const GET_SIMILAR_REQUEST = `${GET_SIMILAR}_REQUEST`;
export const GET_SIMILAR_SUCCESS = `${GET_SIMILAR}_SUCCESS`;
export const GET_SIMILAR_FAILURE = `${GET_SIMILAR}_FAILURE`;

interface GetSimilarRequestAction {
	type: typeof GET_SIMILAR_REQUEST;
	payload: string;
}

interface GetSimilarSuccessAction {
	type: typeof GET_SIMILAR_SUCCESS;
	payload: Array<Jump>;
}

interface GetSimilarFailureAction {
	type: typeof GET_SIMILAR_FAILURE;
	payload: Error;
}

export const getSimilar = (dispatch: Dispatch, headers: any, query: string): void => {
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2/similar/${query}`,
			method: "GET",
			headers,
			types: [GET_SIMILAR_REQUEST, GET_SIMILAR_SUCCESS, GET_SIMILAR_FAILURE]
		}
	});
};

export type GetSimilarActionType = GetSimilarRequestAction | GetSimilarSuccessAction | GetSimilarFailureAction;