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

import React, {useEffect} from 'react';
import {MuiThemeProvider, withTheme} from "@material-ui/core/styles";
import Theme from "./style/theme";
import {connect} from "react-redux";
import {Helmet} from "react-helmet";
import {wsClose, wsOpen} from "./actions/Socket";
import Body from "./containers/Body";

export const App = props => {
	useEffect(() => {
		props.wsOpen(props.headers);
		return () => {
			props.wsClose();
		}
	});

	const {theme} = props;
	return (
		<div className={"App"}>
			<MuiThemeProvider theme={Theme}>
				<Helmet><meta name={"theme-color"} content={theme.palette.primary.main}/></Helmet>
				<Body/>
			</MuiThemeProvider>
		</div>
	);
};

const mapStateToProps = state => ({
	headers: state.auth.headers,
	refresh: state.auth.refresh,
});
const mapDispatchToProps = ({
	wsOpen,
	wsClose
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTheme(App));
