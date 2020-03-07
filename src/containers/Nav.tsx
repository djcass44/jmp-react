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
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import {fade} from "@material-ui/core/styles/colorManipulator";
import {IconButton, LinearProgress, makeStyles, Popover, Theme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {mdiHelpCircleOutline} from "@mdi/js";
import {Avatar} from "evergreen-ui";
import BackButton from "../components/widget/BackButton";
import getIconColour from "../style/getIconColour";
import {APP_MSG, APP_NAME} from "../constants";
import {useTheme} from "@material-ui/core/styles";
import UserMenu from "./content/identity/profile/UserMenu";
import {TState} from "../store/reducers";
import {AuthState} from "../store/reducers/auth";
import {useLocation} from "react-router";
import {setUserSearch} from "../store/actions/users";
import DwellInputBase from "../components/widget/DwellInputBase";

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
		// @ts-ignore
		backgroundColor: fade(theme.palette.search, 0.15),
		'&:hover': {
			// @ts-ignore
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
	progress: {
		backgroundColor: 'transparent'
	},
	menuIcon: {
		paddingRight: theme.spacing(1)
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
	const location = useLocation();
	const dispatch = useDispatch();
	const classes = useStyles();
	const theme = useTheme();

	// global state
	const {userProfile} = useSelector<TState, AuthState>(state => state.auth);
	// @ts-ignore
	const {search} = useSelector(state => state.users);

	// component state
	const [showSearch, setShowSearch] = useState<boolean>(true);
	const [anchorEl, setAnchorEl] = useState(null);
	const [loginUrl, setLoginUrl] = useState("/login");
	const [localSearch, setLocalSearch] = useState<string>(search);

	useEffect(() => {
		setShowSearch(searchRoutes.includes(location.pathname));
		const url = location.pathname + location.search;
		if (url !== '')
			setLoginUrl(`/login?target=${url}`);
	}, [location.key, searchRoutes]);

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
					{location.pathname !== "/" && loading === false ? <BackButton label={""} to={"/"}/> : ""}
					<Typography className={classes.brand} variant={"h6"} color={"primary"}>
						{APP_NAME}
					</Typography>
					<Typography className={classes.title} style={{fontWeight: 300}} variant={"h6"} color={"secondary"}>
						{APP_MSG}
					</Typography>
					{(showSearch && loading !== true) && <div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon/>
						</div>
						<DwellInputBase
							inputProps={{
								placeholder: "Search...",
								classes: {root: classes.inputRoot, input: classes.inputInput},
								onChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => handleSearchChange(e),
								value: localSearch,
							}}
							onDwell={() => setUserSearch(dispatch, localSearch)}
						/>
					</div>}
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
						<Avatar
							name={userProfile?.displayName || userProfile?.username || "Anonymous"}
							src={userProfile?.avatarUrl || undefined}
							size={40}
							style={{marginTop: 4}}
							onClick={(e: any) => setAnchorEl(e.currentTarget)}
							aria-haspopup="true"
							aria-owns={anchorEl != null ? 'material-appbar' : undefined}
						/>
					</>
					}
				</Toolbar>
				{loading === true && <LinearProgress className={classes.progress}/>}
			</>
			<Popover
				anchorEl={anchorEl}
				anchorOrigin={{vertical: 'top', horizontal: 'right'}}
				transformOrigin={{vertical: 'top', horizontal: 'right'}}
				open={anchorEl != null}
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
