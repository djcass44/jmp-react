import {APP_NOUN, client} from "../constants";
import {addSnackbar} from "./Snackbar";
import {failure, request, success} from "./index";

export const JUMP_LOAD = "JUMP_LOAD";
export const JUMP_SET = "JUMP_SET";
export const JUMP_SET_EXPAND = "JUMP_SET_EXPAND";
export const GET_SIMILAR = "GET_SIMILAR";
export const PUT_JUMP = "PUT_JUMP";
export const DELETE_JUMP = "DELETE_JUMP";
export const PATCH_JUMP = "PATCH_JUMP";

export const GET_TARGET = "GET_TARGET";

export const SOCKET_UPDATE_JUMP = "EVENT_UPDATE";

export const deleteJumpDispatch = (dispatch, headers, item) => {
	dispatch({type: `${DELETE_JUMP}_REQUEST`});
	client.delete(`/api/v2/jump/${item.id}`, {headers}).then(r => {
		dispatch({type: `${DELETE_JUMP}_SUCCESS`, payload: r.data});
		dispatch(addSnackbar({
			message: `Deleted ${APP_NOUN}`,
			options: {key: `${DELETE_JUMP}_SUCCESS`, variant: "success"}
		}));
	}).catch(err => {
		dispatch(addSnackbar({
			message: `Failed to delete ${APP_NOUN}`,
			options: {key: `${DELETE_JUMP}_FAILURE`, variant: "error"}
		}));
		dispatch({type: `${DELETE_JUMP}_FAILURE`, payload: err, error: true});
	});
};
export const putJumpDispatch = (dispatch, headers, jump, gid) => {
	dispatch({type: `${PUT_JUMP}_REQUEST`});
	client.put(`/api/v2/jump${gid}`, jump, {headers}).then(r => {
		dispatch({
			type: `${PUT_JUMP}_SUCCESS`,
			payload: r.data
		});
		dispatch(addSnackbar({message: "Created Jump", options: {key: `${PUT_JUMP}_SUCCESS`, variant: "success"}}));
	}).catch(err => {
		dispatch(addSnackbar({
			message: `Failed to create ${APP_NOUN}`,
			options: {key: `${PUT_JUMP}_FAILURE`, variant: "error"}
		}));
		dispatch({type: `${PUT_JUMP}_FAILURE`, payload: err, error: true});
	});
};
export const patchJumpDispatch = (dispatch, headers, jump) => {
	request(dispatch, PATCH_JUMP);
	client.patch(`/api/v2/jump`, jump, {headers: headers}).then(r => {
		success(dispatch, PATCH_JUMP, r.data);
		dispatch(addSnackbar({
			message: `Updated ${APP_NOUN}`,
			options: {key: `${PATCH_JUMP}_SUCCESS`, variant: "success"}
		}));
	}).catch(err => {
		dispatch(addSnackbar({
			message: `Failed to update ${APP_NOUN}`,
			options: {key: `${PATCH_JUMP}_FAILURE`, variant: "error"}
		}));
		failure(dispatch, PATCH_JUMP, err);
	});
};

export const setJumpExpand = (dispatch, id) => dispatch({type: JUMP_SET_EXPAND, payload: id});

export const getSimilarFail = (dispatch, error) => dispatch({
	type: `${GET_SIMILAR}_FAILURE`,
	payload: error,
	error: true
});

export const getTargetJump = (dispatch, headers, query) => {
	dispatch({type: `${GET_TARGET}_REQUEST`});
	client.get(`/api/v2/jump/${query}`, {headers}).then(r => {
		dispatch({type: `${GET_TARGET}_SUCCESS`, payload: r.data});
	}).catch(err => {
		dispatch({type: `${GET_TARGET}_FAILURE`, payload: err, error: true});
	});
};
