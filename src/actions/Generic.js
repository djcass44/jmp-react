import {client, socket} from "../constants";

export const GENERIC_FILTER_SET = "GENERIC_FILTER_SET";
export const GENERIC_GET_VERSION = "GENERIC_GET_VERSION";
export const GENERIC_GET_TOKEN = "GENERIC_GET_TOKEN";
export const GENERIC_DO_NOTHING = "GENERIC_DO_NOTHING";

export const SOCKET_APP_INIT = "INIT_APP";

export function getTokenStart() {
	return dispatch => {dispatch({type: `${GENERIC_GET_TOKEN}_REQUEST`});}
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
export function doNothing() {
	return dispatch => { doNothingDispatch(dispatch) }
}
export function subscribeAppInit() {
	return async dispatch => {
		socket.on(SOCKET_APP_INIT, r => {
			dispatch({type: SOCKET_APP_INIT, data: r})
		});
	}
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
	dispatch({type: `${GENERIC_GET_VERSION}_REQUEST`});
	client.get("/api/v2/version").then( r => {
		dispatch({
			type: `${GENERIC_GET_VERSION}_SUCCESS`,
			data: r.data
		});
	}).catch(err => {
		dispatch({type: `${GENERIC_GET_VERSION}_FAILURE`, data: err.toString()});
	});
}
function doNothingDispatch(dispatch) {
	dispatch({type: `${GENERIC_DO_NOTHING}_REQUEST`});
}
