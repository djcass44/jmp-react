import {MODAL_JUMP_DELETE, MODAL_JUMP_EDIT, MODAL_JUMP_NEW} from "../actions/Modal";

const initialState = {
	jump: {
		new: {
			open: false
		},
		delete: {
			open: false,
			item: null
		},
		edit: {
			open: false,
			item: null
		}
	}
};
export default (state = initialState, action) => {
	switch (action.type) {
		case MODAL_JUMP_NEW: {
			const {open} = action.payload;
			return {...state, jump: {...state.jump, new: {...state.jump.new, open}}};
		}
		case MODAL_JUMP_EDIT: {
			const {open, item} = action.payload;
			return {...state, jump: {...state.jump, edit: {...state.jump.edit, open, item}}};
		}
		case MODAL_JUMP_DELETE: {
			const {open, item} = action.payload;
			return {...state, jump: {...state.jump, delete: {...state.jump.delete, open, item}}};
		}
		default:
			return state;
	}
}