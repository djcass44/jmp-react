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

import React from "react";
import Center from "react-center";
import {oauthLogout} from "../../actions/Auth";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";
import {withTheme} from "@material-ui/core";
import {oauth2Logout} from "../../actions/Oauth";

class Logout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn: props.isLoggedIn,
			headers: props.headers,
			request: props.request
		};
	}

	componentDidMount() {
		window.document.title = `Logout - ${process.env.REACT_APP_APP_NAME}`;
		// Log the user out
		this.props.oauthLogout(this.state.headers);
		this.props.oauth2Logout(this.state.request, this.state.headers);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
		if(nextProps.isLoggedIn === false) {
			this.props.history.push('/');
		}
	}

	render() {
		const loggedIn = (
			<div>
				<h1 className={"m2-title"}>Ensuring that you're logged out...</h1>
				<Center><CircularProgress/></Center>
				<Center style={{paddingTop: 16}}>If you're not redirected in a few seconds, click below</Center>
				<Center>
					<IconButton component={Link} to={"/"} color={"primary"} aria-label={"Return to home"}>
						<HomeIcon/>
					</IconButton>
				</Center>
			</div>
		);
		return (
			<Center>
				{loggedIn}
			</Center>
		);
	}
}
const mapStateToProps = state => ({
	isLoggedIn: state.auth.isLoggedIn,
	headers: state.auth.headers,
	request: state.auth.request
});
const mapDispatchToProps = ({
	oauthLogout,
	oauth2Logout
});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(withRouter(Logout)));
