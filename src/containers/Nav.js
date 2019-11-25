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
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import {fade} from "@material-ui/core/styles/colorManipulator";
import InputBase from "@material-ui/core/InputBase";
import {IconButton, LinearProgress, makeStyles} from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {useDispatch, useSelector} from "react-redux";
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
import {APP_MSG, APP_NAME} from "../constants";
import {useTheme} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import UserPopover from "../components/widget/UserPopover";

const bgTransition = time => `background-color ${time}ms linear`;

const useStyles = makeStyles(theme => ({
	root: {
		position: "fixed",
		width: "100%",
		height: "100%",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "transparent",
		pointerEvents: "none"
	},
	main: {
		pointerEvents: "auto"
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
		color: theme.palette.text.primary,
		backgroundColor: fade(theme.palette.search, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.search, 0.35),
			transition: bgTransition(250),
			webkitTransition: bgTransition(250),
			msTransition: bgTransition(250),
		},
		transition: bgTransition(150),
		webkitTransition: bgTransition(150),
		msTransition: bgTransition(150),

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
	helpButton: {
		[theme.breakpoints.up("md")]: {
			display: "none"
		}
	},
	progress: {
		backgroundColor: 'transparent'
	},
	menuIcon: {
		paddingRight: theme.spacing(1)
	}
}));

const Nav = ({loading, history}) => {
	const searchRoutes = [
		"/identity"
	];
	// hooks
	const {isLoggedIn, userProfile} = useSelector(state => state.auth);
	const {searchFilter} = useSelector(state => state.generic);
	const {location} = history;
	const dispatch = useDispatch();

	const [showSearch, setShowSearch] = useState(true);
	const [anchorEl, setAnchorEl] = useState(null);

	useEffect(() => {
		setShowSearch(searchRoutes.includes(location.pathname));
	}, [location.key, searchRoutes]);

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleSearchChange = e => {
		let s = e.target.value.toLowerCase();
		setFilter(dispatch, s);
	};

	const classes = useStyles();
	const theme = useTheme();
	const isMenuOpen = anchorEl != null;

	let name = userProfile['displayName'];
	if (name == null || name === "") name = userProfile.username || "Anonymous";
	const name2 = name.replace(".", " ");
	const url = location.pathname + location.search;
	let loginUrl = '/login';
	if(url !== '')
		loginUrl = `/login?target=${url}`;

	return (
		<div className={classes.root}>
			<>
				<Toolbar className={classes.main}>
					{location.pathname !== "/" && loading === false ? <BackButton label={""} to={"/"}/> : ""}
					<Typography className={classes.brand} variant={"h6"} color={"primary"}>
						{APP_NAME}
					</Typography>
					<Typography className={classes.title} style={{fontWeight: 300}} variant={"h6"} color={"secondary"}>
						{APP_MSG}
					</Typography>
					{showSearch === true && loading !== true ?
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
					{loading === false &&
						<>
							<div className={classes.sectionDesktop}>
								{location.pathname !== "/help" &&
								<IconButton style={{margin: 8}} component={Link} centerRipple={false} color={"inherit"}
								            to={"/help"}>
									<Icon path={mdiHelpCircleOutline} size={1} color={getIconColour(theme)}/>
								</IconButton>}
							</div>
							<Avatar name={name2} src={userProfile['avatarUrl']} size={40} style={{marginTop: 4}} onClick={(e) => setAnchorEl(e.currentTarget)} aria-haspopup="true" aria-owns={isMenuOpen ? 'material-appbar' : undefined}/>
						</>
					}
				</Toolbar>
				{loading === true && <LinearProgress className={classes.progress} />}
			</>
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMenuOpen}
				onClose={() => handleMenuClose()}>
				<MenuItem button={false} component={"div"}>
					<UserPopover user={userProfile} elevation={0}/>
				</MenuItem>
				<Divider/>
				{location.pathname !== "/" &&
				<MenuItem component={Link} onClick={() => handleMenuClose()} to={"/"} button={true}>
					<HomeIcon className={classes.menuIcon}/>
					Home
				</MenuItem>}
				{location.pathname !== "/help" &&
				<MenuItem className={classes.helpButton} component={Link} onClick={() => handleMenuClose()} to={"/help"}
				          button={true}>
					<Icon className={classes.menuIcon} path={mdiHelpCircleOutline} size={1}
					      color={getIconColour(theme)}/>
					Help
				</MenuItem>}
				{isLoggedIn === true &&
					<MenuItem component={Link} onClick={() => handleMenuClose()} to={"/identity"} button={true}>
						<Icon className={classes.menuIcon} path={mdiAccountGroupOutline} size={1}
						      color={getIconColour(theme)}/>
						Users &amp; Groups
					</MenuItem>
				}
				<MenuItem component={Link} onClick={() => handleMenuClose()} to={"/settings"} button={true}>
					<SettingsIcon className={classes.menuIcon}/>
					Settings
				</MenuItem>
				{isLoggedIn === false ?
					<MenuItem component={Link} onClick={() => handleMenuClose()} to={loginUrl} button={true}>
						<Icon className={classes.menuIcon} path={mdiLogin} size={1} color={getIconColour(theme)}/>
						Login
					</MenuItem>
					:
					<MenuItem component={Link} onClick={() => handleMenuClose()} to={'/logout'} button={true}>
						<Icon className={classes.menuIcon} path={mdiLogout} size={1} color={getIconColour(theme)}/>
						Logout
					</MenuItem>
				}
			</Menu>
		</div>
	);
};
Nav.propTypes = {
	loading: PropTypes.bool,
	history: PropTypes.object.isRequired
};
Nav.defaultProps = {
	loading: false
};
export default withRouter(Nav);
