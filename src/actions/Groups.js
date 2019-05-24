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
import {client} from "../constants";

export const GROUP_LOAD = "GROUP_LOAD";

export function getGroups(headers) {
	return dispatch => {
		getGroupsDispatch(dispatch, headers);
	}
}

function getGroupsDispatch(dispatch, headers) {
	dispatch({type: GROUP_LOAD});
	client.get("/api/v2_1/groups", {headers: headers}).then(r => {
		dispatch({
			type: `${GROUP_LOAD}_SUCCESS`,
			data: r.data
		});
	}).catch(err => {
		dispatch({type: `${GROUP_LOAD}_FAILURE`, data: err.toString()});
	})
}