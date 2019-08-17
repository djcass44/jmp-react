import React from 'react';
import Content from "../containers/Content";
import Nav from "../containers/Nav";
import {OAUTH_VERIFY, oauthRequest, oauthUnready, oauthVerify} from "../actions/Auth";
import {connect} from "react-redux";
import AdminPanel from "../components/AdminPanel";
import PropTypes from "prop-types";
import NavLoading from "../components/NavLoading";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core";

const styles = theme => ({
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
});

class Body extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			refresh: props.refresh,
			headers: props.headers,
		}
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}
	componentWillMount() {
		this.props.oauthVerify(this.state.refresh, this.state.headers);
		this.unlisten = this.props.history.listen(() => {
			this.props.oauthUnready();
			this.props.oauthVerify(this.state.refresh, this.state.headers);
		});
	}

	componentWillUnmount() {
		this.unlisten();
	}

	render() {
		const {classes} = this.props;
		return (
			<div className={classes.main}>
				<div className={classes.root}>
					<div className={classes.hero}>
						{this.state.loading === false ?
							<div className={classes.hero2}>
								<Nav/>
								<Content/>
								<AdminPanel/>
							</div>
							:
							<div className={classes.hero2}>
								<NavLoading/>
							</div>
						}
					</div>
				</div>
			</div>
		);
	}
}
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
	oauthUnready,
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(withRouter(Body)));