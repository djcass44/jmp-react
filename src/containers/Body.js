import React, {useLayoutEffect} from 'react';
import Content from "../containers/Content";
import Nav from "../containers/Nav";
import {OAUTH_VERIFY, oauthRequest, oauthVerify} from "../actions/Auth";
import {connect} from "react-redux";
import AdminPanel from "../components/AdminPanel";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import {makeStyles} from "@material-ui/core";

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

const Body = ({refresh, headers, history, loading, ...props}) => {

	useLayoutEffect(() => {
		props.oauthVerify(refresh, headers);
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
	headers: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	loading: state.loading[OAUTH_VERIFY],
	headers: state.auth.headers,
	refresh: state.auth.refresh,
});
const mapDispatchToProps = ({
	oauthVerify,
	oauthRequest,
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(Body));