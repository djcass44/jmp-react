export const MODAL_JUMP_NEW = "MODAL_JUMP_NEW";
export const MODAL_JUMP_EDIT = "MODAL_JUMP_EDIT";
export const MODAL_JUMP_DELETE = "MODAL_JUMP_DELETE";

export const setJumpNew = open => dispatch => dispatch({type: MODAL_JUMP_NEW, payload: {open}});
export const setJumpEdit = (open, item) => dispatch => dispatch({type: MODAL_JUMP_EDIT, payload: {open, item}});
export const setJumpDelete = (open, item) => dispatch => dispatch({type: MODAL_JUMP_DELETE, payload: {open, item}});