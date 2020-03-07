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
import prefersColorScheme from "prefers-color-scheme";
import {dark, light} from "./palette";

// get the theme that the browser/os wants (dark or light)
const wantedTheme = prefersColorScheme();
const themeType = localStorage.getItem(LS_DARK) === 'true' ? 'dark' : wantedTheme;
// inform the css about which theme we're using
document.documentElement.setAttribute("data-theme", themeType);

export const IS_DARK_THEME = themeType === "dark";

export default createMuiTheme({
	palette: IS_DARK_THEME ? dark : light,
	overrides: {
		MuiTooltip: {
			tooltip: {
				fontSize: "0.9rem"
			}
		}
	},
});
