export const GENERIC_FILTER_SET = "GENERIC_FILTER_SET";

export function setFilter(filter) {
	return dispatch => { setFilterDispatch(dispatch, filter) }
}
function setFilterDispatch(dispatch, filter) {
	dispatch({
		type: GENERIC_FILTER_SET,
		data: filter
	});
}