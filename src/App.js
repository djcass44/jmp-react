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

import React from 'react';
import './App.css';
import Content from "./containers/Content";
import Nav from "./containers/Nav";
import {MuiThemeProvider, withTheme} from "@material-ui/core/styles";
import Theme from "./style/Palette";
import {withRouter} from "react-router-dom";
import {OAUTH_REFRESH, OAUTH_VERIFY, oauthRequest, oauthUnready, oauthVerify} from "./actions/Auth";
import {connect} from "react-redux";
import {LS_HEADERS, LS_REFRESH} from "./constants";
import {CircularProgress, Grid} from "@material-ui/core";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			refresh: localStorage.getItem(LS_REFRESH) || '',
			headers: JSON.parse(localStorage.getItem(LS_HEADERS)) || {},
			ready: false
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
			<div className={"App"}>
				<MuiThemeProvider theme={Theme}>
					{this.state.loading === false ?
						<div>
							<Nav/>
							<Content/>
						</div>
						:
						<Grid item xs={12} sm={6}><CircularProgress/></Grid>
					}
				</MuiThemeProvider>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	loading: state.loading[OAUTH_VERIFY],
	error: state.errors[OAUTH_REFRESH],
	headers: state.auth.headers,
	isLoggedIn: state.auth.isLoggedIn,
	refresh: state.auth.refresh,
	ready: state.auth.ready
});
const mapDispatchToProps = ({
	oauthVerify,
	oauthRequest,
	oauthUnready
});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme()(withRouter(App)));
