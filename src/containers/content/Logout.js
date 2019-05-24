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
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";

class Logout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggingOut: false
		};
	}

	componentDidMount() {
		// Log the user out
		// if(this.state.isLoggedIn === true) {this.props.oauthLogout()}
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
		if(this.state.isLoggedIn === false) {
			this.props.history.push('/');
		}
		else {
			this.setState({loggingOut: true});
			this.props.oauthLogout();
		}
	}

	render() {
		const loggedOut = (
			<div>
				<h1 className={"m2-title"}>You're already logged out!</h1>
				<Center>Click below to return home</Center>
				<Center>
					<IconButton component={Link} to={"/"} color={"primary"} aria-label={"Return to home"}>
						<HomeIcon/>
					</IconButton>
				</Center>
			</div>
		);
		const loggedIn = (
			<div>
				<h1 className={"m2-title"}>Logging you out...</h1>
				<Center>If you're not redirected in a few seconds, click below</Center>
				<Center>
					<IconButton component={Link} to={"/"} color={"primary"} aria-label={"Return to home"}>
						<HomeIcon/>
					</IconButton>
				</Center>
			</div>
		);
		return (
			<Center>
				{this.state.loggingOut === true && this.state.isLoggedIn === true ? loggedIn : loggedOut}
			</Center>
		);
	}
}
const mapStateToProps = state => ({
	isLoggedIn: state.auth.isLoggedIn
});
const mapDispatchToProps = ({
	oauthLogout
});
export default connect(mapStateToProps, mapDispatchToProps)(Logout);