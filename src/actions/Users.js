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
import {addSnackbar} from "./Snackbar";

export const USER_LOAD = "USER_LOAD";
export const PATCH_USER_ROLE = "PATCH_USER_ROLE";

export const SOCKET_UPDATE_USERS = "EVENT_UPDATE_USER";

export const getUsersDispatch = (dispatch, headers) => {
	dispatch({type: `${USER_LOAD}_REQUEST`});
	client.get("/api/v2/user", {headers}).then(r => {
		dispatch({
			type: `${USER_LOAD}_SUCCESS`,
			payload: r.data
		});
	}).catch(err => {
		dispatch(addSnackbar({
			message: "Failed to load users",
			options: {key: `${USER_LOAD}_FAILURE`, variant: "error"}
		}));
		dispatch({type: `${USER_LOAD}_FAILURE`, data: err, error: true});
	});
};
export const patchUserRole = (dispatch, headers, uid, admin = false) => {
	dispatch({type: `${PATCH_USER_ROLE}_REQUEST`});
	client.patch("/api/v2/user", {}, {headers: headers, params: {uid, admin}}).then(r => {
		dispatch({
			type: `${PATCH_USER_ROLE}_SUCCESS`,
			payload: r.data
		});
		getUsersDispatch(dispatch, headers);
	}).catch(err => {
		dispatch(addSnackbar({
			message: "Failed to update user role",
			options: {key: `${PATCH_USER_ROLE}_FAILURE`, variant: "error"}
		}));
		dispatch({type: `${PATCH_USER_ROLE}_FAILURE`, payload: err, error: true});
	});
};

export const getUsers = headers => dispatch => getUsersDispatch(dispatch, headers);
