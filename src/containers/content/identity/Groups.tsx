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
import CreateGroupDialog from "../../modal/CreateGroupDialog";
import {MODAL_GROUP_NEW, setDialog} from "../../../store/actions/Modal";
import GroupEditDialog from "../../modal/GroupEditDialog";
import {getGroups, GROUP_LOAD} from "../../../store/actions/groups/GetGroups";
import {setGroupOffset} from "../../../store/actions/groups";
import {TState} from "../../../store/reducers";
import {GroupsState} from "../../../store/reducers/groups";
import {UsersState} from "../../../store/reducers/users";
import useAuth from "../../../hooks/useAuth";
import {pageSize} from "../../../constants";
import JumpItemSkeleton from "../../../components/content/jmp/JumpItemSkeleton";
import GroupCard from "./profile/GroupCard";

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
		marginTop: theme.spacing(2)
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


	const {groups} = useSelector<TState, GroupsState>(state => state.groups);
	const {headers, isAdmin, isLoggedIn} = useAuth();
	const {offset, search} = useSelector<TState, UsersState>(state => state.users);

	const loading = useSelector<TState, boolean>(state => state.loading[GROUP_LOAD] ?? false);

	const [items, setItems] = useState<Array<ReactNode>>([]);
	const [lData, setLData] = useState<Array<ReactNode>>([]);

	const onSearch = (o: number = offset) => {
		getGroups(dispatch, headers, search, Number(o / pageSize) || 0, pageSize);
	};

	useEffect(() => {
		if (!loading) {
			setLData([]);
			return;
		}
		const l = [];
		const size = groups.numberOfElements || 2;
		for (let i = 0; i < size; i++) {
			l.push(<JumpItemSkeleton key={i}/>);
		}
		setLData(l);
	}, [loading]);

	useEffect(() => {
		onSearch();
	}, [headers.Authorization, search]);

	// hook to rebuild the index when jumps change
	useEffect(() => {
		const {content} = groups;
		setGroupOffset(dispatch, groups.number * pageSize);
		// Loop-d-loop
		setItems(content.map(g => <GroupCard key={g.id} group={g} isAdmin={isAdmin}/>));
	}, [offset, groups]);

	const onPageChange = (off: number) => {
		setGroupOffset(dispatch, off);
		onSearch(off);
	};

	return (
		<div className={classes.root}>
			<div style={{display: "flex"}}>
				<Typography
					className={classes.title}>
					Groups
				</Typography>
				<Button
					className={classes.addButton}
					color="primary"
					disableElevation
					disabled={!isLoggedIn}
					onClick={() => setDialog(dispatch, MODAL_GROUP_NEW, true, null)}
					variant="contained">
					New group
				</Button>
			</div>
			<List>
				{lData}
				{items}
			</List>
			{items.length === 0 && <Typography
				className={`${classes.title} ${classes.nothing}`}
				align="center"
				color="primary">
				No groups could be found
			</Typography>}
			{groups.totalElements > groups.size && <Center>
				<Pagination
					limit={groups.size}
					offset={offset}
					total={groups.totalElements}
					nextPageLabel="▶"
					previousPageLabel="◀"
					onClick={(e, off) => onPageChange(off)}
				/>
			</Center>}
			<CreateGroupDialog/>
			<GroupEditDialog/>
		</div>
	)
};
