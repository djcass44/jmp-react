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

import {Dispatch} from "redux";
import {RSAA} from "redux-api-middleware";
import {BASE_URL} from "../../../../constants";

export const U2F_CHALLENGE = "U2F_CHALLENGE";
export const U2F_CHALLENGE_REQUEST = "U2F_CHALLENGE_REQUEST";
export const U2F_CHALLENGE_SUCCESS = "U2F_CHALLENGE_SUCCESS";
export const U2F_CHALLENGE_FAILURE = "U2F_CHALLENGE_FAILURE";

interface U2FChallengeRequestAction {
	type: typeof U2F_CHALLENGE_REQUEST;
}

interface U2FChallengeSuccessAction {
	type: typeof U2F_CHALLENGE_SUCCESS;
	payload: PublicKeyCredentialCreationOptions;
}

interface U2FChallengeFailureAction {
	type: typeof U2F_CHALLENGE_FAILURE;
	payload: Error;
}

export const u2fChallenge = (dispatch: Dispatch, headers: any): void => {
	dispatch({
		[RSAA]: {
			endpoint: `${BASE_URL}/api/u2f/register`,
			method: "GET",
			headers,
			types: [U2F_CHALLENGE_REQUEST, U2F_CHALLENGE_SUCCESS, U2F_CHALLENGE_FAILURE]
		}
	});
};

export type U2FChallengeActionType = U2FChallengeRequestAction | U2FChallengeSuccessAction | U2FChallengeFailureAction;