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

export const WEB_U2F_CHALLENGE = "WEB_U2F_CHALLENGE";
export const WEB_U2F_CHALLENGE_FAILURE = `${WEB_U2F_CHALLENGE}_FAILURE`;

interface WebU2FChallengeFailureAction {
	type: typeof WEB_U2F_CHALLENGE_FAILURE;
	payload: Error;
}

export const u2fChallengeFailure = (dispatch: Dispatch, error: Error) => dispatch({
	type: WEB_U2F_CHALLENGE_FAILURE,
	payload: error,
	error: true
});

export type GeneralActionType = WebU2FChallengeFailureAction;
