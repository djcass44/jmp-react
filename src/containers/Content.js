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
import {CircularProgress, Grid} from "@material-ui/core";
import Jumps from "./content/Jumps";
import {Switch, Route, withRouter} from "react-router-dom";
import Login from "./content/Login";
import {connect} from "react-redux";
import {OAUTH_REFRESH, OAUTH_VERIFY, oauthRefresh, oauthRequest, oauthVerify} from "../actions/Auth";
import NotFound from "./content/NotFound";
import {LS_HEADERS} from "../constants";
import {Banner} from "material-ui-banner";
import ErrorIcon from "@material-ui/icons/Error";
import Logout from "./content/Logout";
import {withTheme} from "@material-ui/core";
import Identity from "./content/Identity";

class Content extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: JSON.parse(localStorage.getItem(LS_HEADERS)) || {},
		}
	}

	componentWillMount() {
		this.unlisten = this.props.history.listen(() => {
			this.props.oauthVerify(this.state.refresh, this.state.headers);
		});
	}

	componentWillUnmount() {
		this.unlisten();
	}

	// componentDidMount() {
	// 	console.log(this.state.headers);
	// 	this.props.oauthVerify(this.state.refresh, this.state.headers);
	// }
	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}

	render() {
		const {theme} = this.props;
		let content = this.state.loading === true ? (<Grid item xs={12} sm={6}><CircularProgress/></Grid>) : (<Grid item xs={12} sm={6}>
			{/* TODO fix the background colour of the banner avatar */}
			<Banner iconProps={{color: theme.palette.error.dark}} open={this.state.error != null} label={this.state.error} paperProps={{elevation: 1}} showDismissButton={false} icon={
				<ErrorIcon style={{color: theme.palette.error.dark}}/>
			}/>
			<Switch>
				<Route exact path={"/"} component={Jumps} key={"jumps"}/>
				<Route exact path={"/identity"} component={Identity} key={"identity"}/>
				<Route exact path={"/login"} component={Login} key={"login"}/>
				<Route exact path={"/logout"} component={Logout} key={"logout"}/>
				<Route component={NotFound} key={"notfound"}/>
			</Switch>
		</Grid>);
		return (<div style={{padding: 20}}>
			<Grid container spacing={40}>
				<Grid item sm={3}/>
				{content}
				<Grid item sm={3}/>
			</Grid>
		</div>);
	}
}

const mapStateToProps = state => ({
	loading: state.loading[OAUTH_VERIFY],
	error: state.errors[OAUTH_REFRESH],
	headers: state.auth.headers,
	isLoggedIn: state.auth.isLoggedIn,
	refresh: state.auth.refresh
});
const mapDispatchToProps = ({
	oauthVerify,
	oauthRequest,
	oauthRefresh
});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme()(withRouter(Content)));