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

import React, {ChangeEvent, useEffect, useState} from "react";
import {fade} from "@material-ui/core/styles/colorManipulator";
import {Avatar as MuiAvatar, IconButton, makeStyles, Popover, Theme, Toolbar, Typography} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {Link, useHistory} from "react-router-dom";
import Icon from "@mdi/react";
import {mdiHelpCircleOutline, mdiMagnify} from "@mdi/js";
import {Avatar} from "evergreen-ui";
import {useTheme} from "@material-ui/core/styles";
import {useLocation} from "react-router";
import {DwellInputBase} from "jmp-coreui";
import getIconColour from "../style/getIconColour";
import {APP_MSG, APP_NAME} from "../constants";
import {TState} from "../store/reducers";
import {AuthState} from "../store/reducers/auth";
import {setUserSearch} from "../store/actions/users";
import {UsersState} from "../store/reducers/users";
import HintTooltip from "../components/widget/HintTooltip";
import UserMenu from "./content/identity/profile/UserMenu";

const bgTransition = (time: number | string): string => `background-color ${time}ms linear`;

const useStyles = makeStyles((theme: Theme) => ({
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
		[theme.breakpoints.up("sm")]: {
			paddingRight: 0
		},
		fontFamily: "Manrope",
		fontWeight: 500,
		pointerEvents: "none"
	},
	title: {
		display: "none",
		[theme.breakpoints.up("sm")]: {
			display: "block"
		},
		fontFamily: "Manrope",
		pointerEvents: "none"
	},
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		color: theme.palette.text.primary,
		backgroundColor: fade(theme.palette.action.hover, 0.15),
		"&:hover": {
			backgroundColor: fade(theme.palette.action.hover, 0.35),
			transition: bgTransition(250),
			webkitTransition: bgTransition(250),
			msTransition: bgTransition(250)
		},
		transition: bgTransition(150),
		webkitTransition: bgTransition(150),
		msTransition: bgTransition(150),

		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(3),
			width: "auto",
		},
	},
	searchIcon: {
		width: theme.spacing(9),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	inputRoot: {
		color: "inherit",
		width: "100%",
	},
	inputInput: {
		paddingTop: theme.spacing(1),
		paddingRight: theme.spacing(1),
		paddingBottom: theme.spacing(1),
		paddingLeft: theme.spacing(10),
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: 200,
		},
	},
	sectionDesktop: {
		display: "none",
		[theme.breakpoints.up("md")]: {
			display: "flex"
		}
	},
	menuIcon: {
		paddingRight: theme.spacing(1)
	},
	avatar: {
		cursor: "pointer",
		width: 24,
		height: 24,
		borderRadius: 100,
		margin: 12,
		padding: 6,
		backgroundColor: theme.palette.background.default
	}
}));

interface NavProps {
	loading?: boolean;
}

const Nav: React.FC<NavProps> = ({loading = false}) => {
	const searchRoutes = [
		"/identity"
	];
	// hooks
	const history = useHistory();
	const location = useLocation();
	const dispatch = useDispatch();
	const classes = useStyles();
	const theme = useTheme();

	// global state
	const {userProfile} = useSelector<TState, AuthState>(state => state.auth);
	const {search} = useSelector<TState, UsersState>(state => state.users);

	// local state
	const [showSearch, setShowSearch] = useState<boolean>(true);
	const [anchorEl, setAnchorEl] = useState(null);
	const [loginUrl, setLoginUrl] = useState("/login");
	const [localSearch, setLocalSearch] = useState<string>(search);

	const [idle, setIdle] = useState<number>(0);
	const [idleTimer, setIdleTimer] = useState<number | null>(null);

	useEffect(() => {
		setIdle(0);
		if (idleTimer) {
			window.clearInterval(idleTimer);
			setIdleTimer(null);
		}
		window.setInterval(() => {
			if (location.pathname !== "/")
				setIdle(1);
		}, 30000);

		setShowSearch(searchRoutes.includes(location.pathname));
		const url = location.pathname + location.search;
		if (url !== "")
			setLoginUrl(`/login?target=${url}`);
	}, [location.pathname, location.search]);

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleSearchChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		const s = e.target.value.toLowerCase();
		setLocalSearch(s);
	};

	return (
		<div className={classes.root}>
			<>
				<Toolbar className={classes.main}>
					<HintTooltip
						title="Click to return home."
						open={location.pathname !== "/" && idle === 1}>
						<MuiAvatar
							className={classes.avatar}
							src={`${process.env.PUBLIC_URL}/favicon.png`}
							alt={`${APP_NAME} logo`}
							onClick={() => history.push("/")}
						/>
					</HintTooltip>
					<Typography className={classes.brand} variant="h6" color="textPrimary">
						{APP_NAME}
					</Typography>
					<Typography className={classes.title} style={{fontWeight: 300}} variant="h6" color="secondary">
						{APP_MSG}
					</Typography>
					{(showSearch && loading !== true) && <div className={classes.search}>
						<div className={classes.searchIcon}>
							<Icon path={mdiMagnify} color={theme.palette.text.secondary} size={1}/>
						</div>
						<DwellInputBase
							inputProps={{
								placeholder: "Search...",
								classes: {root: classes.inputRoot, input: classes.inputInput},
								onChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => handleSearchChange(e),
								value: localSearch
							}}
							onDwell={() => dispatch(setUserSearch(localSearch))}
						/>
					</div>}
					<div className={classes.grow}/>
					<>
						<div className={classes.sectionDesktop}>
							{location.pathname !== "/help" && <HintTooltip open={idle === 2} title="Need a hand?">
								<IconButton
									style={{margin: 8}}
									disabled={loading}
									component={Link}
									centerRipple={false}
									color="inherit"
									to="/help">
									<Icon path={mdiHelpCircleOutline} size={1} color={getIconColour(theme)}/>
								</IconButton>
							</HintTooltip>}
						</div>
						<Avatar
							name={userProfile?.displayName || userProfile?.username || "Anonymous"}
							src={userProfile?.avatarUrl || undefined}
							size={40}
							style={{marginTop: 4}}
							onClick={(e: any) => setAnchorEl(e.currentTarget)}
							aria-haspopup="true"
							aria-owns={anchorEl != null ? "material-appbar" : undefined}
						/>
					</>
				</Toolbar>
			</>
			<Popover
				anchorEl={anchorEl}
				anchorOrigin={{vertical: "top", horizontal: "right"}}
				transformOrigin={{vertical: "top", horizontal: "right"}}
				open={anchorEl != null && !loading}
				onClose={() => handleMenuClose()}>
				<UserMenu
					user={userProfile}
					loginUrl={loginUrl}
					onClose={handleMenuClose}
				/>
			</Popover>
		</div>
	);
};
export default Nav;
