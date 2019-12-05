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

export const API_URL = window._env_.JMP_API_URL || "localhost:7000";
export const APP_NAME = window._env_.JMP_BRAND_NAME || "JMP";
export const APP_MSG = window._env_.JMP_BRAND_MSG || "";
export const APP_NOUN = window._env_.JMP_BRAND_NOUN || "Jump";
export const APP_KEY = window._env_.JMP_BRAND_KEY || "jmp";

const secure = (window._env_.JMP_API_SECURE || "true") === "true";

export const BASE_URL = `http${secure ? "s" : ""}://${API_URL}`;
export const SOCKET_URL = `ws${secure ? "s" : ""}://${API_URL}/api/ws2`;

export const client = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});
