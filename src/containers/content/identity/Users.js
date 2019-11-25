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

import {getUsersDispatch, PATCH_USER_ROLE, patchUserRole, USER_LOAD} from "../../../actions/Users";
import {useDispatch, useSelector} from "react-redux";
import {
	Avatar,
	CircularProgress,
	LinearProgress,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	makeStyles,
	Menu,
	MenuItem,
	Paper
} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircleOutlined";
import AdminCircleIcon from "@material-ui/icons/SupervisedUserCircleOutlined";
import Img from "react-image";
import EmptyCard from "../../../components/widget/EmptyCard";
import Center from "react-center";
import Pagination from "material-ui-flat-pagination/lib/Pagination";
import {pageSize} from "../../../constants";
import posed, {PoseGroup} from "react-pose";
import {defaultSorts, sortItems} from "../../../misc/Sort";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@mdi/react";
import {mdiDotsVertical} from "@mdi/js";
import {Badge} from "evergreen-ui";
import GroupModDialog from "../../modal/GroupModDialog";
import getAvatarScheme from "../../../style/getAvatarScheme";
import getIconColour from "../../../style/getIconColour";
import useTheme from "@material-ui/core/styles/useTheme";
import {MODAL_USER_GROUPS, setDialog} from "../../../actions/Modal";
import SortedSubheader from "../../../components/content/SortedSubheader";

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

export default () => {
	// hooks
	const dispatch = useDispatch();
	const classes = useStyles();
	const theme = useTheme();

	const {users} = useSelector(state => state.users);
	const {headers, isAdmin} = useSelector(state => state.auth);
	const {searchFilter, sort} = useSelector(state => state.generic);
	const loading = useSelector(state => state.loading[USER_LOAD]);
	const loadingPatch = useSelector(state => state.loading[PATCH_USER_ROLE]);

	const sorts = defaultSorts;
	const [expanded, setExpanded] = useState(-1);
	const [anchorEl, setAnchorEl] = useState(null);
	const [offset, setOffset] = useState(0);


	useEffect(() => getUsersDispatch(dispatch, headers), [headers]);

	const toggleExpansion = (e, id) => {
		setExpanded(expanded === id ? -1 : id);
		setAnchorEl(expanded === id ? null : e.currentTarget);
	};

	const filterUser = user => {
		return user.username.toLowerCase().includes(searchFilter) ||
			user.role.toLowerCase() === searchFilter.toLowerCase() ||
			user.from.toLowerCase() === searchFilter.toLowerCase();
	};

	const handlePatchUser = (user, role) => {
		patchUserRole(dispatch, headers, JSON.stringify({
			id: user.id,
			role: role
		}));
	};
	const capitalise = (text) => {
		if(text == null || text.length === 0) return text;
		if(text.toLowerCase() === "ldap") return "LDAP"; // hmm
		return text.substring(0, 1).toUpperCase() + text.substring(1, text.length).toLowerCase();
	};
	// get the colour scheme
	const scheme = getAvatarScheme(theme, 0);
	const schemeAdmin = getAvatarScheme(theme, 3);
	let listItems = [];
	// Tell the loop what our pagination limits are
	let max = (offset + pageSize);
	if(max > users.length) max = users.length;
	sortItems(users, sort);
	const sortedUsers = users.filter(filterUser);
	sortedUsers.forEach((i, index) => {
		if(index < offset || index > max) return;
		const userIsAdmin = i.role === 'ADMIN';
		const avatar = {
			icon: userIsAdmin ? <AdminCircleIcon/> : <AccountCircleIcon/>,
			bg: userIsAdmin ? schemeAdmin[0] : scheme[0],
			fg: userIsAdmin ? schemeAdmin[1] : scheme[1],
			banner: userIsAdmin ? <Badge color="red">Admin</Badge> : ""
		};
		const secondary = (<span>{capitalise(i.from)}&nbsp;{avatar.banner}</span>);
		listItems.push((
			<ListItem button disableRipple key={index} component='li'>
				<Avatar component='div' style={{backgroundColor: avatar.bg, color: avatar.fg, marginRight: 12}}>
					<Img
						src={i.avatarUrl}
						loader={<CircularProgress size={20}/>}
						unloader={avatar.icon}
					/>
				</Avatar>
				<ListItemText primary={<span className={classes.title}>{i.username}</span>} secondary={secondary}/>
				<ListItemSecondaryAction>
					<IconButton centerRipple={false} onClick={(e) => toggleExpansion(e, i.id)}>
						<Icon path={mdiDotsVertical} size={1} color={getIconColour(theme)}/>
						<Menu id={"user-menu"} open={i.id === expanded} anchorEl={anchorEl} anchorOrigin={{horizontal: "left", vertical: "top"}} onExit={() => {i.expanded = false}}>
							{(isAdmin && i.role !== 'ADMIN' && i.username !== "system") &&
							<MenuItem button component='li' onClick={() => handlePatchUser(i, 'ADMIN')}>
								Promote to admin
							</MenuItem>}
							{(isAdmin && i.role === 'ADMIN' && i.username !== "admin") &&
								<MenuItem button component='li' onClick={() => handlePatchUser(i, 'USER')}>
									Demote to user
								</MenuItem>
							}
							<MenuItem button component='li'
							          onClick={() => setDialog(dispatch, MODAL_USER_GROUPS, true, {user: i})}>Modify
								groups</MenuItem>
						</Menu>
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
		));
	});

	return (
		<div>
			<SortedSubheader title="Users" size={listItems.length} sorts={sorts}/>
			{(loading === true || loadingPatch === true) &&
			<LinearProgress className={classes.progress} color="primary"/>
			}
			<PoseGroup animateOnMount={true}>
				<Paper key="root" component={Item} style={{borderRadius: 12, marginBottom: 8}}>
					<List component='ul'>
						{listItems.length > 0 ? listItems : <EmptyCard/>}
					</List>
					<GroupModDialog/>
				</Paper>
			</PoseGroup>
			{listItems.length > pageSize &&
				<Center>
					<Pagination limit={pageSize} offset={offset} total={sortedUsers.length}
					            nextPageLabel="▶" previousPageLabel="◀" onClick={(e, off) => setOffset(off)}/>
				</Center>
			}
		</div>
	);
};
