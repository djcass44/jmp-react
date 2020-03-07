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

import {Menu, MenuItem} from "@material-ui/core";
import {MODAL_USER_GROUPS, setDialog} from "../../../actions/Modal";
import React from "react";
import {User} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {TState} from "../../../store/reducers";
import {AuthState} from "../../../store/reducers/auth";
import {patchUserRole} from "../../../store/actions/users/PatchUserRole";

interface UserOptionsMenuProps {
	user: User | null;
	expanded: boolean;
	anchorEl: EventTarget & HTMLButtonElement | null;
	close: () => void;
}

const UserOptionsMenu: React.FC<UserOptionsMenuProps> = ({user, expanded, anchorEl, close}) => {
	// hooks
	const dispatch = useDispatch();

	// global state
	const {headers, isAdmin} = useSelector<TState, AuthState>(state => state.auth);

	if (user == null)
		return null;

	const handlePatchUser = (admin: boolean) => {
		patchUserRole(dispatch, headers, user.id, admin);
		close();
	};

	return (
		<Menu
			id="user-menu"
			open={expanded}
			anchorEl={anchorEl}
			transformOrigin={{horizontal: "center", vertical: "top"}}
			onClose={() => close()}>
			{(isAdmin && user.admin !== true && user.username !== "system") &&
			<MenuItem button component='li' onClick={() => handlePatchUser(true)}>
				Promote to admin
			</MenuItem>}
			{(isAdmin && user.admin === true && user.username !== "admin") && <MenuItem
				button
				onClick={() => handlePatchUser(false)}>
				Demote to user
			</MenuItem>}
			<MenuItem
				button
				onClick={() => {
					setDialog(dispatch, MODAL_USER_GROUPS, true, {user});
					close();
				}}>
				Modify groups
			</MenuItem>
		</Menu>
	);
};
export default UserOptionsMenu;
