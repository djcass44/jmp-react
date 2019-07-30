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

import {createMuiTheme} from "@material-ui/core";
import {LS_DARK} from "../constants";

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#0052CC',
			light: '#DEEBFF',
			dark: '#0052CC'
		},
		secondary: {
			main: '#172B4d',
			light: '#455570',
			dark: '#101e35'
		},
		warning: {
			main: '#FFAB00',
			light: '#FFE380',
			dark: '#FF8B00'
		},
		error: {
			main: '#FF5630',
			light: '#FFEBE5',
			dark: '#BF2600'
		},
		info: {
			main: '#6554C0',
			light: '#EAE6FF',
			dark: '#5243AA'
		},
		success: {
			main: '#36B37E',
			light: '#E3FCEF',
			dark: '#00875A'
		},
		type: localStorage.getItem(LS_DARK) === 'true' ? 'dark' : 'light'
	},
	overrides: {
		MuiTooltip: {
			tooltip: {
				fontSize: "0.9rem"
			}
		}
	},
});
export default theme;