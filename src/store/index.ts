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

import {applyMiddleware, compose, createStore} from "redux";
import thunk from "redux-thunk";
import {apiMiddleware} from "redux-api-middleware";
import {PersistConfig, persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage";
import apiDefaultValues from "../config/apiDefaultValues";
import reducers, {TState} from "./reducers";

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
	}
}

const persistConfig: PersistConfig<TState> = {
	key: "root",
	storage,
	whitelist: []
};
const persistedReducers = persistReducer(persistConfig, reducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
	persistedReducers,
	composeEnhancers(
		applyMiddleware(
			thunk,
			apiDefaultValues,
			apiMiddleware
		)
	)
);
export const persist = persistStore(store);
