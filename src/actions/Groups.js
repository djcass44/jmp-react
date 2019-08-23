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

export const GROUP_LOAD = "GROUP_LOAD";
export const PUT_GROUP = "PUT_GROUP";
export const GET_USER_GROUPS = "GET_USER_GROUPS";
export const SET_USER_GROUPS = "SET_USER_GROUPS";

export const SOCKET_UPDATE_GROUPS = "EVENT_UPDATE_GROUP";

const getGroupsDispatch = (dispatch, headers) => {
	dispatch({type: `${GROUP_LOAD}_REQUEST`});
	client.get("/api/v2_1/groups", {headers: headers}).then(r => {
		dispatch({
			type: `${GROUP_LOAD}_SUCCESS`,
			payload: r.data
		});
	}).catch(err => {
		dispatch(addSnackbar({message: "Failed to load groups", options: {key: `${GROUP_LOAD}_FAILURE`, variant: "error"}}));
		dispatch({type: `${GROUP_LOAD}_FAILURE`, payload: err, error: true});
	});
};
const putGroupDispatch = (dispatch, headers, name) => {
	dispatch({type: `${PUT_GROUP}_REQUEST`});
	client.put("/api/v2_1/group", {name}, {headers: headers}).then(r => {
		dispatch({
			type: `${PUT_GROUP}_SUCCESS`,
			payload: r.data
		});
		dispatch(addSnackbar({message: "Created group", options: {key: `${PUT_GROUP}_SUCCESS`, variant: "success"}}));
	}).catch(err => {
		dispatch(addSnackbar({message: "Failed to create group", options: {key: `${PUT_GROUP}_FAILURE`, variant: "error"}}));
		dispatch({type: `${PUT_GROUP}_FAILURE`, payload: err, error: true});
	});
};
const getUserGroupsDispatch = (dispatch, headers, uid) => {
	dispatch({type: `${GET_USER_GROUPS}_REQUEST`});
	client.get(`/api/v2_1/user/groups?uid=${uid}`, {headers: headers}).then(r => {
		dispatch({
			type: `${GET_USER_GROUPS}_SUCCESS`,
			payload: r.data
		});
	}).catch(err => {
		dispatch(addSnackbar({message: "Failed to load group memberships", options: {key: `${GET_USER_GROUPS}_FAILURE`, variant: "error"}}));
		dispatch({type: `${GET_USER_GROUPS}_FAILURE`, payload: err, error: true});
	});
};
const setUserGroupsDispatch = (dispatch, headers, uid, payload) => {
	dispatch({type: `${SET_USER_GROUPS}_REQUEST`});
	client.patch('/api/v2_1/groupmod', payload, {headers: headers, params: {uid: uid}}).then(r => {
		dispatch({
			type: `${SET_USER_GROUPS}_SUCCESS`,
			payload: r.data
		});
		dispatch(addSnackbar({message: "Updated group membership", options: {key: `${SET_USER_GROUPS}_SUCCESS`, variant: "success"}}));
		// Automatically reload the group memberships
		getUserGroupsDispatch(dispatch, headers, uid);
	}).catch(err => {
		dispatch(addSnackbar({message: "Failed to update group membership", options: {key: `${SET_USER_GROUPS}_FAILURE`, variant: "error"}}));
		dispatch({type: `${SET_USER_GROUPS}_FAILURE`, payload: err, error: true});
	});
};

export const getGroups = (headers) => dispatch => getGroupsDispatch(dispatch, headers);
export const putGroup = (headers, name) => dispatch => putGroupDispatch(dispatch, headers, name);
export const getUserGroups = (headers, uid) => dispatch => getUserGroupsDispatch(dispatch, headers, uid);
export const setUserGroups = (headers, uid, payload) => dispatch => setUserGroupsDispatch(dispatch, headers, uid, payload);