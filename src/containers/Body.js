import React from 'react';
import Content from "../containers/Content";
import Nav from "../containers/Nav";
import {withTheme} from "@material-ui/core/styles";
import {OAUTH_VERIFY, oauthRequest, oauthUnready, oauthVerify} from "../actions/Auth";
import {connect} from "react-redux";
import AdminPanel from "../components/AdminPanel";
import PropTypes from "prop-types";
import NavLoading from "../components/NavLoading";
import {withRouter} from "react-router-dom";

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
		return (
			<div>
				{this.state.loading === false ?
					<div>
						<Nav/>
						<Content/>
						<AdminPanel/>
					</div>
					:
					<NavLoading/>
				}
			</div>
		);
	}
}
Body.propTypes = {
	loading: PropTypes.bool,
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
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(withRouter(Body)));