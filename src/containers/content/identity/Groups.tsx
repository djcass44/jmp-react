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
import {List, makeStyles, Theme, Typography, Zoom} from "@material-ui/core";
import {Alert, Pagination} from "@material-ui/lab";
import React, {ReactNode, useEffect, useMemo, useState} from "react";
import Center from "react-center";
import Button from "@material-ui/core/Button";
import CreateGroupDialog from "../../modal/CreateGroupDialog";
import {MODAL_GROUP_NEW, setDialog} from "../../../store/actions/Modal";
import GroupEditDialog from "../../modal/GroupEditDialog";
import {getGroups, GROUP_LOAD} from "../../../store/actions/groups/GetGroups";
import {setGroupOffset} from "../../../store/actions/groups";
import {TState} from "../../../store/reducers";
import {GroupsState} from "../../../store/reducers/groups";
import useAuth from "../../../hooks/useAuth";
import {pageSize} from "../../../constants";
import JumpItemSkeleton from "../../../components/content/jmp/JumpItemSkeleton";
import useLoading from "../../../hooks/useLoading";
import usePathVar from "../../../hooks/usePathVar";
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

export default (): JSX.Element => {
	// hooks
	const dispatch = useDispatch();
	const classes = useStyles();


	const {groups, offset} = useSelector<TState, GroupsState>(state => state.groups);
	const searchFilter = usePathVar();
	const {headers, isAdmin, isLoggedIn} = useAuth();

	const loading = useLoading([GROUP_LOAD]);

	const [items, setItems] = useState<Array<ReactNode>>([]);
	const loadingItems = useMemo((): Array<ReactNode> => {
		if (!loading)
			return [];
		const l = [];
		const size = groups.numberOfElements || 2;
		for (let i = 0; i < size; i++) {
			l.push(<JumpItemSkeleton key={i}/>);
		}
		return l;
	}, [loading]);

	const onSearch = (o: number = offset) => {
		dispatch(getGroups(headers, searchFilter, Number(o / pageSize) || 0, pageSize));
	};

	useEffect(() => {
		onSearch();
	}, [headers.Authorization, searchFilter]);

	// hook to rebuild the index when jumps change
	useEffect(() => {
		const {content} = groups;
		dispatch(setGroupOffset(groups.number * pageSize));
		// Loop-d-loop
		setItems(content.map(g => <GroupCard key={g.id} group={g} isAdmin={isAdmin}/>));
	}, [offset, groups]);

	const onPageChange = (_: React.ChangeEvent<unknown>, value: number): void => {
		dispatch(setGroupOffset(value));
		onSearch(value);
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
					onClick={() => dispatch(setDialog(MODAL_GROUP_NEW, true, null))}
					variant="contained">
					New group
				</Button>
			</div>
			<List>
				{loadingItems}
				{!loading && items}
			</List>
			{items.length === 0 && !loading && <Alert
				severity="info">
				No groups could be found
			</Alert>}
			<Zoom in={groups.totalElements > groups.size}>
				<Center>
					<Pagination
						count={groups.totalPages}
						page={(groups.pageable?.pageNumber || 0) + 1}
						onChange={onPageChange}
						color="primary"
						size="small"
					/>
				</Center>
			</Zoom>
			<CreateGroupDialog/>
			<GroupEditDialog/>
		</div>
	)
};
