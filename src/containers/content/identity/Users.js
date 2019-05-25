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

import {getUsers, USER_LOAD} from "../../../actions/Users";
import {connect} from "react-redux";
import {LinearProgress, withStyles, withTheme} from "@material-ui/core";
import React from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircleOutlined";
import AdminCircleIcon from "@material-ui/icons/SupervisedUserCircleOutlined";
import Avatar from "@material-ui/core/es/Avatar";
import ReactImageFallback from "react-image-fallback";
import ListItemText from "@material-ui/core/es/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/es/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import SortIcon from "@material-ui/icons/Sort";
import AddIcon from "@material-ui/icons/Add";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import EmptyCard from "../../../components/widget/EmptyCard";
import Center from "react-center";
import Pagination from "material-ui-flat-pagination/lib/Pagination";
import {pageSize} from "../../../constants";

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
			users: []
		};
		this.filterUser = this.filterUser.bind(this);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		// TODO check to see if anything has actually changed...
		if(nextProps.headers !== this.state.headers) {
			// Load jumps from the API
			this.props.getUsers(nextProps.headers);
		}
		this.setState({...nextProps});
	}

	componentDidMount() {
		this.props.getUsers(this.state.headers);
	}
	filterUser(user) {
		return user.username.toLowerCase().includes(this.state.searchFilter);
	}
	static capitalise(text) {
		if(text == null || text.length === 0) return text;
		if(text.toLowerCase() === "ldap") return "LDAP"; // hmm
		return text.substring(0, 1).toUpperCase() + text.substring(1, text.length).toLowerCase();
	}
	render() {
		const {classes, theme} = this.props;
		let listItems = [];
		this.state.users.filter(this.filterUser).forEach((i, index) => {
			let avatar = {
				icon: i.role === 'ADMIN'? <AdminCircleIcon/> : <AccountCircleIcon/>,
				bg: i.role === 'ADMIN' ? theme.palette.error.light : theme.palette.primary.light,
				fg: i.role === 'ADMIN' ? theme.palette.error.dark : theme.palette.primary.dark
			};
			let secondary = <span>{Users.capitalise(i.role)}&nbsp;&bull;&nbsp;{Users.capitalise(i.from)}</span>;
			listItems.push((
				<ListItem button disableRipple key={index}>
					<Avatar component={'div'} style={{backgroundColor: avatar.bg, color: avatar.fg}}>
						<ReactImageFallback style={{borderRadius: 64}} src={i.image} fallbackImage={avatar.icon}/>
					</Avatar>
					<ListItemText primary={<span className={classes.title}>{i.username}</span>} secondary={secondary}/>
				</ListItem>
			));
		});
		// TODO move to component
		const subHeader = (<ListSubheader className={classes.title} inset component={"div"}>
			Users {this.state.searchFilter != null && this.state.searchFilter.length > 0 ? `(${listItems.length} results)` : ''}
			{/*<div className={classes.grow}/>*/}
			<IconButton className={classes.button} aria-label="Sort"><SortIcon fontSize={"small"}/></IconButton>
			<IconButton className={classes.button} aria-label="Add"><AddIcon fontSize={"small"}/></IconButton>
		</ListSubheader>);

		return (
			<div>
				{subHeader}
				{this.state.loading === true ? <LinearProgress className={classes.grow} color={"primary"}/> : "" }
				<Paper style={{borderRadius: 12, marginBottom: 8}}>
					<List>
						{listItems.length > 0 ? listItems : <EmptyCard/>}
					</List>
				</Paper>
				{this.state.users.length > pageSize ?
					<Center><Pagination limit={pageSize} offset={0} total={this.state.users.length} nextPageLabel={"▶"} previousPageLabel={"◀"}/></Center>
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
	headers: state.auth.headers,
	searchFilter: state.generic.searchFilter
});
const mapDispatchToProps = ({
	getUsers,

});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme()(Users)));