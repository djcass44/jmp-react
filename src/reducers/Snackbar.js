import {ADD_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR} from "../actions/Snackbar";

const initialState = {
	notify: []
};
export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_SNACKBAR:
			return {
				...state, notify: [
					...state.notify,
					{
						key: action.key,
						...action.notify
					}
				]
			};
		case CLOSE_SNACKBAR:
			return {
				...state,
				notify: state.notify.map(n => (
					(action.dismissAll || n.key === action.key)
						? {...n, dismissed: true}
						: {...n}
				)),
			};
		case REMOVE_SNACKBAR:
			return {...state, notify: state.notify.filter(n => n.key !== action.key)};
		default:
			return state;
	}
}
