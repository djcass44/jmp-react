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
import {Grid, LinearProgress, makeStyles, Theme, Typography, Zoom} from "@material-ui/core";
import React, {ReactNode, useEffect, useState} from "react";
import Center from "react-center";
import Pagination from "material-ui-flat-pagination/lib/Pagination";
import GroupModDialog from "../../modal/GroupModDialog";
import UserCard from "./profile/UserCard";
import UserOptionsMenu from "./UserOptionsMenu";
import {getUsers, USER_LOAD} from "../../../store/actions/users/GetUsers";
import {PATCH_USER_ROLE} from "../../../store/actions/users/PatchUserRole";
import {setUserOffset} from "../../../store/actions/users";
import Button from "@material-ui/core/Button";
import {MODAL_GROUP_NEW, setDialog} from "../../../actions/Modal";
import {TState} from "../../../store/reducers";
import {UsersState} from "../../../store/reducers/users";
import {AuthState} from "../../../store/reducers/auth";
import {User} from "../../../types";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		marginTop: theme.spacing(4)
	},
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	progress: {
		backgroundColor: 'transparent',
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
		margin: theme.spacing(2),
		color: theme.palette.success.main
	}
}));

export default () => {
	// hooks
	const dispatch = useDispatch();
	const classes = useStyles();

	const {users, offset, search} = useSelector<TState, UsersState>(state => state.users);
	const {headers} = useSelector<TState, AuthState>(state => state.auth);
	const loading = useSelector<TState, boolean>(state => state.loading.get(USER_LOAD) ?? false);
	const loadingPatch = useSelector<TState, boolean>(state => state.loading.get(PATCH_USER_ROLE) ?? false);

	const [items, setItems] = useState<Array<ReactNode>>([]);
	const [expanded, setExpanded] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null);

	const onSearch = (o: number = offset) => {
		getUsers(dispatch, headers, search, Number(o / 8) || 0, 8);
	};

	useEffect(() => {
		onSearch();
	}, [headers, search]);

	useEffect(() => {
		const {content} = users;
		setUserOffset(dispatch, users.number * 8);
		// Loop-d-loop
		setItems(content.map(u => <Grid key={u.id} item md={12} lg={6}>
			<UserCard user={u} setAnchorEl={e => toggleExpansion(e, u)}/>
		</Grid>));
	}, [users, offset, expanded]);

	const toggleExpansion = (e: EventTarget & HTMLButtonElement, u: User | null) => {
		setExpanded(u != null);
		setUser(user === u ? null : u);
		setAnchorEl(user === u ? null : e);
	};

	const onPageChange = (off: number) => {
		setUserOffset(dispatch, off);
		onSearch(off);

		// reset ui values
		setUser(null);
		setAnchorEl(null);
		setExpanded(false);
	};

	const createButton = (
		<Button
			className={classes.addButton}
			disabled
			onClick={() => setDialog(dispatch, MODAL_GROUP_NEW, true)}
			variant="outlined">
			Create
		</Button>
	);

	return (
		<div className={classes.root}>
			<Zoom in={loading || loadingPatch}>
				<LinearProgress/>
			</Zoom>
			{items.length === 0 ? <Center>{createButton}</Center> : <div>{createButton}</div>}
			<Grid container spacing={3}>
				{items}
			</Grid>
			<Zoom in={items.length === 0}>
				<Typography className={`${classes.title} ${classes.nothing}`} color="primary">
					No users could be found
				</Typography>
			</Zoom>
			<Zoom in={users.totalElements > users.size}>
				<Center>
					<Pagination limit={users.size} offset={offset} total={users.totalElements}
					            nextPageLabel="▶" previousPageLabel="◀" onClick={(e, off) => onPageChange(off)}/>
				</Center>
			</Zoom>
			<UserOptionsMenu user={user} expanded={expanded} anchorEl={anchorEl} close={() => setExpanded(false)}/>
			<GroupModDialog/>
		</div>
	);
};
