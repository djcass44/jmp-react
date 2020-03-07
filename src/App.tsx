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

import React, {useEffect} from "react";
import {MuiThemeProvider} from "@material-ui/core/styles";
import Theme from "./style/theme";
import {useDispatch} from "react-redux";
import {Helmet} from "react-helmet";
import {closeWebSocket, connectWebSocket} from "./actions/Socket";
import Body from "./containers/Body";
import {SnackbarProvider} from "notistack";
import Snackbar from "./containers/Snackbar";
import useTheme from "@material-ui/core/styles/useTheme";

const App: React.FC = () => {
	const dispatch = useDispatch();
	const {palette} = useTheme();

	useEffect(() => {
		connectWebSocket(dispatch);
		return () => {
			closeWebSocket(dispatch);
		};
	}, []);

	return (
		<div>
			<MuiThemeProvider theme={Theme}>
				<SnackbarProvider maxSnack={3} autoHideDuration={3500} preventDuplicate>
					<Helmet>
						<meta name={"theme-color"} content={palette.primary.main}/>
					</Helmet>
					<Body/>
					<Snackbar/>
				</SnackbarProvider>
			</MuiThemeProvider>
		</div>
	);
};
export default App;