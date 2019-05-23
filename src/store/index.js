/*
 *    Copyright 2019 Django Cass
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 */

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