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

const initialState = {};

export default (state = initialState, action: { type: string; }) => {
	const {type} = action;
	const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);

	// not a *_REQUEST / *_SUCCESS / *_FAILURE action, so we ignore them
	if (!matches) return state;

	const [, requestName, requestState] = matches;
	return {...state, [requestName]: requestState === "REQUEST"};
}