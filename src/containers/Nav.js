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

import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircleOutlined";
import {fade} from "@material-ui/core/styles/colorManipulator";
import InputBase from "@material-ui/core/InputBase";
import {IconButton, withStyles} from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import Divider from "@material-ui/core/es/Divider/Divider";
import {doNothing, setFilter} from "../actions/Generic";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import SettingsIcon from "@material-ui/icons/SettingsOutlined";
import Icon from "@mdi/react";
import {mdiAccountGroupOutline, mdiLogin, mdiLogout} from "@mdi/js";

const styles = theme => ({
	root: {width: '100%'},
	grow: {flexGrow: 1},
	title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block'
		},
		fontFamily: "Manrope"
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.primary.light, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.primary.main, 0.25),
		},
		marginRight: theme.spacing.unit * 2,
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing.unit * 3,
			width: 'auto',
		},
	},
	searchIcon: {
		width: theme.spacing.unit * 9,
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'inherit',
		width: '100%',
	},
	inputInput: {
		paddingTop: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
		paddingLeft: theme.spacing.unit * 10,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: 200,
		},
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
});

class Nav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchRoutes: ["/", "/identity"],
			showSearch: true,
			searchFilter: '',
		};
	}
	// Why isn't this called on start?
	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}

	componentWillMount() {
		this.handleLocationChange();
		this.unlisten = this.props.history.listen(() => {
			this.handleLocationChange();
		});
	}

	componentWillUnmount() {
		this.unlisten();
	}

	handleLocationChange() {
		let search = this.state.searchRoutes.includes(window.location.pathname);
		this.setState({showSearch: search});
	}

	handleProfileMenuOpen = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleMenuClose = () => {
		this.setState({ anchorEl: null });
	};

	handleSearchChange = e => {
		let s = e.target.value.toLowerCase();
		this.setState({searchFilter: s});
		this.props.setFilter(s);
	};

	render() {
		const {anchorEl} = this.state;
		const {classes} = this.props;
		const isMenuOpen = Boolean(anchorEl);

		return <div className={classes.root}>
			<AppBar position={"static"} color={"default"}>
				<Toolbar>
					<Typography className={classes.title} variant={"h6"} color={"inherit"}>
						{process.env.REACT_APP_APP_NAME}
					</Typography>
					{/*<Typography className={classes.title} style={{fontWeight: 300}} variant={"h6"} color={"inherit"}>*/}
					{/*	{process.env.REACT_APP_APP_MSG}*/}
					{/*</Typography>*/}
					{this.state.showSearch === true ?
						<div className={classes.search}>
							<div className={classes.searchIcon}>
								<SearchIcon/>
							</div>
							<InputBase placeholder={"Search..."} classes={{root: classes.inputRoot, input: classes.inputInput}} onChange={this.handleSearchChange} value={this.state.searchFilter}/>
						</div>
						:
						<div/>
					}
					<div className={classes.grow}/>
					<div className={classes.sectionDesktop}>
						<IconButton color={"inherit"} onClick={this.handleProfileMenuOpen} aria-haspopup="true" aria-owns={isMenuOpen ? 'material-appbar' : undefined}>
							<AccountCircle/>
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMenuOpen}
				onClose={this.handleMenuClose}>
				<MenuItem disabled={true}>
					<div>
						<span>{this.state.username !== '' ? this.state.username : 'Anonymous'}</span>
					</div>
				</MenuItem>
				<Divider/>
				{window.location.pathname !== "/" ? <MenuItem component={Link} onClick={this.handleMenuClose} to={"/"}><HomeIcon/>Home</MenuItem> : ""}
				{this.state.isLoggedIn === true ?
					<MenuItem component={Link} onClick={this.handleMenuClose} to={"/identity"}><Icon path={mdiAccountGroupOutline} size={1}/>Users &amp; Groups</MenuItem>
					:
					""
				}
				<MenuItem component={Link} onClick={this.handleMenuClose} to={"/settings"}><SettingsIcon/>Settings</MenuItem>
				{this.state.isLoggedIn === false ?
					<MenuItem component={Link} onClick={this.handleMenuClose} to={"/login"}><Icon path={mdiLogin} size={1}/>Login</MenuItem>
					:
					<MenuItem component={Link} onClick={this.handleMenuClose} to={"/logout"}><Icon path={mdiLogout} size={1}/>Logout</MenuItem>
				}
			</Menu>
		</div>
	}
}
const mapStateToProps = state => ({
	isLoggedIn: state.auth.isLoggedIn,
	isAdmin: state.auth.isAdmin,
	username: state.auth.username
});
const mapDispatchToProps = ({
	setFilter
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Nav)));