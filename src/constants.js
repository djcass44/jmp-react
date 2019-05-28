import axios from "axios";
import openSocket from "socket.io-client";

export const LS_REQUEST = "jmpr-request";
export const LS_REFRESH = "jmpr-refresh";
export const LS_HEADERS = "jmpr-headers";
export const LS_USER = "jmpr-user";
export const LS_LOGIN = "jmpr-login";
export const LS_ADM = "jmpr-adm";
export const LS_NAME = "jmpr-name";

export const LS_DARK = "jmpr-dark";

export const pageSize = 8;

export const BASE_URL = `${process.env.REACT_APP_API_SCHEME}://${process.env.REACT_APP_API_URL}`;

export const client = axios.create({
	baseURL: BASE_URL
});
export const socket = openSocket(process.env.REACT_APP_SOCKET_URL, {
	secure: process.env.NODE_ENV === 'production',
	// Start with websockets and downgrade to polling if we have to
	transports: ['websocket', 'polling']
});