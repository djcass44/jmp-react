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

export const USER_LOAD = "USER_LOAD";
export const PATCH_USER_ROLE = "PATCH_USER_ROLE";

export const SOCKET_UPDATE_USERS = "EVENT_UPDATE_USER";

export function getUsers(headers) {
	return dispatch => {
		getUsersDispatch(dispatch, headers);
	}
}
export function patchUserRole(headers, user) {
	return dispatch => {patchUserRoleDispatch(dispatch, headers, user)}
}
export function subscribeChangesInUsers(headers) {
	return async dispatch => {
		socket.on(SOCKET_UPDATE_USERS, () => {
			getUsersDispatch(dispatch, headers);
		});
	}
}

function getUsersDispatch(dispatch, headers) {
	dispatch({type: `${USER_LOAD}_REQUEST`});
	client.get("/api/v2/users?count=9999&offset=0", {headers: headers}).then(r => {
		dispatch({
			type: `${USER_LOAD}_SUCCESS`,
			data: r.data
		});
	}).catch(err => {
		dispatch({type: `${USER_LOAD}_FAILURE`, data: err.toString()});
	});
}
function patchUserRoleDispatch(dispatch, headers, user) {
	dispatch({type: `${PATCH_USER_ROLE}_REQUEST`});
	client.patch("/api/v2/user", user, {headers: headers}).then(r => {
		dispatch({
			type: `${PATCH_USER_ROLE}_SUCCESS`,
			data: r.data
		});
		getUsersDispatch(dispatch, headers);
	}).catch(err => {
		dispatch({type: `${PATCH_USER_ROLE}_FAILURE`, data: err.toString()});
	});
}