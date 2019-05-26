import {client} from "../constants";

export const JUMP_LOAD = "JUMP_LOAD";
export const JUMP_RM = "JUMP_RM";
export const GET_SIMILAR = "GET_SIMILAR";

export function listJumps(headers) {
	return dispatch => {
		listJumpsDispatch(dispatch, headers);
	}
}
export function rmJump(headers, id) {
	return dispatch => {
		rmJumpDispatch(dispatch, headers, id);
	}
}
export function getSimilar(headers, query) {
	return dispatch => {
		getSimilarDispatch(dispatch, headers, query);
	}
}
export function getSimilarFail(err) {
	return dispatch => {dispatch({type: `${GET_SIMILAR}_FAILURE`, data: err});}
}

function listJumpsDispatch(dispatch, headers) {
	dispatch({type: `${JUMP_LOAD}_REQUEST`});
	client.get("/api/v1/jumps", {headers: headers}).then(r => {
		dispatch({type: `${JUMP_LOAD}_SUCCESS`, data: r.data});
	}).catch(err => {
		dispatch({type: `${JUMP_LOAD}_FAILURE`, data: err.toString()});
	});
}
function rmJumpDispatch(dispatch, headers, id) {
	dispatch({
		type: `${JUMP_RM}_REQUEST`,
		payload: {
			request: {
				method: 'DELETE',
				headers: headers,
				url: `/api/v1/jump/${id}`
			}
		}
	})
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
	})
}