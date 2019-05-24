import {client} from "./Auth";

export const GENERIC_FILTER_SET = "GENERIC_FILTER_SET";
export const GENERIC_GET_VERSION = "GENERIC_GET_VERSION";
export const GENERIC_GET_TOKEN = "GENERIC_GET_TOKEN";

export function getTokenStart() {
	return dispatch => {dispatch({type: GENERIC_GET_TOKEN});}
}
export function getTokenEnd() {
	return dispatch => {dispatch({type: `${GENERIC_GET_TOKEN}_SUCCESS`});}
}
export function getTokenFail(err) {
	return dispatch => {dispatch({type: `${GENERIC_GET_TOKEN}_FAILURE`, data: err});}
}
export function setFilter(filter) {
	return dispatch => { setFilterDispatch(dispatch, filter) }
}
function setFilterDispatch(dispatch, filter) {
	dispatch({
		type: GENERIC_FILTER_SET,
		data: filter
	});
}
export function getVersion() {
	return dispatch => {
		getVersionDispatch(dispatch);
	}
}
function getVersionDispatch(dispatch) {
	dispatch({type: GENERIC_GET_VERSION});
	client.get("/api/v2/version").then( r => {
		dispatch({
			type: `${GENERIC_GET_VERSION}_SUCCESS`,
			data: r.data
		});
	}).catch(err => {
		dispatch({type: `${GENERIC_GET_VERSION}_FAILURE`, data: err.toString()});
	});
}