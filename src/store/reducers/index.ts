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

import {combineReducers} from "redux";
import snackbar from "../../reducers/Snackbar";
import jumps from "./jumps";
import auth from "./auth";
import loading from "./loading";
import errors from "./errors";
import users from "./users";
import groups from "./groups";
import info from "./info";
import generic from "./generic";
import modal from "./modal";

const rootReducers = combineReducers({
	jumps,
	auth,
	loading,
	errors,
	generic,
	users,
	groups,
	info,
	modal,
	snackbar
});
export type TState = ReturnType<typeof rootReducers>;
export default rootReducers;