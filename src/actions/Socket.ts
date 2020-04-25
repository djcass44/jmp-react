import {Dispatch} from "redux";
import {getJumps} from "../store/actions/jumps/GetJumps";
import {store} from "../store";
import {SOCKET_UPDATE_USERS} from "../store/actions/users";
import {getUsers} from "../store/actions/users/GetUsers";
import {SOCKET_UPDATE_GROUPS} from "../store/actions/groups";
import {getGroups} from "../store/actions/groups/GetGroups";
import {SOCKET_URL} from "../constants";
import {Action} from "../types";
import {SOCKET_UPDATE_JUMP} from "../store/actions/jumps";
import {getHeadersFromRaw} from "../util";
import {addSnackbar, closeSnackbar, removeSnackbar} from "./Snackbar";

export const WS_OPEN = "WS_OPEN";
export const WS_RECONNECT = "WS_RECONNECT";
export const WS_CLOSE = "WS_CLOSE";
export const WS_CLOSE_USER = "WS_CLOSE_USER"; // user requested
export const WS_BAD_TICK = "WS_BAD_TICK";

let socket: WebSocket | null = null;
let badTicks = 0;

export const connectWebSocket = (dispatch: Dispatch) => {
	socket = new WebSocket(SOCKET_URL);
	socket.addEventListener('open', () => {
		badTicks = 0;
		dispatch({type: WS_BAD_TICK, payload: badTicks});
		dispatch(removeSnackbar(WS_CLOSE));
		dispatch(closeSnackbar(WS_CLOSE));
		dispatch({type: WS_OPEN})
	});
	socket.addEventListener('close', () => {
		setTimeout(() => {
			connectWebSocket(dispatch);
			dispatch({type: WS_RECONNECT});
		}, 2000);
		dispatch({type: WS_CLOSE});
		setTimeout(() => {
			badTicks++;
			dispatch({type: WS_BAD_TICK, payload: badTicks});
			if (badTicks > 3) {
				// add a slight delay
				dispatch(addSnackbar({
					message: "Trouble reaching servers",
					options: {key: WS_CLOSE, variant: "warning"}
				}));
			}
		}, 500);
	});
	socket.addEventListener('message', ev => {
		const data = JSON.parse(ev.data) as Action;
		checkType(dispatch, data);
	});
};

const checkType = (dispatch: Dispatch, action: Action) => {
	const {type, payload} = action;
	// get values we need from the state
	const state = store.getState();
	const headers = getHeadersFromRaw(state.auth.request, state.auth.source);
	switch (type) {
		case SOCKET_UPDATE_JUMP: {
			const {offset, search} = state.jumps;
			getJumps(dispatch, headers, search, Number(offset / 8) || 0);
			break;
		}
		case SOCKET_UPDATE_GROUPS: {
			getGroups(dispatch, headers);
			break;
		}
		case SOCKET_UPDATE_USERS: {
			getUsers(dispatch, headers);
			break;
		}
		default:
			dispatch({type, payload});
	}
};

export const closeWebSocket = (dispatch: Dispatch) => {
	socket?.close();
	dispatch({type: WS_CLOSE_USER});
};