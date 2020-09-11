export const pageSize = 8;

interface WindowEnv {
	JMP_API_URL?: string;
	JMP_API_SECURE?: string;
	JMP_BRAND_NAME?: string;
	JMP_BRAND_MSG?: string;
	JMP_BRAND_NOUN?: string;
	JMP_BRAND_KEY?: string;
}

declare global {
	interface Window {
		_env_?: WindowEnv;
	}
}

export const API_URL = window._env_?.JMP_API_URL || "localhost:7000";
export const APP_NAME = window._env_?.JMP_BRAND_NAME || "JMP";
export const APP_MSG = window._env_?.JMP_BRAND_MSG || "";
export const APP_NOUN = window._env_?.JMP_BRAND_NOUN || "Jump";
export const APP_KEY = window._env_?.JMP_BRAND_KEY || "jmp";

const secure = (window._env_?.JMP_API_SECURE || "true") === "true";

export const BASE_URL = `http${secure ? "s" : ""}://${API_URL}`;
export const SOCKET_URL = `ws${secure ? "s" : ""}://${API_URL}/api/ws2`;

export const METHOD_GET = "GET";
export const METHOD_POST = "POST";
export const METHOD_PATCH = "PATCH";
export const METHOD_PUT = "PUT";
export const METHOD_DELETE = "DELETE";
