import React, {useLayoutEffect} from 'react';
import Content from "./Content";
import Nav from "./Nav";
import AdminPanel from "../components/AdminPanel";
import {makeStyles, Theme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {OAUTH_VERIFY, oauthVerify} from "../store/actions/auth/AuthVerify";
import {TState} from "../store/reducers";
import {AuthState} from "../store/reducers/auth";

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
	}
}));

export const Body: React.FC<RouteComponentProps> = ({history}) => {
	// hooks
	const dispatch = useDispatch();
	// @ts-ignore
	const loading = useSelector<TState, boolean>(state => state.loading[OAUTH_VERIFY] ?? false);
	const {headers, refresh} = useSelector<TState, AuthState>(state => state.auth);

	useLayoutEffect(() => {
		oauthVerify(dispatch, refresh || "", headers);
	}, [history.location.key]);

	const classes = useStyles();
	return (
		<div className={classes.main}>
			<div className={classes.root}>
				<div className={classes.hero}>
					<div className={classes.hero2}>
						<Nav loading={loading}/>
						{!loading &&
						<>
							<Content/>
							<AdminPanel/>
						</>
						}
					</div>
				</div>
			</div>
		</div>
	);
};
export default withRouter(Body);
