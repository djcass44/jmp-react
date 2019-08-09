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

import React, {useEffect, useContext} from 'react';
import Content from "./containers/Content";
import Nav from "./containers/Nav";
import {MuiThemeProvider, withTheme} from "@material-ui/core/styles";
import Theme from "./style/theme";
import {__RouterContext} from "react-router-dom";
import {OAUTH_REFRESH, OAUTH_VERIFY, oauthRequest, oauthUnready, oauthVerify} from "./actions/Auth";
import {connect} from "react-redux";
import {Helmet} from "react-helmet";
import {wsClose, wsOpen} from "./actions/Socket";
import AdminPanel from "./components/AdminPanel";
import PropTypes from "prop-types";
import NavLoading from "./components/NavLoading";

export const App = props => {
	const routerContext = useContext(__RouterContext);

	useEffect(() => {
		props.oauthVerify(props.refresh, props.headers);
		const unlisten = routerContext.history.listen(() => {
			props.oauthUnready();
			props.oauthVerify(props.refresh, props.headers);
		});
		props.store.dispatch(wsOpen(props.headers));
		return () => {
			unlisten();
			props.store.dispatch(wsClose);
		}
	}, []);

	const {theme} = props;
	return (
		<div className={"App"}>
			<MuiThemeProvider theme={Theme}>
				<Helmet><meta name={"theme-color"} content={theme.palette.primary.main}/></Helmet>
				{props.loading === false ?
					<div>
						<Nav/>
						<Content/>
						<AdminPanel/>
					</div>
					:
					<NavLoading/>
				}
			</MuiThemeProvider>
		</div>
	);
};
App.propTypes = {
	loading: PropTypes.bool,
};

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
	oauthUnready,
});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(App));
