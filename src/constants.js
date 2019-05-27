import axios from "axios";

export const LS_REQUEST = "jmpr-request";
export const LS_REFRESH = "jmpr-refresh";
export const LS_HEADERS = "jmpr-headers";
export const LS_USER = "jmpr-user";
export const LS_LOGIN = "jmpr-login";
export const LS_ADM = "jmpr-adm";
export const LS_NAME = "jmpr-name";

export const pageSize = 8;

export const BASE_URL = `${process.env.REACT_APP_API_SCHEME}://${process.env.REACT_APP_API_URL}`;

export const client = axios.create({
	baseURL: BASE_URL
});