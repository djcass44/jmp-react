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
import {Jump} from "../../../types";
import {BASE_URL} from "../../../constants";

export const GET_SIMILAR = "GET_SIMILAR";
export const GET_SIMILAR_REQUEST = "GET_SIMILAR_REQUEST";
export const GET_SIMILAR_SUCCESS = "GET_SIMILAR_SUCCESS";
export const GET_SIMILAR_FAILURE = "GET_SIMILAR_FAILURE";

interface GetSimilarRequestAction {
	type: typeof GET_SIMILAR_REQUEST;
	payload: void;
}

export interface GetSimilarSuccessAction {
	type: typeof GET_SIMILAR_SUCCESS;
	payload: Array<Jump>;
}

export interface GetSimilarFailureAction {
	type: typeof GET_SIMILAR_FAILURE;
	payload: Error;
	error?: boolean;
}

export const getSimilar = (headers: any, query: string): RSAAAction => {
	return {
		[RSAA]: {
			endpoint: `${BASE_URL}/api/v2/similar/${query}`,
			method: "GET",
			headers,
			types: [GET_SIMILAR_REQUEST, GET_SIMILAR_SUCCESS, GET_SIMILAR_FAILURE]
		}
	};
};

export type GetSimilarActionType = GetSimilarRequestAction | GetSimilarSuccessAction | GetSimilarFailureAction;