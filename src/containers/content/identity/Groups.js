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
import {getGroupsDispatch, GROUP_LOAD} from "../../../actions/Groups";
import Icon from "@mdi/react";
import {mdiAccountGroupOutline, mdiPencilOutline} from "@mdi/js";
import posed, {PoseGroup} from "react-pose";
import {defaultSorts, sortItems} from "../../../misc/Sort";
import CreateGroupDialog from "../../modal/CreateGroupDialog";
import {MODAL_GROUP_EDIT, MODAL_GROUP_NEW, setDialog} from "../../../actions/Modal";
import getAvatarScheme from "../../../style/getAvatarScheme";
import {useTheme} from "@material-ui/core/styles";
import SortedSubheader from "../../../components/content/SortedSubheader";
import GroupEditDialog from "../../modal/GroupEditDialog";
import getIconColour from "../../../style/getIconColour";
import {createIndex} from "../../../misc/Search";

const Item = posed.div({
	enter: {opacity: 1},
	exit: {opacity: 0}
});

const useStyles = makeStyles(() => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	progress: {
		backgroundColor: 'transparent',
		flexGrow: 1
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
	const loading = useSelector(state => state.loading[GROUP_LOAD]);
	const {headers, isAdmin} = useSelector(state => state.auth);
	const {sort, searchFilter} = useSelector(state => state.generic);

	const sorts = defaultSorts;
	const [offset, setOffset] = useState(0);
	const [idx, setIdx] = useState(null);

	useEffect(() => {
		getGroupsDispatch(dispatch, headers);
	}, [headers]);

	// hook to rebuild the index when jumps change
	useEffect(() => {
		setIdx(createIndex(searchFields, groups));
	}, [groups]);

	const filterGroup = items => {
		if (searchFilter == null || searchFilter === "")
			return items;
		console.dir(idx.search(searchFilter));
		return idx.search(searchFilter);
	};

	const capitalise = text => {
		if(text == null || text.length === 0) return text;
		if(text.toLowerCase() === "ldap") return "LDAP";
		return text.substring(0, 1).toUpperCase() + text.substring(1, text.length).toLowerCase();
	};
	// get the colour scheme
	const scheme = getAvatarScheme(theme, 2);

	let listItems = [];
	// Tell the loop what our pagination limits are
	let max = (offset + pageSize);
	if (max > groups.length) max = groups.length;
	let sortedGroups = sortItems(groups, sort);
	filterGroup(sortedGroups).forEach((i, index) => {
		if(index < offset || index > max) return;
		const secondary = (<span>
			{capitalise(i.from)}
			{(i.public === true || i.defaultFor != null) &&
			<span>&nbsp;&bull;&nbsp;{i.public === true ? "Public" : `Default for ${i.defaultFor} users`}</span>}
		</span>);
		listItems.push((
			<ListItem button disableRipple key={index} component={'li'}>
				<Avatar component={'div'} style={{backgroundColor: scheme[0], color: scheme[1], marginRight: 12}}>
					<Icon path={mdiAccountGroupOutline} size={1} color={scheme[1]}/>
				</Avatar>
				<ListItemText primary={<span className={classes.title}>{i.name}</span>} secondary={secondary}/>
				{isAdmin && <ListItemSecondaryAction>
					<Tooltip title="Edit group">
						<IconButton centerRipple={false}
						            onClick={() => setDialog(dispatch, MODAL_GROUP_EDIT, true, {group: i})}>
							<Icon path={mdiPencilOutline} size={0.85} color={getIconColour(theme)}/>
						</IconButton>
					</Tooltip>
				</ListItemSecondaryAction>}
			</ListItem>
		));
	});
	return (
		<div>
			<SortedSubheader title="Groups" size={listItems.length} sorts={sorts}
			                 onAdd={() => setDialog(dispatch, MODAL_GROUP_NEW, true)}/>
			{loading === true ? <LinearProgress className={classes.progress} color="primary"/> : ""}
			<PoseGroup animateOnMount={true}>
				<Paper key="root" component={Item} style={{borderRadius: 12, marginBottom: 8}}>
					<List component='ul'>
						{listItems.length > 0 ? listItems : <EmptyCard/>}
					</List>
				</Paper>
			</PoseGroup>
			{listItems.length > pageSize || offset > 0 ?
				<Center>
					<Pagination limit={pageSize} offset={offset} total={sortedGroups.length}
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
