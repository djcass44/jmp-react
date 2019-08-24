import processHTTPCode from "../misc/Codes";

export default (state = {}, action) => {
	const {type} = action;
	const matches = /(.*)_(REQUEST|FAILURE|RESET)/.exec(type);
	// not a *_REQUEST / *_FAILURE action, so we ignore them
	if(!matches) return state;
	const [, requestName, requestState] = matches;
	const data = processHTTPCode(action.payload);
	return {
		...state,
		[`${requestName}${action.payload && action.payload.tag ? `_${action.payload.tag}` : ""}`]: requestState === 'FAILURE' ? data : null
	}
};
