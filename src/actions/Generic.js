import {client} from "../constants";

export const GENERIC_FILTER_SET = "GENERIC_FILTER_SET";
export const GENERIC_GET_VERSION = "GENERIC_GET_VERSION";
export const GENERIC_GET_TOKEN = "GENERIC_GET_TOKEN";
export const SOCKET_APP_INIT = "INIT_APP";

export const getTokenStart = () => dispatch => dispatch({type: `${GENERIC_GET_TOKEN}_REQUEST`});
export const getTokenEnd = () => dispatch => dispatch({type: `${GENERIC_GET_TOKEN}_SUCCESS`});
export const getTokenFail = err => dispatch => dispatch({type: `${GENERIC_GET_TOKEN}_FAILURE`, payload: err, error: true});

export const setFilter = filter => dispatch => dispatch({type: GENERIC_FILTER_SET, payload: filter});
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
