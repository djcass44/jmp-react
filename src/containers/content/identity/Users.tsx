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

import {useDispatch, useSelector} from "react-redux";
import {List, makeStyles, Theme, Typography} from "@material-ui/core";
import React, {ReactNode, useEffect, useState} from "react";
import Center from "react-center";
import Pagination from "material-ui-flat-pagination/lib/Pagination";
import Button from "@material-ui/core/Button";
import {getUsers, USER_LOAD} from "../../../store/actions/users/GetUsers";
import {PATCH_USER_ROLE} from "../../../store/actions/users/PatchUserRole";
import {setUserOffset} from "../../../store/actions/users";
import GroupModDialog from "../../modal/GroupModDialog";
import {MODAL_GROUP_NEW, setDialog} from "../../../store/actions/Modal";
import {TState} from "../../../store/reducers";
import {UsersState} from "../../../store/reducers/users";
import {User} from "../../../types";
import useAuth from "../../../hooks/useAuth";
import {pageSize} from "../../../constants";
import JumpItemSkeleton from "../../../components/content/jmp/JumpItemSkeleton";
import UserOptionsMenu from "./UserOptionsMenu";
import UserCard from "./profile/UserCard";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		marginTop: theme.spacing(1)
	},
	title: {
		fontFamily: "Manrope",
		fontWeight: 400,
		fontSize: 22,
		color: theme.palette.text.primary,
		width: "100%"
	},
	progress: {
		backgroundColor: "transparent",
		flexGrow: 1
	},
	item: {
		animation: "fadein 300ms ease-in-out"
	},
	nothing: {
		textAlign: "center",
		padding: theme.spacing(2)
	},
	addButton: {
		fontFamily: "Manrope",
		fontWeight: 600,
		minWidth: 128,
		textTransform: "none"
	}
}));

export default () => {
	// hooks
	const dispatch = useDispatch();
	const classes = useStyles();

	const {users, offset, search} = useSelector<TState, UsersState>(state => state.users);
	const {headers} = useAuth();
	const loading = useSelector<TState, boolean>(state => state.loading[USER_LOAD] ?? false);
	const loadingPatch = useSelector<TState, boolean>(state => state.loading[PATCH_USER_ROLE] ?? false);

	const [items, setItems] = useState<Array<ReactNode>>([]);
	const [expanded, setExpanded] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null);
	const [lData, setLData] = useState<Array<ReactNode>>([]);

	const onSearch = (o: number = offset) => {
		getUsers(dispatch, headers, search, Number(o / pageSize) || 0, pageSize);
	};

	useEffect(() => {
		if (!loading && !loadingPatch) {
			setLData([]);
			return;
		}
		const l = [];
		const size = users.numberOfElements || 2;
		for (let i = 0; i < size; i++) {
			l.push(<JumpItemSkeleton key={i}/>);
		}
		setLData(l);
	}, [loading, loadingPatch]);

	useEffect(() => {
		onSearch();
	}, [headers.Authorization, search]);

	useEffect(() => {
		const {content} = users;
		dispatch(setUserOffset(users.number * pageSize));
		// Loop-d-loop
		setItems(content.map(u => <UserCard key={u.id} user={u} setAnchorEl={e => toggleExpansion(e, u)}/>));
	}, [users, offset, expanded]);

	const toggleExpansion = (e: EventTarget & HTMLButtonElement | null, u: User | null) => {
		setExpanded(u != null);
		setUser(user === u ? null : u);
		setAnchorEl(user === u || e == null ? null : e);
	};

	const onPageChange = (off: number) => {
		dispatch(setUserOffset(off));
		onSearch(off);

		// reset ui values
		setUser(null);
		setAnchorEl(null);
		setExpanded(false);
	};

	return (
		<div className={classes.root}>
			<div style={{display: "flex"}}>
				<Typography
					className={classes.title}>
					Users
				</Typography>
				<Button
					className={classes.addButton}
					color="primary"
					disableElevation
					disabled
					onClick={() => dispatch(setDialog(MODAL_GROUP_NEW, true, null))}
					variant="contained">
					New user
				</Button>
			</div>
			<List>
				{lData}
				{items}
			</List>
			{items.length === 0 && <Typography className={`${classes.title} ${classes.nothing}`} color="primary">
				No users could be found
			</Typography>}
			{users.totalElements > users.size && <Center>
				<Pagination
					limit={users.size}
					offset={offset}
					total={users.totalElements}
					nextPageLabel="▶"
					previousPageLabel="◀"
					onClick={(e, off) => onPageChange(off)}
				/>
			</Center>}
			<UserOptionsMenu
				user={user}
				expanded={expanded}
				anchorEl={anchorEl}
				close={() => {
					toggleExpansion(null, null);
				}}
			/>
			<GroupModDialog/>
		</div>
	);
};
