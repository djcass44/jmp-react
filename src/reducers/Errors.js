const errors = (state = {}, action) => {
	const {type} = action;
	const matches = /(.*)_(REQUEST|FAILURE)/.exec(type);
	// not a *_REQUEST / *_FAILURE action, so we ignore them
	if(!matches) return state;
	const [, requestName, requestState] = matches;
	return {
		...state,
		[`${requestName}${action.data && action.data.tag ? `_${action.data.tag}` : ""}`]: requestState === 'FAILURE'
	}
};
export default errors;