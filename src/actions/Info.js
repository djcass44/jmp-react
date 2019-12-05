import {client} from "../constants";
import {failure, request, success} from "./index";

export const GET_INFO_APP = "GET_INFO_APP";
export const GET_INFO_SYS = "GET_INFO_SYS";
export const GET_INFO_STAT = "GET_INFO_STAT";
export const GET_INFO_PROP = "GET_INFO_PROP";
export const GET_INFO_AUTH = "GET_INFO_AUTH";
export const GET_INFO_ERROR = "GET_INFO_ERROR";

export const getInfoSystem = (dispatch, headers) => {
	dispatch({type: `${GET_INFO_SYS}_REQUEST`});
	client.get("/api/actuator/info", {headers}).then(r => {
		dispatch({type: `${GET_INFO_SYS}_SUCCESS`, payload: r.data});
	}).catch(err => {
		dispatch({type: `${GET_INFO_SYS}_FAILURE`, payload: err, error: true})
	});
};
export const getInfoHealth = (dispatch, headers) => {
	request(dispatch, GET_INFO_STAT);
	client.get("/api/actuator/health", {headers}).then(r => {
		success(dispatch, GET_INFO_STAT, r.data);
	}).catch(err => {
		failure(dispatch, GET_INFO_STAT, err);
	});
};
const getInfoAuthDispatch = (dispatch, headers) => {
	dispatch({type: `${GET_INFO_AUTH}_REQUEST`});
	client.get(`/api/v2_1/provider/main`, {headers}).then(r => {
		dispatch({type: `${GET_INFO_AUTH}_SUCCESS`, payload: r.data});
	}).catch(err => {
		dispatch({type: `${GET_INFO_AUTH}_FAILURE`, payload: err, error: true});
	});
};
export const getInfoError = (dispatch, headers) => {
	request(dispatch, GET_INFO_ERROR);
	client.get(`/api/v2_1/statistics/exception?time=15`, {headers}).then(r => {
		success(dispatch, GET_INFO_ERROR, r.data);
	}).catch(err => {
		failure(dispatch, GET_INFO_ERROR, err);
	});
};
export const getInfoAuth = headers => dispatch => getInfoAuthDispatch(dispatch, headers);
