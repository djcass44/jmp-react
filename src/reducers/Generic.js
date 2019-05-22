import {GENERIC_FILTER_SET} from "../actions/Generic";

const generic = (state = {
	searchFilter: ''
}, action) => {
	switch(action.type) {
		case GENERIC_FILTER_SET: {
			return {...state, searchFilter: action.data}
		}
		default:
			return state;
	}
};
export default generic;