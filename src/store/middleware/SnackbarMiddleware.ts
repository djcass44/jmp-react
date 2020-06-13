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

import {Action, Dispatch, Middleware, MiddlewareAPI} from "redux";
import {addSnackbar} from "../actions/snackbar";

/**
 * Redux middleware for displaying _FAILURE actions as snackbars
 */
export const SnackbarMiddleware: Middleware = (api: MiddlewareAPI) => (next: Dispatch) => <A extends Action>(action: A) => {
	const matches = /(.*)_FAILURE/.exec(action.type);
	// ignore non-failures
	if (!matches) return next(action);
	if ((action as any).meta) {
		// dispatch the snackbar
		api.dispatch(addSnackbar({
			message: (action as any).meta || "Something went wrong",
			options: {key: action.type, variant: "error"}
		}));
	}
	// continue on
	return next(action);
};