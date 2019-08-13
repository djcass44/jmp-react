import {MODAL_GROUP_NEW, MODAL_JUMP_DELETE, MODAL_JUMP_EDIT, MODAL_JUMP_NEW} from "../actions/Modal";

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
	},
	group: {
		new: {
			open: false
		}
	}
};
export default (state = initialState, action) => {
	switch (action.type) {
		case MODAL_JUMP_NEW: {
			return {...state, jump: {...state.jump, new: {...state.jump.new, open: action.payload}}};
		}
		case MODAL_JUMP_EDIT: {
			const {open, item} = action.payload;
			return {...state, jump: {...state.jump, edit: {...state.jump.edit, open, item}}};
		}
		case MODAL_JUMP_DELETE: {
			const {open, item} = action.payload;
			return {...state, jump: {...state.jump, delete: {...state.jump.delete, open, item}}};
		}
		case MODAL_GROUP_NEW:
			return {...state, group: {...state.group, new: {...state.group.new, open: action.payload}}};
		default:
			return state;
	}
}