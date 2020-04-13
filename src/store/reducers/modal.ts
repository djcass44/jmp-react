import {ModalActionType, SET_DIALOG} from "../actions/Modal";
import {SimpleMap} from "../../types";

export interface Modal {
	open: boolean;
	other: any | null;
}

export const defaultState: Modal = {
	open: false,
	other: {}
};

const initialState: SimpleMap<Modal> = {};

export default (state = initialState, action: ModalActionType) => {
	if (action.type === SET_DIALOG) {
		const {name, open, other} = action.payload;
		return {...state, [name]: {open, other}};
	}
	return state;
}
