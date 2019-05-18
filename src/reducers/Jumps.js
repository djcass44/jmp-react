import {JUMP_LOAD} from "../actions/Jumps";

const jumps = (state = {jumps: []}, action) => {
	switch (action.type) {
		case `${JUMP_LOAD}_SUCCESS`: {
			let items = action.payload.data.map(i => {return i});
			return {...state, jumps: items}
		}
		default:
			return state;
	}
};
export default jumps;