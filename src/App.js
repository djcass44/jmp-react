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
import withStyles from "@material-ui/core/styles/withStyles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
});

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			refresh: props.refresh,
			headers: props.headers,
			isLoggedIn: props.isLoggedIn,
			ready: props.ready
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
		const loading = (
			// TODO move this into the Nav component (via a loading === true check)
			<div>
				<AppBar position={"static"} color={"default"}>
					<Toolbar>
						<Typography className={classes.title} variant={"h6"} color={"inherit"}>
							{process.env.REACT_APP_APP_NAME}
						</Typography>
					</Toolbar>
				</AppBar>
				<LinearProgress style={{flex: 1}}/>
			</div>
		);
		return (
			<div className={"App"}>
				<MuiThemeProvider theme={Theme}>
					{this.state.loading === false ?
						<div>
							<Nav/>
							<Content/>
						</div>
						:
						loading
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
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(withRouter(App))));
