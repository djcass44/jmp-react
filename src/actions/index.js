export const request = (dispatch, action, data = null) => dispatch({type: `${action}_REQUEST`, payload: data});
export const success = (dispatch, action, data) => dispatch({type: `${action}_SUCCESS`, payload: data});
export const failure = (dispatch, action, data) => dispatch({type: `${action}_FAILURE`, payload: data, error: true});