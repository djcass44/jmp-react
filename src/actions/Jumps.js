import {client, socket} from "../constants";

export const JUMP_LOAD = "JUMP_LOAD";
export const GET_SIMILAR = "GET_SIMILAR";
export const PUT_JUMP = "PUT_JUMP";
export const DELETE_JUMP = "DELETE_JUMP";
export const PATCH_JUMP = "PATCH_JUMP";

export const SOCKET_UPDATE_JUMP = "EVENT_UPDATE";

export function listJumps(headers) {
	return dispatch => {
		listJumpsDispatch(dispatch, headers);
	}
}
export function deleteJump(headers, id) {
	return dispatch => {
		deleteJumpDispatch(dispatch, headers, id);
	}
}
export function putJump(headers, jump, gid) {
	return dispatch => {putJumpDispatch(dispatch, headers, jump, gid)};
}
export function patchJump(headers, jump) {
	return dispatch => {patchJumpDispatch(dispatch, headers, jump)};
}
export function getSimilar(headers, query) {
	return dispatch => {
		getSimilarDispatch(dispatch, headers, query);
	}
}
export function getSimilarFail(err) {
	return dispatch => {dispatch({type: `${GET_SIMILAR}_FAILURE`, data: err});}
}
export function subscribeChangesInJumps(headers) {
	return async dispatch => {
		socket.on(SOCKET_UPDATE_JUMP, () => {
			listJumpsDispatch(dispatch, headers);
		});
	}
}

function listJumpsDispatch(dispatch, headers) {
	dispatch({type: `${JUMP_LOAD}_REQUEST`});
	client.get("/api/v1/jumps", {headers: headers}).then(r => {
		dispatch({type: `${JUMP_LOAD}_SUCCESS`, data: r.data});
	}).catch(err => {
		dispatch({type: `${JUMP_LOAD}_FAILURE`, data: err.toString()});
	});
}
function deleteJumpDispatch(dispatch, headers, id) {
	dispatch({type: `${DELETE_JUMP}_REQUEST`});
	client.delete(`/api/v1/jump/${id}`, {headers: headers}).then(r => {
		dispatch({type: `${DELETE_JUMP}_SUCCESS`, data: r.data});
	}).catch(err => {
		dispatch({type: `${DELETE_JUMP}_FAILURE`, data: err.toString()});
	});
}
function getSimilarDispatch(dispatch, headers, query) {
	dispatch({type: `${GET_SIMILAR}_REQUEST`});
	client.get(`/api/v2/similar/${query}`, {headers: headers}).then(r => {
		dispatch({
			type: `${GET_SIMILAR}_SUCCESS`,
			data: r.data
		});
	}).catch(err => {
		dispatch({type: `${GET_SIMILAR}_FAILURE`, data: err.toString()});
	});
}
function putJumpDispatch(dispatch, headers, jump, gid) {
	dispatch({type: `${PUT_JUMP}_REQUEST`});
	client.put(`/api/v1/jump${gid}`, jump,{headers: headers}).then(r => {
		dispatch({
			type: `${PUT_JUMP}_SUCCESS`,
			data: r.data
		});
	}).catch(err => {
		dispatch({type: `${PUT_JUMP}_FAILURE`, data: err.toString()});
	});
}
function patchJumpDispatch(dispatch, headers, jump) {
	dispatch({type: `${PATCH_JUMP}_REQUEST`});
	client.patch(`/api/v1/jump`, jump,{headers: headers}).then(r => {
		dispatch({type: `${PATCH_JUMP}_SUCCESS`, data: r.data});
	}).catch(err => {
		dispatch({type: `${PATCH_JUMP}_FAILURE`, data: err.toString()});
	});
}