import axios from "axios";
import {applyMiddleware} from "redux/es/redux";
import {compose, createStore} from "redux";
import axiosMiddleware from "redux-axios-middleware";
import thunkMiddleware from "redux-thunk";
import {BASE_URL} from "../constants";
import main from "../reducers";

const client = axios.create({
	baseURL: BASE_URL,
	responseType: 'json'
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(
	main,
	composeEnhancers(
		applyMiddleware(
			axiosMiddleware(client),
			thunkMiddleware
		)
	)
);
export default store;