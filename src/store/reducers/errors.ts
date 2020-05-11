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

import {SimpleMap} from "../../types";
import {ErrorState} from "../../config/types/Feedback";

const initialState: SimpleMap<ErrorState> = {};

interface Action {
	type: string;
	payload?: Payload | null;
	meta?: string;
}

interface Payload {
	tag: string;
}

export default (state = initialState, action: Action) => {
	const {type, payload, meta} = action;
	const matches = /(.*)_(REQUEST|FAILURE|RESET)/.exec(type);
	// not a *_REQUEST or *_FAILURE action, so we ignore them
	if (!matches) return state;
	const [, requestName, requestState] = matches;
	const response: ErrorState = {
		payload,
		message: meta || null
	};
	return {
		...state,
		[`${requestName}${payload?.tag ? `_${payload.tag}` : ""}`]: requestState === "FAILURE" ? response : null
	};
}