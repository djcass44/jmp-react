import React, {useEffect, useLayoutEffect, useState} from 'react';
import Content from "./Content";
import Nav from "./Nav";
import AdminPanel from "../components/AdminPanel";
import {Fade, LinearProgress, makeStyles, Theme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {OAUTH_VERIFY, oauthVerify} from "../store/actions/auth/AuthVerify";
import {TState} from "../store/reducers";
import {AuthState} from "../store/reducers/auth";
import {useLocation} from "react-router";
import {GET_JUMP} from "../store/actions/jumps/GetJumps";

const useStyles = makeStyles((theme: Theme) => ({
	main: {
		display: 'flex',
		flexDirection: 'column'
	},
	root: {
		flexGrow: 1,
		flex: '1 0 100%'
	},
	hero: {
		height: '100vh',
		// minHeight: '100vh',
		flex: '0 0 auto',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'top',
		backgroundColor: theme.palette.background.default
	},
	hero2: {
		width: '100%'
	},
	progress: {
		position: "fixed",
		width: "100%",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "transparent",
		pointerEvents: "none",
		zIndex: theme.zIndex.drawer + 2
	},
	progressShade: {
		position: "fixed",
		width: "100%",
		height: "100vh",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: theme.palette.background.default,
		opacity: 0.6,
		pointerEvents: "initial",
		zIndex: theme.zIndex.drawer + 1
	}
}));

export const Body: React.FC = () => {
	// hooks
	const dispatch = useDispatch();
	const location = useLocation();
	// @ts-ignore
	const loading = useSelector<TState, boolean>(state => {
		return (state.loading[OAUTH_VERIFY] || state.loading[GET_JUMP]) ?? false;
	});
	const {headers, refresh} = useSelector<TState, AuthState>(state => state.auth);


	const [timer, setTimer] = useState<any | null>(null);
	const [shade, setShade] = useState<boolean>(false);

	/**
	 * Delay the visibility of the loading shade until we've been loading for >= 150 milliseconds
	 */
	useEffect(() => {
		if (!loading) {
			setShade(false);
			clearTimeout(timer);
		} else
			setTimer(setTimeout(() => setShade(true), 150));
	}, [loading]);

	useLayoutEffect(() => {
		oauthVerify(dispatch, refresh || "", headers);
	}, [location.key]);

	const classes = useStyles();
	return (
		<div className={classes.main}>
			<div className={classes.root}>
				<div className={classes.hero}>
					<div className={classes.hero2}>
						<Nav loading={loading}/>
						<Content/>
						<AdminPanel/>
						<Fade in={shade}>
							<div className={classes.progressShade}/>
						</Fade>
						<Fade in={loading}>
							<LinearProgress className={classes.progress}/>
						</Fade>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Body;
