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
import {Switch, Route} from "react-router-dom";
import Login from "./content/Login";
import {connect} from "react-redux";
import {OAUTH_REFRESH, OAUTH_VERIFY, oauthRefresh, oauthRequest, oauthVerify} from "../actions/Auth";
import NotFound from "./content/NotFound";
import {LS_HEADERS} from "../constants";
import {Banner} from "material-ui-banner";
import ErrorIcon from "@material-ui/icons/Error";

class Content extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: JSON.parse(localStorage.getItem(LS_HEADERS)) || {},
		}
	}

	componentDidMount() {
		console.log(this.state.headers);
		this.props.oauthVerify(this.state.refresh, this.state.headers);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}

	render() {
		let content = this.state.loading === true ? (<Grid item xs={12} sm={6}><CircularProgress/></Grid>) : (<Grid item xs={12} sm={6}>
			<Banner open={this.state.error != null} label={this.state.error} paperProps={{elevation: 1}} showDismissButton={false} icon={
				<ErrorIcon color={"error"}/>
			}/>
			<Switch>
				<Route exact path={"/"} component={Jumps}/>
				<Route exact path={"/login"} component={Login}/>
				<Route component={NotFound}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(Content);