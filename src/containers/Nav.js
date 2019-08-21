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

import React, {useEffect, useState} from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import {fade} from "@material-ui/core/styles/colorManipulator";
import InputBase from "@material-ui/core/InputBase";
import {IconButton, makeStyles} from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import Divider from "@material-ui/core/es/Divider/Divider";
import {setFilter} from "../actions/Generic";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import SettingsIcon from "@material-ui/icons/SettingsOutlined";
import Icon from "@mdi/react";
import {mdiAccountGroupOutline, mdiHelpCircleOutline, mdiLogin, mdiLogout} from "@mdi/js";
import {Avatar} from "evergreen-ui";
import BackButton from "../components/widget/BackButton";
import getIconColour from "../style/getIconColour";
import {APP_NAME} from "../constants";
import {useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%'
	},
	grow: {
		flexGrow: 1
	},
	brand: {
		paddingRight: 8,
		[theme.breakpoints.up('sm')]: {
			paddingRight: 0
		},
		fontFamily: "Manrope",
		pointerEvents: 'none'
	},
	title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block'
		},
		fontFamily: "Manrope",
		pointerEvents: 'none'
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.primary.light, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.primary.light, 0.35),
			transition: 'background-color 250ms linear',
			webkitTransition: 'background-color 250ms linear',
			msTransition: 'background-color 250ms linear',
		},
		transition: 'background-color 150ms linear',
		webkitTransition: 'background-color 150ms linear',
		msTransition: 'background-color 150ms linear',

		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	},
	searchIcon: {
		width: theme.spacing(9),
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
		paddingTop: theme.spacing(1),
		paddingRight: theme.spacing(1),
		paddingBottom: theme.spacing(1),
		paddingLeft: theme.spacing(10),
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
}));

const Nav = ({searchFilter, isLoggedIn, isAdmin, username, userProfile, history, ...props}) => {
	const searchRoutes = [
		"/",
		"/identity"
	];
	const [showSearch, setShowSearch] = useState(true);
	const [anchorEl, setAnchorEl] = useState(null);

	useEffect(() => {
		setShowSearch(searchRoutes.includes(history.location.pathname));
	}, [history.location.key]);

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleSearchChange = e => {
		let s = e.target.value.toLowerCase();
		props.setFilter(s);
	};

	const classes = useStyles();
	const theme = useTheme();
	const isMenuOpen = anchorEl != null;

	let name = userProfile['displayName'];
	if(name === "") name = username;
	let name2 = name;
	if (name != null)
		name2 = name.replace(".", " ");
	const url = window.location.pathname + window.location.search;
	let loginUrl = '/login';
	if(url !== '')
		loginUrl = `/login?target=${url}`;

	return (
		<div className={classes.root}>
			<AppBar position={"static"} color={"default"}>
				<Toolbar>
					{window.location.pathname !== "/" ? <BackButton label={""} to={"/"}/> : ""}
					<Typography className={classes.brand} variant={"h6"} color={"inherit"}>
						{APP_NAME}
					</Typography>
					<Typography className={classes.title} style={{fontWeight: 300}} variant={"h6"} color={"inherit"}>
						{process.env.REACT_APP_APP_MSG}
					</Typography>
					{showSearch === true ?
						<div className={classes.search}>
							<div className={classes.searchIcon}>
								<SearchIcon/>
							</div>
							<InputBase placeholder={"Search..."} classes={{root: classes.inputRoot, input: classes.inputInput}} onChange={(e) => handleSearchChange(e)} value={searchFilter}/>
						</div>
						:
						<div/>
					}
					<div className={classes.grow}/>
					<div className={classes.sectionDesktop}>
						<IconButton component={Link} centerRipple={false} color={"inherit"} to={"/help"}>
							<Icon path={mdiHelpCircleOutline} size={1} color={getIconColour(theme)}/>
						</IconButton>
					</div>
					<Avatar name={name2} src={userProfile['avatarUrl']} size={40} style={{marginTop: 4}} onClick={(e) => setAnchorEl(e.currentTarget)} aria-haspopup="true" aria-owns={isMenuOpen ? 'material-appbar' : undefined}/>
				</Toolbar>
			</AppBar>
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMenuOpen}
				onClose={() => handleMenuClose()}>
				<MenuItem disabled={true} button={false} component={'div'}>
					<div>
						<span>{name != null && name !== '' ? name : 'Anonymous'}</span>
					</div>
				</MenuItem>
				<Divider/>
				{window.location.pathname !== "/" ? <MenuItem component={Link} onClick={() => handleMenuClose()} to={"/"} button={true}><HomeIcon/>Home</MenuItem> : ""}
				{isLoggedIn === true ?
					<MenuItem component={Link} onClick={() => handleMenuClose()} to={"/identity"} button={true}>
						<Icon path={mdiAccountGroupOutline} size={1} color={getIconColour(theme)}/>
						Users &amp; Groups
					</MenuItem>
					:
					""
				}
				<MenuItem component={Link} onClick={() => handleMenuClose()} to={"/settings"} button={true}><SettingsIcon/>Settings</MenuItem>
				{isLoggedIn === false ?
					<MenuItem component={Link} onClick={() => handleMenuClose()} to={loginUrl} button={true}>
						<Icon path={mdiLogin} size={1} color={getIconColour(theme)}/>
						Login
					</MenuItem>
					:
					<MenuItem component={Link} onClick={() => handleMenuClose()} to={'/logout'} button={true}>
						<Icon path={mdiLogout} size={1} color={getIconColour(theme)}/>
						Logout
					</MenuItem>
				}
			</Menu>
		</div>
	);
};
const mapStateToProps = state => ({
	isLoggedIn: state.auth.isLoggedIn,
	isAdmin: state.auth.isAdmin,
	username: state.auth.username,
	userProfile: state.auth.userProfile,
	searchFilter: state.generic.searchFilter
});
const mapDispatchToProps = ({
	setFilter
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(Nav));
