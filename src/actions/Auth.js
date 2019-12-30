import {get} from "./index";

export const OAUTH_VERIFY = "OAUTH_VERIFY";
export const OAUTH_REQUEST = "OAUTH_REQUEST";
export const OAUTH_REFRESH = "OAUTH_REFRESH";
export const OAUTH_LOGOUT = "OAUTH_LOGOUT";
export const GET_PROVIDERS = "GET_PROVIDERS";

export const getProviders = (dispatch, headers) => get(dispatch, GET_PROVIDERS, "/api/v2/providers", {headers});
