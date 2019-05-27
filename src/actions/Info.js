import {client} from "../constants";

export const GET_INFO_APP = "GET_INFO_APP";
export const GET_INFO_SYS = "GET_INFO_SYS";
export const GET_INFO_STAT = "GET_INFO_STAT";
export const GET_INFO_PROP = "GET_INFO_PROP";
export const GET_INFO_AUTH = "GET_INFO_AUTH";

export function getInfoApp(headers) {
	return dispatch => {getInfoAppDispatch(dispatch, headers)}
}
export function getInfoSystem(headers) {
	return dispatch => {getInfoSystemDispatch(dispatch, headers)}
}
export function getInfoHealth(headers) {
	return dispatch => {getInfoStatusDispatch(dispatch, headers)}
}
export function getInfoProp(headers, prop) {
	return dispatch => {getPropDispatch(dispatch, headers, prop)}
}
export function getInfoAuth(headers) {
	return dispatch => {getInfoAuthDispatch(dispatch, headers)}
}


function getInfoAppDispatch(dispatch, headers) {
	dispatch({type: `${GET_INFO_APP}_REQUEST`});
	client.get("/api/v2/info/app", {headers: headers}).then(r => {
		dispatch({type: `${GET_INFO_APP}_SUCCESS`, data: r.data});
	}).catch(err => {
		dispatch({type: `${GET_INFO_APP}_FAILURE`, data: err.toString()})
	});
}
function getInfoSystemDispatch(dispatch, headers) {
	dispatch({type: `${GET_INFO_SYS}_REQUEST`});
	client.get("/api/v2/info/system", {headers: headers}).then(r => {
		dispatch({type: `${GET_INFO_SYS}_SUCCESS`, data: r.data});
	}).catch(err => {
		dispatch({type: `${GET_INFO_SYS}_FAILURE`, data: err.toString()})
	});
}
function getInfoStatusDispatch(dispatch, headers) {
	dispatch({type: `${GET_INFO_STAT}_REQUEST`});
	client.get("/api/v3/health", {headers: headers}).then(r => {
		dispatch({type: `${GET_INFO_STAT}_SUCCESS`, data: r.data});
	}).catch(err => {
		dispatch({type: `${GET_INFO_STAT}_FAILURE`, data: err.toString()})
	});
}
function getPropDispatch(dispatch, headers, prop) {
	dispatch({type: `${GET_INFO_PROP}_REQUEST`});
	client.get(`/api/v2_1/prop/${prop}`, {headers: headers}).then(r => {
		dispatch({type: `${GET_INFO_PROP}_SUCCESS`, data: r.data, conf: prop});
	}).catch(err => {
		dispatch({type: `${GET_INFO_PROP}_FAILURE`, data: err.toString(), conf: prop});
	});
}
function getInfoAuthDispatch(dispatch, headers) {
	dispatch({type: `${GET_INFO_AUTH}_REQUEST`});
	client.get(`/api/v2_1/provider/main`, {headers: headers}).then(r => {
		dispatch({type: `${GET_INFO_AUTH}_SUCCESS`, data: r.data});
	}).catch(err => {
		dispatch({type: `${GET_INFO_AUTH}_FAILURE`, data: err.toString()});
	});
}