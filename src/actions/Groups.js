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
import {client, socket} from "../constants";

export const GROUP_LOAD = "GROUP_LOAD";
export const GET_USER_GROUPS = "GET_USER_GROUPS";

export const SOCKET_UPDATE_GROUPS = "EVENT_UPDATE_GROUP";

export function getGroups(headers) {
	return dispatch => {
		getGroupsDispatch(dispatch, headers);
	}
}
export function getUserGroups(headers, uid) {
	return dispatch => {getUserGroupsDispatch(dispatch, headers, uid)}
}
export function subscribeChangesInGroups(headers) {
	return async dispatch => {
		socket.on(SOCKET_UPDATE_GROUPS, () => {
			getGroupsDispatch(dispatch, headers);
		})
	}
}

function getGroupsDispatch(dispatch, headers) {
	dispatch({type: `${GROUP_LOAD}_REQUEST`});
	client.get("/api/v2_1/groups", {headers: headers}).then(r => {
		dispatch({
			type: `${GROUP_LOAD}_SUCCESS`,
			data: r.data
		});
	}).catch(err => {
		dispatch({type: `${GROUP_LOAD}_FAILURE`, data: err.toString()});
	});
}
function getUserGroupsDispatch(dispatch, headers, uid) {
	dispatch({type: `${GET_USER_GROUPS}_REQUEST`});
	client.get(`/api/v2_1/user/groups?uid=${uid}`, {headers: headers}).then(r => {
		dispatch({
			type: `${GET_USER_GROUPS}_SUCCESS`,
			data: r.data
		});
	}).catch(err => {
		dispatch({type: `${GET_USER_GROUPS}_FAILURE`, data: err.toString()});
	});
}