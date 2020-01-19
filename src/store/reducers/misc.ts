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

import {SettingsActionType} from "../actions/settings";
import {U2F_CHALLENGE_SUCCESS} from "../actions/settings/general/GetU2FChallenge";
import {Pair} from "../../types";
import {U2F_STATUS_SUCCESS} from "../actions/settings/general/GetU2FStatus";

export interface MiscState {
	publicKey: PublicKeyCredentialCreationOptions | null;
	status: Pair<string | null, string> | null;
}

const initialState: MiscState = {
	publicKey: null,
	status: null
};

export default (state = initialState, action: SettingsActionType) => {
	switch (action.type) {
		case U2F_CHALLENGE_SUCCESS:
			return {...state, publicKey: action.payload};
		case U2F_STATUS_SUCCESS:
			return {...state, status: action.payload};
		default:
			return state;
	}
}