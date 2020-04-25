/*
 *    Copyright 2020 Django Cass
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

import {useSelector} from "react-redux";
import {TState} from "../store/reducers";
import {AuthHeaders} from "../types";
import {getHeadersFromRaw} from "../util";

export interface HeaderHook {
	headers: AuthHeaders;
	isAdmin: boolean;
	request: string | null;
	refresh: string | null;
	isLoggedIn: boolean;
	source: string | null;
}

/**
 * Builds HeaderHook from a given state
 * @param state: the root state object
 */
const getHeaders = (state: TState): HeaderHook => {
	const {request, source, isLoggedIn, refresh, isAdmin} = state.auth;
	const headers = getHeadersFromRaw(request, source);
	return {
		headers,
		isLoggedIn,
		isAdmin,
		refresh,
		request,
		source
	};
};

export default (): HeaderHook => {
	return useSelector<TState, HeaderHook>(state => getHeaders(state));
};