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

import {getUsers, PATCH_USER_ROLE, patchUserRole, USER_LOAD} from "../../../actions/Users";
import {connect} from "react-redux";
import {
	LinearProgress,
	ListItemSecondaryAction,
	Menu,
	Avatar,
	ListItemText,
	ListItem,
	ListSubheader,
	Paper,
	List,
	MenuItem,
	makeStyles
} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircleOutlined";
import AdminCircleIcon from "@material-ui/icons/SupervisedUserCircleOutlined";
import ReactImageFallback from "react-image-fallback";
import EmptyCard from "../../../components/widget/EmptyCard";
import Center from "react-center";
import Pagination from "material-ui-flat-pagination/lib/Pagination";
import {pageSize} from "../../../constants";
import posed, {PoseGroup} from "react-pose";
import {defaultSorts, sortItems} from "../../../misc/Sort";
import SortButton from "../../../components/widget/SortButton";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@mdi/react";
import {mdiDotsVertical} from "@mdi/js";
import {Badge} from "evergreen-ui";
import GroupModDialog from "../../modal/GroupModDialog";
import getAvatarScheme from "../../../style/getAvatarScheme";
import getIconColour from "../../../style/getIconColour";
import useTheme from "@material-ui/core/styles/useTheme";
import {setUserGroups} from "../../../actions/Modal";

const Item = posed.div({
	enter: {opacity: 1},
	exit: {opacity: 0}
});

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	progress: {
		backgroundColor: theme.palette.background.default,
		flexGrow: 1
	}
}));

const Users = ({users, offset, headers, searchFilter, sort, loading, isAdmin, isLoggedIn, ...props}) => {
	const sorts = defaultSorts;
	const [expanded, setExpanded] = useState(-1);
	const [anchorEl, setAnchorEl] = useState(null);


	useEffect(() => props.getUsers(headers), [headers]);

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
		props.patchUserRole(headers, JSON.stringify({
			id: user.id,
			role: role
		}));
	};
	const handlePageChange = offset => props.setOffset(offset);
	const handleSortChange = value => {
		props.setSort(value);
		props.getGroups(headers);
	};
	const capitalise = (text) => {
		if(text == null || text.length === 0) return text;
		if(text.toLowerCase() === "ldap") return "LDAP"; // hmm
		return text.substring(0, 1).toUpperCase() + text.substring(1, text.length).toLowerCase();
	};
	const classes = useStyles();
	const theme = useTheme();
	// get the colour scheme
	const scheme = getAvatarScheme(theme, 0);
	const schemeAdmin = getAvatarScheme(theme, 3);
	let listItems = [];
	// Tell the loop what our pagination limits are
	let max = (offset + pageSize);
	if(max > users.length) max = users.length;
	let sortedUsers = sortItems(users, sort);
	sortedUsers.filter(filterUser).forEach((i, index) => {
		if(index < offset || index > max) return;
		const isAdmin = i.role === 'ADMIN';
		let avatar = {
			icon: isAdmin ? <AdminCircleIcon/> : <AccountCircleIcon/>,
			bg: isAdmin ? schemeAdmin[0] : scheme[0],
			fg: isAdmin ? schemeAdmin[1] : scheme[1],
			banner: isAdmin ? <Badge color="red">Admin</Badge> : ""
		};
		let secondary = <span>{capitalise(i.from)}&nbsp;{avatar.banner}</span>;
		listItems.push((
			<ListItem button disableRipple key={index} component='li'>
				<Avatar component='div' style={{backgroundColor: avatar.bg, color: avatar.fg, marginRight: 12}}>
					<ReactImageFallback style={{borderRadius: 64}} src={i.image} fallbackImage={avatar.icon}/>
				</Avatar>
				<ListItemText primary={<span className={classes.title}>{i.username}</span>} secondary={secondary}/>
				{isAdmin === true ? <ListItemSecondaryAction>
					<IconButton centerRipple={false} onClick={(e) => toggleExpansion(e, i.id)}>
						<Icon path={mdiDotsVertical} size={1} color={getIconColour(theme)}/>
						<Menu id={"user-menu"} open={i.id === expanded} anchorEl={anchorEl} anchorOrigin={{horizontal: "left", vertical: "top"}} onExit={() => {i.expanded = false}}>
							{i.role !== 'ADMIN' ? <MenuItem button component='li' onClick={() => handlePatchUser(i, 'ADMIN')}>Promote to admin</MenuItem> : ""}
							{i.role === 'ADMIN' && i.username !== "admin" ?
								<MenuItem button component='li' onClick={() => handlePatchUser(i, 'USER')}>
									Demote to user
								</MenuItem>
								:
								""
							}
							<MenuItem button component='li' onClick={() => props.setUserGroups(true, i)}>Modify groups</MenuItem>
							{i.username !== "admin" && i.from.toLowerCase() === 'local' ? <MenuItem button={true} component='li'>Delete</MenuItem> : ""}
						</Menu>
					</IconButton>
				</ListItemSecondaryAction> : ""}
			</ListItem>
		));
	});
	// TODO move to component
	const subHeader = (
		<ListSubheader className={classes.title} inset component={"div"}>
			Users {searchFilter != null && searchFilter.length > 0 ? `(${listItems.length} results)` : ''}
			<SortButton selectedSort={sort} sorts={sorts} onSubmit={(e, value) => handleSortChange(value)}/>
			{/*<IconButton className={classes.button} aria-label="Add"><AddIcon fontSize={"small"}/></IconButton>*/}
		</ListSubheader>
	);

	return (
		<div>
			{subHeader}
			{loading === true || props.loadingPatch === true ? <LinearProgress className={classes.progress} color="primary"/> : "" }
			<PoseGroup animateOnMount={true}>
				<Paper key="root" component={Item} style={{borderRadius: 12, marginBottom: 8}}>
					<List component='ul'>
						{listItems.length > 0 ? listItems : <EmptyCard/>}
					</List>
					<GroupModDialog/>
				</Paper>
			</PoseGroup>
			{listItems.length > pageSize ?
				<Center>
					<Pagination limit={pageSize} offset={offset} total={sortedUsers.length}
					            nextPageLabel="▶" previousPageLabel="◀" onClick={(e, offset) => handlePageChange(offset)}/>
				</Center>
				:
				<div/>
			}
		</div>
	);
};

const mapStateToProps = state => ({
	users: state.users.users,
	loading: state.loading[USER_LOAD],
	loadingPatch: state.loading[PATCH_USER_ROLE],
	headers: state.auth.headers,
	ready: state.auth.ready,
	searchFilter: state.generic.searchFilter,
	isAdmin: state.auth.isAdmin,
	isLoggedIn: state.auth.isLoggedIn
});
const mapDispatchToProps = ({
	getUsers,
	patchUserRole,
	setUserGroups
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Users);
