import axios from "axios";

export const LS_REQUEST = "jmpr-request";
export const LS_REFRESH = "jmpr-refresh";
export const LS_HEADERS = "jmpr-headers";
export const LS_USER = "jmpr-user";

export const pageSize = 10;

export const BASE_URL = `${process.env.REACT_APP_API_SCHEME}://${process.env.REACT_APP_API_URL}`;

export const client = axios.create({
	baseURL: BASE_URL
});