import {client} from "../constants";
import {JUMP_SET_EXPAND} from "./Jumps";

export const GENERIC_FILTER_SET = "GENERIC_FILTER_SET";
export const GENERIC_SET_SORT = "GENERIC_SET_SORT";
export const GENERIC_GET_VERSION = "GENERIC_GET_VERSION";
export const GENERIC_GET_TOKEN = "GENERIC_GET_TOKEN";
export const SOCKET_APP_INIT = "INIT_APP";

export const getTokenStart = dispatch => dispatch({type: `${GENERIC_GET_TOKEN}_REQUEST`});
export const getTokenEnd = dispatch => dispatch({type: `${GENERIC_GET_TOKEN}_SUCCESS`});
export const getTokenFail = (dispatch, err) => dispatch({
	type: `${GENERIC_GET_TOKEN}_FAILURE`,
	payload: err,
	error: true
});

export const setFilter = filter => dispatch => {
	dispatch({type: GENERIC_FILTER_SET, payload: filter});
	dispatch({type: JUMP_SET_EXPAND, payload: null});
};
export const setSort = sort => dispatch => dispatch({type: GENERIC_SET_SORT, payload: sort});
export const dispatchSort = (dispatch, sort) => dispatch({type: GENERIC_SET_SORT, payload: sort});
export const getVersion = () => dispatch => getVersionDispatch(dispatch);

function getVersionDispatch(dispatch) {
	dispatch({type: `${GENERIC_GET_VERSION}_REQUEST`});
	client.get("/api/v2/version").then( r => {
		dispatch({
			type: `${GENERIC_GET_VERSION}_SUCCESS`,
			payload: r.data
		});
	}).catch(err => {
		dispatch({type: `${GENERIC_GET_VERSION}_FAILURE`, payload: err, error: true});
	});
}

export const resetError = (dispatch, action) => dispatch({type: `${action}_RESET`});
