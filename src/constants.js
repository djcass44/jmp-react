import axios from "axios";

export const LS_REQUEST = "jmpr-request";
export const LS_REFRESH = "jmpr-refresh";
export const LS_SOURCE = "jmp-source";
export const LS_HEADERS = "jmpr-headers";
export const LS_USER = "jmpr-user";
export const LS_LOGIN = "jmpr-login";
export const LS_ADM = "jmpr-adm";
export const LS_NAME = "jmpr-name";

export const LS_DARK = "jmpr-dark";
export const LS_APPID = "jmpr-appid";
export const LS_SORT = "jmpr-sortBy";

export const pageSize = 8;

export const APP_NOUN = process.env.REACT_APP_APP_NOUN || "Jump";

export const BASE_URL = `${process.env.REACT_APP_API_SCHEME}://${process.env.REACT_APP_API_URL}`;
export const SOCKET_URL = `${process.env.NODE_ENV === "production" ? "wss" : "ws"}://${process.env.REACT_APP_API_URL}/api/ws2`;

export const client = axios.create({
	baseURL: BASE_URL
});
