import React, {useEffect, useLayoutEffect, useState} from "react";
import {Fade, LinearProgress, makeStyles, Theme} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {useLocation} from "react-router-dom";
import AdminPanel from "../components/AdminPanel";
import {OAUTH_VERIFY, oauthVerify} from "../store/actions/auth/AuthVerify";
import {GET_JUMP} from "../store/actions/jumps/GetJumps";
import useAuth from "../hooks/useAuth";
import useLoading from "../hooks/useLoading";
import Nav from "./Nav";
import Content from "./Content";

const useStyles = makeStyles((theme: Theme) => ({
	main: {
		display: "flex",
		flexDirection: "column"
	},
	root: {
		flexGrow: 1,
		flex: "1 0 100%"
	},
	hero: {
		height: "100vh",
		// minHeight: '100vh',
		flex: "0 0 auto",
		display: "flex",
		justifyContent: "center",
		alignItems: "top",
		backgroundColor: theme.palette.background.default
	},
	hero2: {
		width: "100%"
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

export const Body: React.FC = (): JSX.Element => {
	// hooks
	const dispatch = useDispatch();
	const location = useLocation();
	const loading = useLoading([OAUTH_VERIFY, GET_JUMP]);
	const {headers, refresh} = useAuth();


	// local state
	const [timer, setTimer] = useState<number | null>(null);
	const [shade, setShade] = useState<boolean>(false);

	/**
	 * Delay the visibility of the loading shade until we've been loading for >= 150 milliseconds
	 */
	useEffect(() => {
		if (!loading) {
			setShade(false);
			if (timer)
				window.clearTimeout(timer);
		} else {
			setTimer(window.setTimeout(() => setShade(true), 300));
		}
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
						{/*<Banners/>*/}
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
