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

import {getUsers, PATCH_USER_ROLE, patchUserRole, subscribeChangesInUsers, USER_LOAD} from "../../../actions/Users";
import {connect} from "react-redux";
import {LinearProgress, ListItemSecondaryAction, Menu, withStyles, withTheme} from "@material-ui/core";
import React from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircleOutlined";
import AdminCircleIcon from "@material-ui/icons/SupervisedUserCircleOutlined";
import Avatar from "@material-ui/core/es/Avatar";
import ReactImageFallback from "react-image-fallback";
import ListItemText from "@material-ui/core/es/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/es/ListSubheader";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import EmptyCard from "../../../components/widget/EmptyCard";
import Center from "react-center";
import Pagination from "material-ui-flat-pagination/lib/Pagination";
import {LS_SORT, pageSize} from "../../../constants";
import posed, {PoseGroup} from "react-pose";
import {sortItems} from "../../../misc/Sort";
import SortButton from "../../../components/widget/SortButton";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@mdi/react";
import {mdiDotsVertical} from "@mdi/js";
import MenuItem from "@material-ui/core/MenuItem";
import {Badge} from "evergreen-ui";
import GroupModDialog from "../../modal/GroupModDialog";

const Item = posed.div({
	enter: {opacity: 1},
	exit: {opacity: 0}
});

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	button: {
		// margin: theme.spacing.unit,
	},
	grow: {flexGrow: 1}
});

