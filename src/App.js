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
import {MuiThemeProvider} from "@material-ui/core/styles";
import Theme from "./style/Palette";

function App() {
	return (
		<div className={"App"}>
			<MuiThemeProvider theme={Theme}>
				<Nav/>
				<Content/>
			</MuiThemeProvider>
		</div>
	);
}

export default App;
