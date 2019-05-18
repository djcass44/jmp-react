export const JUMP_LOAD = "JUMP_LOAD";
export const JUMP_RM = "JUMP_RM";

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

function listJumpsDispatch(dispatch, headers) {
	dispatch({
		type: JUMP_LOAD,
		payload: {
			request: {
				method: 'GET',
				headers: headers,
				url: '/api/v1/jumps'
			}
		}
	})
}
function rmJumpDispatch(dispatch, headers, id) {
	dispatch({
		type: JUMP_RM,
		payload: {
			request: {
				method: 'DELETE',
				headers: headers,
				url: `/api/v1/jump/${id}`
			}
		}
	})
}