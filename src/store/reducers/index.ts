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
import {SimpleMap} from "../../types";
import snackbar from "../../reducers/Snackbar";
import jumps, {JumpsState} from "./jumps";
import auth, {AuthState} from "./auth";
import loading from "./loading";
import errors from "./errors";
import users, {UsersState} from "./users";
import groups, {GroupsState} from "./groups";
import info, {InfoState} from "./info";
import generic, {GenericState} from "./generic";
import modal, {Modal} from "./modal";

export interface TState {
	jumps: JumpsState;
	auth: AuthState;
	users: UsersState;
	groups: GroupsState;
	info: InfoState;
	loading: SimpleMap<boolean>;
	errors: SimpleMap<string | any | null>;
	generic: GenericState;
	modal: SimpleMap<Modal>;
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
});