class Users extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			users: props.users,
			offset: 0,
			headers: props.headers,
			searchFilter: props.searchFilter,
			sort: localStorage.getItem(LS_SORT),
			sorts: [
				{id: 'name', value: "Name"},
				{id: '-name', value: "Name Desc"},
				{id: 'creation', value: "Creation"},
				{id: 'updated', value: "Last edited"}
			],
			isAdmin: props.isAdmin,
			isLoggedIn: props.isLoggedIn,
			// Used by the 'Modify groups' dialog
			showModDialog: false,
			modifyUser: null
		};
		this.filterUser = this.filterUser.bind(this);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if(nextProps.headers !== this.state.headers || nextProps.ready !== this.state.ready) {
			// Load jumps from the API
			this.props.getUsers(nextProps.headers);
		}
		this.setState({...nextProps});
	}

	componentDidMount() {
		this.props.getUsers(this.state.headers);
		this.props.subscribeChangesInUsers(this.state.headers);
	}
	toggleExpansion(e, id) {
		let val = id;
		const {users} = this.state;
		users.forEach(i => {
			if(i.id !== val) {
				i.expanded = false;
				return;
			}
			if(i.expanded == null) i.expanded = true;
			else i.expanded = i.expanded !== true;
			i.anchorEl = e.currentTarget;
		});
		this.setState({...users});
	}
	filterUser(user) {
		return user.username.toLowerCase().includes(this.state.searchFilter) ||
			user.role.toLowerCase() === this.state.searchFilter.toLowerCase() ||
			user.from.toLowerCase() === this.state.searchFilter.toLowerCase();
	}
	handlePatchUser(e, user, role) {
		this.props.patchUserRole(this.state.headers, JSON.stringify({
			id: user.id,
			role: role
		}));
	}
	handlePageChange(offset) {
		this.setState({offset: offset});
	}
	handleSortChange(e, value) {
		this.setState({sort: value});
		localStorage.setItem(LS_SORT, value);
		this.props.getUsers(this.state.headers);
	}
	handleModDialog(e, visible, item) {
		this.setState({showModDialog: visible, modifyUser: item});
	}
	handleModUser() {
		if(this.state.modifyUser == null) {
			console.log("No user to modify");
			return;
		}
		// TODO modify user groups
	}
	static capitalise(text) {
		if(text == null || text.length === 0) return text;
		if(text.toLowerCase() === "ldap") return "LDAP"; // hmm
		return text.substring(0, 1).toUpperCase() + text.substring(1, text.length).toLowerCase();
	}
	render() {
		const {classes, theme} = this.props;
		let listItems = [];
		// Tell the loop what our pagination limits are
		let max = (this.state.offset + pageSize);
		if(max > this.state.users.length) max = this.state.users.length;
		let sortedUsers = sortItems(this.state.users, this.state.sort);
		sortedUsers.filter(this.filterUser).forEach((i, index) => {
			if(index < this.state.offset || index > max) return;
			const isAdmin = i.role === 'ADMIN';
			let avatar = {
				icon: isAdmin ? <AdminCircleIcon/> : <AccountCircleIcon/>,
				bg: isAdmin ? theme.palette.error.light : theme.palette.primary.light,
				fg: isAdmin ? theme.palette.error.dark : theme.palette.primary.dark,
				banner: isAdmin ? <Badge color="red">Admin</Badge> : ""
			};
			let secondary = <span>{Users.capitalise(i.from)}&nbsp;{avatar.banner}</span>;
			listItems.push((
				<ListItem button disableRipple key={index} component={'li'}>
					<Avatar component={'div'} style={{backgroundColor: avatar.bg, color: avatar.fg, marginRight: 12}}>
						<ReactImageFallback style={{borderRadius: 64}} src={i.image} fallbackImage={avatar.icon}/>
					</Avatar>
					<ListItemText primary={<span className={classes.title}>{i.username}</span>} secondary={secondary}/>
					{this.state.isAdmin === true ? <ListItemSecondaryAction>
						<IconButton centerRipple={false} onClick={(e) => this.toggleExpansion(e, i.id)}>
							<Icon path={mdiDotsVertical} size={1}/>
							<Menu id={"user-menu"} open={i.expanded === true} anchorEl={i.anchorEl} anchorOrigin={{horizontal: "left", vertical: "top"}} onExit={() => {i.expanded = false}}>
								{i.role !== 'ADMIN' ? <MenuItem button={true} component={'li'} onClick={(e) => {this.handlePatchUser(e, i, 'ADMIN')}}>Promote to admin</MenuItem> : ""}
								{i.role === 'ADMIN' && i.username !== "admin" ?
									<MenuItem button={true} component={'li'} onClick={(e) => {this.handlePatchUser(e, i, 'USER')}}>
										Demote to user
									</MenuItem>
									:
									""
								}
								<MenuItem button={true} component={'li'} onClick={(e) => {this.handleModDialog(e, true, i)}}>Modify groups</MenuItem>
								{i.username !== "admin" && i.from.toLowerCase() === 'local' ? <MenuItem button={true} component={'li'}>Delete</MenuItem> : ""}
							</Menu>
						</IconButton>
					</ListItemSecondaryAction> : ""}
				</ListItem>
			));
		});
		// TODO move to component
		const subHeader = (<ListSubheader className={classes.title} inset component={"div"}>
			Users {this.state.searchFilter != null && this.state.searchFilter.length > 0 ? `(${listItems.length} results)` : ''}
			{/*<div className={classes.grow}/>*/}
			<SortButton selectedSort={this.state.sort} sorts={this.state.sorts} onSubmit={(e, value) => this.handleSortChange(e, value)}/>
			{/*<IconButton className={classes.button} aria-label="Add"><AddIcon fontSize={"small"}/></IconButton>*/}
		</ListSubheader>);

		return (
			<div>
				{subHeader}
				{this.state.loading === true || this.state.loadingPatch === true ? <LinearProgress className={classes.grow} color={"primary"}/> : "" }
				<PoseGroup animateOnMount={true}>
					<Paper key={"root"} component={Item} style={{borderRadius: 12, marginBottom: 8}}>
						<List component={'ul'}>
							{listItems.length > 0 ? listItems : <EmptyCard/>}
						</List>
						<GroupModDialog user={this.state.modifyUser} open={this.state.showModDialog} onExited={(e) => {this.handleModDialog(e, false, null)}} onSubmit={this.handleModUser.bind(this)}/>
					</Paper>
				</PoseGroup>
				{listItems.length > pageSize ?
					<Center>
						<Pagination limit={pageSize} offset={this.state.offset} total={sortedUsers.length}
	                        nextPageLabel={"▶"} previousPageLabel={"◀"} onClick={(e, offset) => this.handlePageChange(offset)}/>
					</Center>
					:
					<div/>
				}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	users: state.users.users || [],
	loading: state.loading[USER_LOAD],
	loadingPatch: state.loading[PATCH_USER_ROLE],
	headers: state.auth.headers,
	ready: state.auth.ready || false,
	searchFilter: state.generic.searchFilter,
	isAdmin: state.auth.isAdmin,
	isLoggedIn: state.auth.isLoggedIn
});
const mapDispatchToProps = ({
	getUsers,
	subscribeChangesInUsers,
	patchUserRole

});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(Users)));
