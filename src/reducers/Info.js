import {GET_INFO_APP, GET_INFO_STAT, GET_INFO_SYS} from "../actions/Info";

const info = (state = {
	appInfo: {},
	systemInfo: {},
	status: {},
	statusCheck: null
}, action) => {
	switch(action.type) {
		case `${GET_INFO_APP}_SUCCESS`:
			return {...state, appInfo: action.data};
		case `${GET_INFO_SYS}_SUCCESS`:
			return {...state, systemInfo: action.data};
		case `${GET_INFO_STAT}_SUCCESS`:
			return {...state, status: action.data, statusCheck: new Date()};
		default:
			return state;
	}
};
export default info;