import React, {useLayoutEffect} from 'react';
import Content from "./Content";
import Nav from "./Nav";
import AdminPanel from "../components/AdminPanel";
import {makeStyles} from "@material-ui/core";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {OAUTH_VERIFY, oauthVerify} from "../actions/Auth";
import {withRouter} from "react-router";

const useStyles = makeStyles(theme => ({
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

export const Body = ({history}) => {
	// hooks
	const loading = useSelector(state => state.loading[OAUTH_VERIFY]);
	const {headers, refresh} = useSelector(state => state.auth);
	const dispatch = useDispatch();

	useLayoutEffect(() => {
		oauthVerify(dispatch, refresh, headers);
	}, [history.location.key]);

	const classes = useStyles();
	return (
		<div className={classes.main}>
			<div className={classes.root}>
				<div className={classes.hero}>
					<div className={classes.hero2}>
						<Nav loading={loading}/>
						{loading === false &&
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
Body.propTypes = {
	history: PropTypes.any.isRequired,
};
export default withRouter(Body);
