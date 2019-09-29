import {client} from "../constants";

export const request = (dispatch, action, data = null) => dispatch({type: `${action}_REQUEST`, payload: data});
export const success = (dispatch, action, data) => dispatch({type: `${action}_SUCCESS`, payload: data});
export const failure = (dispatch, action, data) => dispatch({type: `${action}_FAILURE`, payload: data, error: true});

export const get = (dispatch, action, url, config) => {
	request(dispatch, action);
	client.get(url, config).then(r => success(dispatch, action, r.data)).catch(err => failure(dispatch, action, err));
};