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
import {
	Avatar,
	IconButton,
	LinearProgress,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	makeStyles,
	Paper,
	Tooltip
} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import EmptyCard from "../../../components/widget/EmptyCard";
import Center from "react-center";
import Pagination from "material-ui-flat-pagination/lib/Pagination";
import {pageSize} from "../../../constants";
import {getGroups, GROUP_LOAD} from "../../../actions/Groups";
import Icon from "@mdi/react";
import {mdiAccountGroupOutline, mdiPencilOutline} from "@mdi/js";
import {defaultSorts, sortItems} from "../../../misc/Sort";
import CreateGroupDialog from "../../modal/CreateGroupDialog";
import {MODAL_GROUP_EDIT, MODAL_GROUP_NEW, setDialog} from "../../../actions/Modal";
import getAvatarScheme from "../../../style/getAvatarScheme";
import {useTheme} from "@material-ui/core/styles";
import SortedSubheader from "../../../components/content/SortedSubheader";
import GroupEditDialog from "../../modal/GroupEditDialog";
import getIconColour from "../../../style/getIconColour";
import {createIndex} from "../../../misc/Search";
import {clone} from "../../../util";

const useStyles = makeStyles(() => ({
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
	}
}));

const searchFields = [
	{
		name: "name",
		weight: 0.7
	},
	{
		name: "from",
		weight: 0.3
	},
];

export default () => {
	// hooks
	const dispatch = useDispatch();
	const theme = useTheme();
	const classes = useStyles();


	const {groups} = useSelector(state => state.groups);
	const loading = useSelector(state => state.loading.get(GROUP_LOAD));
	const {headers, isAdmin} = useSelector(state => state.auth);
	const {sort, searchFilter} = useSelector(state => state.generic);

	const sorts = defaultSorts;
	const [items, setItems] = useState([]);
	const [offset, setOffset] = useState(0);
	const [idx, setIdx] = useState(null);

	useEffect(() => {
		getGroups(dispatch, headers);
	}, [headers]);

	// hook to rebuild the index when jumps change
	useEffect(() => {
		setIdx(createIndex(searchFields, groups));
		const g2 = clone(groups);
		sortItems(g2, sort);
		const tempItems = [];

		// Tell the loop what our pagination limits are
		let max = (offset + pageSize);
		if (max > groups.length) max = groups.length;

		filterGroup(g2).forEach((i, index) => {
			if (index < offset || index > max) return;
			const primary = (<span className={classes.title}>{i.name}</span>);
			const secondary = (<span>
				{capitalise(i.source)}
				{(i.public === true || i.defaultFor != null) &&
				<span>
					&nbsp;&bull;&nbsp;{i.public === true ? "Public" : `Default for ${i.defaultFor} users`}
				</span>}
			</span>);
			tempItems.push(<ListItem className={classes.item} button disableRipple key={index}>
				<Avatar component={'div'} style={{backgroundColor: scheme[0], color: scheme[1], marginRight: 12}}>
					<Icon path={mdiAccountGroupOutline} size={1} color={scheme[1]}/>
				</Avatar>
				<ListItemText primary={primary} secondary={secondary}/>
				{isAdmin && !i.name.startsWith("_") && <ListItemSecondaryAction>
					<Tooltip title="Edit group">
						<IconButton centerRipple={false}
						            onClick={() => setDialog(dispatch, MODAL_GROUP_EDIT, true, {group: i})}>
							<Icon path={mdiPencilOutline} size={0.85} color={getIconColour(theme)}/>
						</IconButton>
					</Tooltip>
				</ListItemSecondaryAction>}
			</ListItem>);
		});
		setItems(tempItems);
	}, [offset, sort, groups, searchFilter]);

	const filterGroup = collection => {
		if (searchFilter == null || searchFilter === "")
			return collection;
		return idx.search(searchFilter);
	};

	const capitalise = text => {
		if (text == null || text.length === 0) return text;
		if (text.toLowerCase() === "ldap") return "LDAP";
		return text.substring(0, 1).toUpperCase() + text.substring(1, text.length).toLowerCase();
	};
	// get the colour scheme
	const scheme = getAvatarScheme(theme, 2);

	return (
		<div>
			<SortedSubheader title="Groups" size={items.length} sorts={sorts}
			                 onAdd={() => setDialog(dispatch, MODAL_GROUP_NEW, true)}/>
			{loading === true ? <LinearProgress className={classes.progress} color="primary"/> : ""}
			<Paper key="root" style={{borderRadius: 12, marginBottom: 8}}>
				<List component='ul'>
					{items.length > 0 ? items : <EmptyCard/>}
				</List>
			</Paper>
			{items.length > pageSize || offset > 0 ?
				<Center>
					<Pagination limit={pageSize} offset={offset} total={groups.length}
					            nextPageLabel={"▶"} previousPageLabel={"◀"} onClick={(e, off) => setOffset(off)}/>
				</Center>
				:
				<div/>
			}
			<CreateGroupDialog/>
			<GroupEditDialog/>
		</div>
	)
};
