import {GET_INFO_APP, GET_INFO_AUTH, GET_INFO_ERROR, GET_INFO_PROP, GET_INFO_STAT, GET_INFO_SYS} from "../actions/Info";

const info = (state = {
	appInfo: {},
	systemInfo: {},
	status: {},
	statusCheck: null,
	auth: {},
	error: []
}, action) => {
	switch(action.type) {
		case `${GET_INFO_APP}_SUCCESS`:
			return {...state, appInfo: action.data};
		case `${GET_INFO_SYS}_SUCCESS`:
			return {...state, systemInfo: action.data};
		case `${GET_INFO_STAT}_SUCCESS`:
			return {...state, status: action.data, statusCheck: new Date()};
		case `${GET_INFO_PROP}_SUCCESS`:
			return {...state, [action.conf]: action.data};
		case `${GET_INFO_PROP}_FAILURE`:
			return {...state, [action.conf]: 'undefined'};
		case `${GET_INFO_AUTH}_SUCCESS`:
			return {...state, auth: action.data};
		case `${GET_INFO_ERROR}_SUCCESS`:
			return {...state, error: action.data};
		default:
			return state;
	}
};
export default info;