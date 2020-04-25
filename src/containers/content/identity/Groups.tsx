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
import {LinearProgress, makeStyles, Theme, Typography, Zoom} from "@material-ui/core";
import React, {ReactNode, useEffect, useState} from "react";
import Center from "react-center";
import Pagination from "material-ui-flat-pagination/lib/Pagination";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CreateGroupDialog from "../../modal/CreateGroupDialog";
import {MODAL_GROUP_NEW, setDialog} from "../../../store/actions/Modal";
import GroupEditDialog from "../../modal/GroupEditDialog";
import {getGroups, GROUP_LOAD} from "../../../store/actions/groups/GetGroups";
import {setGroupOffset} from "../../../store/actions/groups";
import {TState} from "../../../store/reducers";
import {GroupsState} from "../../../store/reducers/groups";
import {UsersState} from "../../../store/reducers/users";
import GroupCard from "./profile/GroupCard";
import useAuth from "../../../hooks/useAuth";

const useStyles = makeStyles((theme: Theme) => ({
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
		marginTop: theme.spacing(2)
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


	const {groups} = useSelector<TState, GroupsState>(state => state.groups);
	const {headers, isAdmin, isLoggedIn} = useAuth();
	const {offset, search} = useSelector<TState, UsersState>(state => state.users);

	const loading = useSelector<TState, boolean>(state => state.loading[GROUP_LOAD] ?? false);

	const [items, setItems] = useState<Array<ReactNode>>([]);

	const onSearch = (o: number = offset) => {
		getGroups(dispatch, headers, search, Number(o / 8) || 0, 8);
	};

	useEffect(() => {
		onSearch();
	}, [headers.Authorization, search]);

	// hook to rebuild the index when jumps change
	useEffect(() => {
		const {content} = groups;
		setGroupOffset(dispatch, groups.number * 8);
		// Loop-d-loop
		setItems(content.map(g => <Grid key={g.id} item md={12} lg={6}>
			<GroupCard group={g} isAdmin={isAdmin}/>
		</Grid>));
	}, [offset, groups]);

	const onPageChange = (off: number) => {
		setGroupOffset(dispatch, off);
		onSearch(off);
	};

	const createButton = (
		<Button
			className={classes.addButton}
			disabled={!isLoggedIn}
			onClick={() => setDialog(dispatch, MODAL_GROUP_NEW, true, null)}
			variant="outlined">
			Create
		</Button>
	);

	return (
		<div>
			<Zoom in={loading}>
				<LinearProgress className={classes.progress}/>
			</Zoom>
			{items.length === 0 ? <Center>{createButton}</Center> : <div>{createButton}</div>}
			<Grid container spacing={3}>
				{items}
			</Grid>
			<Zoom in={items.length === 0}>
				<Typography
					className={`${classes.title} ${classes.nothing}`}
					align="center"
					color="primary">
					No groups could be found
				</Typography>
			</Zoom>
			<Zoom in={groups.totalElements > groups.size}>
				<Center>
					<Pagination limit={groups.size} offset={offset} total={groups.totalElements}
					            nextPageLabel="▶" previousPageLabel="◀" onClick={(e, off) => onPageChange(off)}/>
				</Center>
			</Zoom>
			<CreateGroupDialog/>
			<GroupEditDialog/>
		</div>
	)
};
