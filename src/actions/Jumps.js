import {APP_NOUN, client} from "../constants";
import {addSnackbar} from "./Snackbar";

export const JUMP_LOAD = "JUMP_LOAD";
export const JUMP_SET = "JUMP_SET";
export const JUMP_SET_EXPAND = "JUMP_SET_EXPAND";
export const GET_SIMILAR = "GET_SIMILAR";
export const PUT_JUMP = "PUT_JUMP";
export const DELETE_JUMP = "DELETE_JUMP";
export const PATCH_JUMP = "PATCH_JUMP";

export const SOCKET_UPDATE_JUMP = "EVENT_UPDATE";
export const SOCKET_UPDATE_TITLE = "EVENT_UPDATE_TITLE";
export const SOCKET_UPDATE_FAVICON = "EVENT_UPDATE_FAVICON";

export const listJumps = headers => dispatch => listJumpsDispatch(dispatch, headers);
export const deleteJump = (headers, id) => dispatch => deleteJumpDispatch(dispatch, headers, id);
export const putJump = (headers, jump, gid) => dispatch => putJumpDispatch(dispatch, headers, jump, gid);
export const patchJump = (headers, jump) => dispatch => patchJumpDispatch(dispatch, headers, jump);
export const setJumpExpand = id => dispatch => dispatch({type: JUMP_SET_EXPAND, payload: id});

export const getSimilar = (headers, query) => dispatch => getSimilarDispatch(dispatch, headers, query);
export const getSimilarFail = error => dispatch => dispatch({type: `${GET_SIMILAR}_FAILURE`, payload: error, error: true});

const listJumpsDispatch = (dispatch, headers) => {
	dispatch({type: `${JUMP_LOAD}_REQUEST`});
	client.get("/api/v1/jumps", {headers: headers}).then(r => {
		dispatch({type: `${JUMP_LOAD}_SUCCESS`, payload: r.data});
	}).catch(err => {
		dispatch(addSnackbar({message: `Failed to load ${APP_NOUN}s`, options: {key: `${JUMP_LOAD}_FAILURE`, variant: "error"}}));
		dispatch({type: `${JUMP_LOAD}_FAILURE`, payload: err, error: true});
	});
};
const deleteJumpDispatch = (dispatch, headers, id) => {
	dispatch({type: `${DELETE_JUMP}_REQUEST`});
	client.delete(`/api/v1/jump/${id}`, {headers: headers}).then(r => {
		dispatch({type: `${DELETE_JUMP}_SUCCESS`, payload: r.data});
		dispatch(addSnackbar({message: `Deleted ${APP_NOUN}`, options: {key: `${DELETE_JUMP}_SUCCESS`, variant: "success"}}));
	}).catch(err => {
		dispatch(addSnackbar({message: `Failed to delete ${APP_NOUN}`, options: {key: `${DELETE_JUMP}_FAILURE`, variant: "error"}}));
		dispatch({type: `${DELETE_JUMP}_FAILURE`, payload: err, error: true});
	});
};
const getSimilarDispatch = (dispatch, headers, query) => {
	dispatch({type: `${GET_SIMILAR}_REQUEST`});
	client.get(`/api/v2/similar/${query}`, {headers: headers}).then(r => {
		dispatch({
			type: `${GET_SIMILAR}_SUCCESS`,
			payload: r.data
		});
	}).catch(err => {
		dispatch(addSnackbar({message: `Failed to load ${APP_NOUN}`, options: {key: `${GET_SIMILAR}_FAILURE`, variant: "error"}}));
		dispatch({type: `${GET_SIMILAR}_FAILURE`, payload: err, error: true});
	});
};
const putJumpDispatch = (dispatch, headers, jump, gid) => {
	dispatch({type: `${PUT_JUMP}_REQUEST`});
	client.put(`/api/v1/jump${gid}`, jump,{headers: headers}).then(r => {
		dispatch({
			type: `${PUT_JUMP}_SUCCESS`,
			payload: r.data
		});
		dispatch(addSnackbar({message: "Created Jump", options: {key: `${PUT_JUMP}_SUCCESS`, variant: "success"}}));
	}).catch(err => {
		dispatch(addSnackbar({message: `Failed to create ${APP_NOUN}`, options: {key: `${PUT_JUMP}_FAILURE`, variant: "error"}}));
		dispatch({type: `${PUT_JUMP}_FAILURE`, payload: err, error: true});
	});
};
const patchJumpDispatch = (dispatch, headers, jump) => {
	dispatch({type: `${PATCH_JUMP}_REQUEST`});
	client.patch(`/api/v1/jump`, jump,{headers: headers}).then(r => {
		dispatch({type: `${PATCH_JUMP}_SUCCESS`, payload: r.data});
		dispatch(addSnackbar({message: `Updated ${APP_NOUN}`, options: {key: `${PATCH_JUMP}_SUCCESS`, variant: "success"}}));
	}).catch(err => {
		dispatch(addSnackbar({message: `Failed to update ${APP_NOUN}`, options: {key: `${PATCH_JUMP}_FAILURE`, variant: "error"}}));
		dispatch({type: `${PATCH_JUMP}_FAILURE`, payload: err, error: true});
	});
};
