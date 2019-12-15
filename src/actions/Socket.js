import {SOCKET_URL} from "../constants";
import {listJumps, SOCKET_UPDATE_JUMP} from "./Jumps";
import {getGroups, SOCKET_UPDATE_GROUPS} from "./Groups";
import {getUsers, SOCKET_UPDATE_USERS} from "./Users";
import {addSnackbar, closeSnackbar, removeSnackbar} from "./Snackbar";

export const WS_OPEN = "WS_OPEN";
export const WS_RECONNECT = "WS_RECONNECT";
export const WS_CLOSE = "WS_CLOSE";
export const WS_CLOSE_USER = "WS_CLOSE_USER"; // user requested
export const WS_BAD_TICK = "WS_BAD_TICK";

let socket = null;
let badTicks = 0;

export const connectWebSocket = (dispatch, headers) => {
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
			connectWebSocket(dispatch, headers);
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
		const data = JSON.parse(ev.data);
		const {type} = data;
		const {payload} = data;
		checkType(dispatch, type, payload, headers);
	});
};

const checkType = (dispatch, type, payload, headers) => {
	switch(type) {
		case SOCKET_UPDATE_JUMP: {
			listJumps(dispatch, headers);
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

export const closeWebSocket = dispatch => {
	socket.close();
	dispatch({type: WS_CLOSE_USER});
};