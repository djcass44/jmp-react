import {SET_DIALOG} from "../actions/Modal";

export const defaultState = {
	visible: false,
	other: {}
};

export default (state = {}, action) => {
	switch (action.type) {
		case SET_DIALOG: {
			const {name, open, other} = action.payload;
			return {...state, [name]: {open, other}};
		}
		default:
			return state;
	}
}
