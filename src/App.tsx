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

import React, {useEffect, useMemo} from "react";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {Helmet} from "react-helmet";
import {closeWebSocket, connectWebSocket} from "./actions/Socket";
import Body from "./containers/Body";
import {SnackbarProvider} from "notistack";
import Snackbar from "./containers/Snackbar";
import useTheme from "@material-ui/core/styles/useTheme";
import {dark, light} from "./style/palette";
import {TState} from "./store/reducers";
import {GenericState} from "./store/reducers/generic";

const App: React.FC = () => {
	const dispatch = useDispatch();
	const {palette} = useTheme();

	const {themeMode} = useSelector<TState, GenericState>(state => state.generic);

	// update the theme dynamically
	const theme = useMemo(() => {
		document.documentElement.setAttribute("data-theme", themeMode);
		return createMuiTheme({
			// @ts-ignore
			palette: themeMode === "dark" ? dark : light,
			overrides: {
				MuiTooltip: {
					tooltip: {
						fontSize: "0.9rem"
					}
				}
			}
		});
	}, [themeMode]);

	useEffect(() => {
		connectWebSocket(dispatch);
		return () => {
			closeWebSocket(dispatch);
		};
	}, []);

	return (
		<div>
			<MuiThemeProvider theme={theme}>
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
