import axios from "axios";
import {applyMiddleware} from "redux/es/redux";
import {createStore} from "redux";
import axiosMiddleware from "redux-axios-middleware";
import {BASE_URL} from "../constants";
import main from "../reducers";

const client = axios.create({
	baseURL: BASE_URL,
	responseType: 'json'
});
let store = createStore(
	main,
	applyMiddleware(axiosMiddleware(client))
);
export default store;