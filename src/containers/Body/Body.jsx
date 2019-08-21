import React, {useLayoutEffect} from 'react';
import Content from "../Content";
import Nav from "../Nav";
import AdminPanel from "../../components/AdminPanel";
import {makeStyles} from "@material-ui/core";
import PropTypes from "prop-types";

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

export const Body = ({refresh, headers, history, loading, oauthVerify}) => {
	useLayoutEffect(() => {
		oauthVerify(refresh, headers);
	}, [history.location.key]);

	const classes = useStyles();
	return (
		<div className={classes.main}>
			<div className={classes.root}>
				<div className={classes.hero}>
					<div className={classes.hero2}>
						<Nav loading={loading}/>
						{loading === false ?
							<>
								<Content/>
								<AdminPanel/>
							</>
							:
							""
						}
					</div>
				</div>
			</div>
		</div>
	);
};
Body.propTypes = {
	loading: PropTypes.bool,
	headers: PropTypes.object.isRequired,
	refresh: PropTypes.string.isRequired,
	history: PropTypes.any.isRequired,
	oauthVerify: PropTypes.func.isRequired
};
Body.defaultProps = {
	loading: false
};