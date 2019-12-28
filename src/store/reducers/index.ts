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

import jumps, {JumpsState} from "./jumps";
import {combineReducers} from "redux";
import auth from "../../reducers/Auth";
import loading from "./loading";
import errors from "../../reducers/Errors";
import generic from "../../reducers/Generic";
import users from "../../reducers/Users";
import groups from "../../reducers/Groups";
import info from "../../reducers/Info";
import modal from "../../reducers/Modal";
import snackbar from "../../reducers/Snackbar";

export interface TState {
	jumps: JumpsState;
	loading: Map<string, boolean>;
}

export default combineReducers({
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
})