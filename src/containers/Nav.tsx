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

import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import {fade} from "@material-ui/core/styles/colorManipulator";
import {Avatar, IconButton, makeStyles, Popover, Theme, Toolbar, Typography, useMediaQuery} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {Link, useHistory, useLocation} from "react-router-dom";
import Icon from "@mdi/react";
import {mdiArrowLeft, mdiHelpCircleOutline, mdiMagnify, mdiPlus} from "@mdi/js";
import {useTheme} from "@material-ui/core/styles";
import {DwellInputBase, GenericIconButton} from "jmp-coreui";
import {APP_MSG, APP_NAME, APP_NOUN} from "../constants";
import {TState} from "../store/reducers";
import {AuthState} from "../store/reducers/auth";
import {UsersState} from "../store/reducers/users";
import HintTooltip from "../components/widget/HintTooltip";
import {GenericState} from "../store/reducers/generic";
import {setGenericSearch} from "../store/actions/Generic";
import {MODAL_JUMP_NEW, setDialog} from "../store/actions/Modal";
import useAuth from "../hooks/useAuth";
import UserAvatar from "../components/identity/UserAvatar";
import UserMenu from "./content/identity/profile/UserMenu";

const bgTransition = (time: number | string): string => `background-color ${time}ms linear`;

const useStyles = makeStyles((theme: Theme) => ({
	main: {
		pointerEvents: "auto",
		position: "fixed",
		left: 0,
		right: 0,
		top: 0
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
	searchBack: {
		pointerEvents: "initial"
	},
	searchRoot: {
		zIndex: theme.zIndex.appBar,
		position: "fixed",
		left: 0,
		right: 0,
		top: 0,
		padding: theme.spacing(1.25),
		display: "flex",
		justifyContent: "center",
		pointerEvents: "none",
		height: 48
	},
	search: {
		position: "relative",
		borderRadius: theme.spacing(1),
		color: theme.palette.text.primary,
		backgroundColor: fade(theme.palette.type === "light" ? "#f1f3f4" : "#1c1e1f", 1.0),
		"&:focus-within": {
			backgroundColor: fade(theme.palette.background.paper, 1.0),
			transition: bgTransition(250),
			webkitTransition: bgTransition(250),
			msTransition: bgTransition(250),
			boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08)"
		},
		transition: bgTransition(150),
		webkitTransition: bgTransition(150),
		msTransition: bgTransition(150),

		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(3),
			width: "auto"
		},
		pointerEvents: "initial"
	},
	searchIcon: {
		width: theme.spacing(9),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	inputRoot: {
		color: "inherit",
		width: "100%",
		height: "100%"
	},
	inputInput: {
		paddingTop: theme.spacing(1),
		paddingRight: theme.spacing(1),
		paddingBottom: theme.spacing(1),
		paddingLeft: theme.spacing(10),
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: 200
		}
	},
	sectionDesktop: {
		marginRight: theme.spacing(1),
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

const SEARCH_ROUTES = [
	"/identify",
	"/"
];

const Nav: React.FC<NavProps> = ({loading = false}: NavProps): JSX.Element => {
	// hooks
	const history = useHistory();
	const location = useLocation();
	const dispatch = useDispatch();
	const classes = useStyles();
	const theme = useTheme();
	const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
	const {isLoggedIn} = useAuth();

	// global state
	const {userProfile} = useSelector<TState, AuthState>(state => state.auth);
	const {search} = useSelector<TState, UsersState>(state => state.users);
	const {gridWidth} = useSelector<TState, GenericState>(state => state.generic);

	// local state
	const [showSearch, setShowSearch] = useState<boolean>(true);
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [loginUrl, setLoginUrl] = useState("/login");
	const [localSearch, setLocalSearch] = useState<string>(search);
	const [overrideSearch, setOverrideSearch] = useState<boolean>(false);
	const displayName = useMemo(() => userProfile?.displayName || userProfile?.username || "Anonymous", [userProfile]);

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

		setShowSearch(SEARCH_ROUTES.includes(location.pathname));
		const url = location.pathname + location.search;
		if (url !== "")
			setLoginUrl(`/login?target=${url}`);
	}, [location.pathname, location.search]);

	const handleMenuClose = (): void => {
		setAnchorEl(null);
	};

	const handleSearchChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
		const s = e.target.value.toLowerCase();
		setLocalSearch(s);
	};

	const onHome = (): void => history.push("/");

	return (
		<div>
			<>
				<Toolbar className={classes.main}>
					{!overrideSearch && <>
						<HintTooltip
							title="Click to return home."
							open={location.pathname !== "/" && idle === 1}>
							<Avatar
								className={classes.avatar}
								src={`${process.env.PUBLIC_URL}/favicon.png`}
								alt={`${APP_NAME} logo`}
								onClick={onHome}
							/>
						</HintTooltip>
						<Typography className={classes.brand} variant="h6" color="textPrimary">
							{APP_NAME}
						</Typography>
						<Typography className={classes.title} style={{fontWeight: 300}} variant="h6" color="secondary">
							{APP_MSG}
						</Typography>
						<div className={classes.grow}/>
						<>
							{smallScreen && <GenericIconButton
								title="Search"
								icon={mdiMagnify}
								colour={theme.palette.text.secondary}
								disabled={loading}
								size="small"
								onClick={() => setOverrideSearch(true)}
							/>}
							{location.pathname === "/" && <GenericIconButton
								title={isLoggedIn ? `New ${APP_NOUN}` : `Login to create ${APP_NOUN}s`}
								colour={theme.palette.text.secondary}
								icon={mdiPlus}
								size="small"
								disabled={loading || !isLoggedIn}
								onClick={
									() => dispatch(setDialog(
										MODAL_JUMP_NEW,
										true,
										null
									))
								}
							/>}
							<div className={classes.sectionDesktop}>
								{location.pathname !== "/help" && <HintTooltip open={idle === 2} title="Need a hand?">
									<IconButton
										style={{margin: 8}}
										disabled={loading}
										component={Link}
										centerRipple={false}
										size="small"
										color="inherit"
										to="/help">
										<Icon
											path={mdiHelpCircleOutline}
											size={1}
											color={theme.palette.text.secondary}
										/>
									</IconButton>
								</HintTooltip>}
							</div>
							<UserAvatar
								text={displayName}
								src={userProfile?.avatarUrl}
								setAnchorEl={setAnchorEl}
							/>
						</>
					</>}
				</Toolbar>
				<div
					className={classes.searchRoot}>
					{smallScreen && overrideSearch && <GenericIconButton
						className={classes.searchBack}
						title="Back"
						icon={mdiArrowLeft}
						colour={theme.palette.text.secondary}
						onClick={() => setOverrideSearch(false)}
					/>}
					{(showSearch && (!smallScreen || overrideSearch)) && <div
						className={classes.search}
						style={{width: gridWidth}}>
						<div className={classes.searchIcon}>
							<Icon path={mdiMagnify} color={theme.palette.text.secondary} size={1}/>
						</div>
						<DwellInputBase
							inputProps={{
								placeholder: "Search...",
								classes: {root: classes.inputRoot, input: classes.inputInput},
								onChange: handleSearchChange,
								value: localSearch
							}}
							onDwell={() => dispatch(setGenericSearch(localSearch))}
						/>
					</div>}
				</div>
			</>
			<Popover
				anchorEl={anchorEl}
				anchorOrigin={{vertical: "top", horizontal: "right"}}
				transformOrigin={{vertical: "top", horizontal: "right"}}
				open={anchorEl != null && !loading}
				onClose={handleMenuClose}>
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
