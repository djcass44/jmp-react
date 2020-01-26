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

import {Pair} from "../../../types";
import {Dispatch} from "redux";
import {RSAA} from "redux-api-middleware";
import {BASE_URL} from "../../../constants";

export const DISCOVER_OAUTH = "DISCOVER_OAUTH";
export const DISCOVER_OAUTH_REQUEST = "DISCOVER_OAUTH_REQUEST";
export const DISCOVER_OAUTH_SUCCESS = "DISCOVER_OAUTH_SUCCESS";
export const DISCOVER_OAUTH_FAILURE = "DISCOVER_OAUTH_FAILURE";

interface DiscoverOAuthRequestAction {
	type: typeof DISCOVER_OAUTH_REQUEST;
}

interface DiscoverOAuthSuccessAction {
	type: typeof DISCOVER_OAUTH_SUCCESS;
	payload: Pair<string, string>;
}

interface DiscoverOAuthFailureAction {
	type: typeof DISCOVER_OAUTH_FAILURE;
	payload: Error;
}

export const discoverOAuth = (dispatch: Dispatch, name: string): void => {
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/oauth2/${name}`,
			method: "GET",
			types: [DISCOVER_OAUTH_REQUEST, DISCOVER_OAUTH_SUCCESS, DISCOVER_OAUTH_FAILURE]
		}
	});
};

export type DiscoverOAuthActionType =
	DiscoverOAuthRequestAction
	| DiscoverOAuthSuccessAction
	| DiscoverOAuthFailureAction;