export function oauthVerify(headers) {
	return dispatch => {
		oauthVerifyDispatch(dispatch, headers);
	}
}

function oauthVerifyDispatch(dispatch, headers) {
	dispatch({
		type: 'OAUTH_VERIFY',
		payload: {
			request: {
				method: 'GET',
				headers: headers,
				url: '/api/v2/oauth/verify'
			}
		}
	})
}
export const oauthRequest = (data) => ({
	type: 'OAUTH_REQUEST',
	payload: {
		request: {
			method: 'POST',
			headers: {
				'Authorization': `Basic ${data}`,
				'Content-Type': 'application/json'
			},
			url: '/api/v2/oauth/token',
			data: {}
		}
	}
});
export const oauthRefresh = (refresh, headers) => ({
	type: 'OAUTH_REFRESH',
	payload: {
		request: {
			method: 'GET',
			headers: headers,
			url: `/api/v2/oauth/refresh?refreshToken=${refresh}`
		}
	}
});