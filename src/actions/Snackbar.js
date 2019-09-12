import getRandomValue from "../selectors/getRandomValue";

export const ADD_SNACKBAR = "ADD_SNACKBAR";
export const CLOSE_SNACKBAR = "CLOSE_SNACKBAR";
export const REMOVE_SNACKBAR = "REMOVE_SNACKBAR";

export const addSnackbar = notify => {
	const key = notify.options && notify.options.key;
	return {
		type: ADD_SNACKBAR,
		notify: {
			...notify,
			key: key || new Date().getTime() + getRandomValue() // ensure that the key is not-null
		}
	};
};
export const closeSnackbar = key => ({
	type: CLOSE_SNACKBAR,
	dismissAll: !key, // dismiss all if no key is given
	key
});
export const removeSnackbar = key => ({type: REMOVE_SNACKBAR, key});
