import {client} from "../constants";

export const GET_INFO_APP = "GET_INFO_APP";
export const GET_INFO_SYS = "GET_INFO_SYS";
export const GET_INFO_STAT = "GET_INFO_STAT";

export function getInfoApp(headers) {
	return dispatch => {getInfoAppDispatch(dispatch, headers)}
}
export function getInfoSystem(headers) {
	return dispatch => {getInfoSystemDispatch(dispatch, headers)}
}
export function getInfoHealth(headers) {
	return dispatch => {getInfoStatusDispatch(dispatch, headers)}
}


function getInfoAppDispatch(dispatch, headers) {
	dispatch({type: GET_INFO_APP});
	client.get("/api/v2/info/app", {headers: headers}).then(r => {
		dispatch({type: `${GET_INFO_APP}_SUCCESS`, data: r.data});
	}).catch(err => {
		dispatch({type: `${GET_INFO_APP}_FAILURE`, data: err.toString()})
	});
}
function getInfoSystemDispatch(dispatch, headers) {
	dispatch({type: GET_INFO_SYS});
	client.get("/api/v2/info/system", {headers: headers}).then(r => {
		dispatch({type: `${GET_INFO_SYS}_SUCCESS`, data: r.data});
	}).catch(err => {
		dispatch({type: `${GET_INFO_SYS}_FAILURE`, data: err.toString()})
	});
}
function getInfoStatusDispatch(dispatch, headers) {
	dispatch({type: GET_INFO_STAT});
	client.get("/api/v3/health", {headers: headers}).then(r => {
		dispatch({type: `${GET_INFO_STAT}_SUCCESS`, data: r.data});
	}).catch(err => {
		dispatch({type: `${GET_INFO_STAT}_FAILURE`, data: err.toString()})
	});
}