import {client} from "../constants";

export const GET_INFO_APP = "GET_INFO_APP";
export const GET_INFO_SYS = "GET_INFO_SYS";
export const GET_INFO_STAT = "GET_INFO_STAT";
export const GET_INFO_PROP = "GET_INFO_PROP";
export const GET_INFO_AUTH = "GET_INFO_AUTH";
export const GET_INFO_ERROR = "GET_INFO_ERROR";

const getInfoAppDispatch = (dispatch, headers) => {
	dispatch({type: `${GET_INFO_APP}_REQUEST`});
	client.get("/api/v2/info/app", {headers: headers}).then(r => {
		dispatch({type: `${GET_INFO_APP}_SUCCESS`, payload: r.data});
	}).catch(err => {
		dispatch({type: `${GET_INFO_APP}_FAILURE`, payload: err, error: true})
	});
};
const getInfoSystemDispatch = (dispatch, headers) => {
	dispatch({type: `${GET_INFO_SYS}_REQUEST`});
	client.get("/api/v2/info/system", {headers: headers}).then(r => {
		dispatch({type: `${GET_INFO_SYS}_SUCCESS`, payload: r.data});
	}).catch(err => {
		dispatch({type: `${GET_INFO_SYS}_FAILURE`, payload: err, error: true})
	});
};
const getInfoStatusDispatch = (dispatch, headers) => {
	dispatch({type: `${GET_INFO_STAT}_REQUEST`});
	client.get("/api/v3/health", {headers: headers}).then(r => {
		dispatch({type: `${GET_INFO_STAT}_SUCCESS`, payload: r.data});
	}).catch(err => {
		dispatch({type: `${GET_INFO_STAT}_FAILURE`, payload: err, error: true})
	});
};
const getPropDispatch = (dispatch, headers, prop) => {
	dispatch({type: `${GET_INFO_PROP}_REQUEST`});
	client.get(`/api/v2_1/prop/${prop}`, {headers: headers}).then(r => {
		dispatch({type: `${GET_INFO_PROP}_SUCCESS`, payload: r.data, conf: prop});
	}).catch(err => {
		dispatch({type: `${GET_INFO_PROP}_FAILURE`, payload: err, error: true, conf: prop});
	});
};
const getInfoAuthDispatch = (dispatch, headers) => {
	dispatch({type: `${GET_INFO_AUTH}_REQUEST`});
	client.get(`/api/v2_1/provider/main`, {headers: headers}).then(r => {
		dispatch({type: `${GET_INFO_AUTH}_SUCCESS`, payload: r.data});
	}).catch(err => {
		dispatch({type: `${GET_INFO_AUTH}_FAILURE`, payload: err, error: true});
	});
};
const getInfoErrorDispatch = (dispatch, headers) => {
	dispatch({type: `${GET_INFO_ERROR}_REQUEST`});
	client.get(`/api/v2_1/statistics/exception?time=15`, {headers: headers}).then(r => {
		dispatch({type: `${GET_INFO_ERROR}_SUCCESS`, payload: r.data});
	}).catch(err => {
		dispatch({type: `${GET_INFO_ERROR}_FAILURE`, payload: err, error: true});
	});
};

export const getInfoApp = headers => dispatch => getInfoAppDispatch(dispatch, headers);
export const getInfoSystem = headers => dispatch => getInfoSystemDispatch(dispatch, headers);
export const getInfoHealth = headers => dispatch => getInfoStatusDispatch(dispatch, headers);
export const getInfoProp = (headers, prop) => dispatch => getPropDispatch(dispatch, headers, prop);
export const getInfoAuth = headers => dispatch => getInfoAuthDispatch(dispatch, headers);
export const getInfoError = headers => dispatch => getInfoErrorDispatch(dispatch, headers);
