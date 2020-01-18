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
import {failure, request, success} from "./index";

export const GROUP_LOAD = "GROUP_LOAD";
export const PUT_GROUP = "PUT_GROUP";
export const PATCH_GROUP = "PATCH_GROUP";
export const GET_USER_GROUPS = "GET_USER_GROUPS";
export const SET_USER_GROUPS = "SET_USER_GROUPS";

export const SOCKET_UPDATE_GROUPS = "EVENT_UPDATE_GROUP";


export const patchGroup = (dispatch, headers, group) => {
	request(dispatch, PATCH_GROUP, group);
	client.patch(`/api/v2_1/group`, JSON.stringify(group), {headers}).then(r => {
		success(dispatch, PATCH_GROUP, r.data);
	}).catch(err => {
		dispatch(addSnackbar({
			message: "Failed to update group",
			options: {key: `${PATCH_GROUP}_FAILURE`, variant: "error"}
		}));
		failure(dispatch, PATCH_GROUP, err);
	});
};

export const getGroups = (dispatch, headers) => {
	request(dispatch, GROUP_LOAD);
	client.get("/api/v2_1/group", {headers}).then(r => {
		success(dispatch, GROUP_LOAD, r.data);
	}).catch(err => {
		dispatch(addSnackbar({
			message: "Failed to load groups",
			options: {key: `${GROUP_LOAD}_FAILURE`, variant: "error"}
		}));
		failure(dispatch, GROUP_LOAD, err);
	});
};
export const putGroup = (dispatch, headers, name) => {
	request(dispatch, PUT_GROUP);
	client.put("/api/v2_1/group", {
		name,
		public: false,
		defaultFor: null
	}, {headers}).then(r => {
		success(dispatch, PUT_GROUP, r.data);
		dispatch(addSnackbar({message: "Created group", options: {key: `${PUT_GROUP}_SUCCESS`, variant: "success"}}));
	}).catch(err => {
		failure(dispatch, PUT_GROUP, err);
		dispatch(addSnackbar({
			message: "Failed to create group",
			options: {key: `${PUT_GROUP}_FAILURE`, variant: "error"}
		}));
	});
};
export const getUserGroups = (dispatch, headers, uid) => {
	dispatch({type: `${GET_USER_GROUPS}_REQUEST`});
	client.get(`/api/v2/user/groups?uid=${uid}`, {headers}).then(r => {
		dispatch({
			type: `${GET_USER_GROUPS}_SUCCESS`,
			payload: r.data
		});
	}).catch(err => {
		dispatch(addSnackbar({
			message: "Failed to load group memberships",
			options: {key: `${GET_USER_GROUPS}_FAILURE`, variant: "error"}
		}));
		dispatch({type: `${GET_USER_GROUPS}_FAILURE`, payload: err, error: true});
	});
};
export const setUserGroups = (dispatch, headers, uid, payload) => {
	dispatch({type: `${SET_USER_GROUPS}_REQUEST`, payload});
	client.patch('/api/v2_1/group/mod', payload, {headers, params: {uid}}).then(r => {
		dispatch({
			type: `${SET_USER_GROUPS}_SUCCESS`,
			payload: r.data
		});
		dispatch(addSnackbar({
			message: "Updated group membership",
			options: {key: `${SET_USER_GROUPS}_SUCCESS`, variant: "success"}
		}));
		// Automatically reload the group memberships
		getUserGroups(dispatch, headers, uid);
	}).catch(err => {
		dispatch(addSnackbar({
			message: "Failed to update group membership",
			options: {key: `${SET_USER_GROUPS}_FAILURE`, variant: "error"}
		}));
		dispatch({type: `${SET_USER_GROUPS}_FAILURE`, payload: err, error: true});
	});
};