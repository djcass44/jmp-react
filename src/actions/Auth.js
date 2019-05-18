export const OAUTH_VERIFY = "OAUTH_VERIFY";
export const OAUTH_REQUEST = "OAUTH_REQUEST";
export const OAUTH_REFRESH = "OAUTH_REFRESH";

export function oauthVerify(headers) {
	return dispatch => {
		oauthVerifyDispatch(dispatch, headers);
	}
}
export function oauthRequest(data) {
	return dispatch => {
		oauthRequestDispatch(dispatch, data);
	}
}
export function oauthRefresh(refresh, headers) {
	return dispatch => {
		oauthRefreshDispatch(dispatch, refresh, headers);
	}
}

function oauthVerifyDispatch(dispatch, headers) {
	dispatch({
		type: OAUTH_VERIFY,
		payload: {
			request: {
				method: 'GET',
				headers: headers,
				url: '/api/v2/oauth/valid'
			}
		}
	})
}
function oauthRequestDispatch(dispatch, data) {
	dispatch({
		type: OAUTH_REQUEST,
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
	})
}
function oauthRefreshDispatch(dispatch, refresh, headers) {
	dispatch({
		type: OAUTH_REFRESH,
		payload: {
			request: {
				method: 'GET',
				headers: headers,
				url: `/api/v2/oauth/refresh?refreshToken=${refresh}`
			}
		}
	})
}