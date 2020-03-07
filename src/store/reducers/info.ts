import {InfoActionType} from "../actions/info";
import {GET_INFO_SYS_SUCCESS} from "../actions/info/GetInfoSystem";
import {GET_INFO_STAT_FAILURE, GET_INFO_STAT_SUCCESS} from "../actions/info/GetInfoHealth";

export interface InfoState {
	systemInfo: object,
	status: object,
	statusCheck: null
}

const initialState: InfoState = {
	systemInfo: {},
	status: {},
	statusCheck: null
};

export default (state = initialState, action: InfoActionType) => {
	switch (action.type) {
		case GET_INFO_SYS_SUCCESS:
			return {...state, systemInfo: action.payload};
		case GET_INFO_STAT_FAILURE:
		case GET_INFO_STAT_SUCCESS:
			return {...state, status: action.payload, statusCheck: new Date()};
		default:
			return state;
	}
};
