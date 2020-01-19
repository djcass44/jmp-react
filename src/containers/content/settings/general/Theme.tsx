/*
 *    Copyright 2020 Django Cass
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

import {Button, FormControlLabel, Switch, Typography} from "@material-ui/core";
import React from "react";

interface ThemeProps {
	dark: boolean;
	onSetDark: Function;
	onSave: Function;
}

const Theme: React.FC<ThemeProps> = ({dark, onSetDark, onSave}: ThemeProps) => {
	return (<div>
		<Typography color="error" variant="body1">This feature is in active development and may cause graphical
			issues.</Typography>
		<FormControlLabel control={
			<Switch checked={dark} onChange={(e) => onSetDark(e)}/>
		} label="Dark theme"/>
		<Button variant="contained" color="primary" onClick={() => onSave()}>Save</Button>
	</div>);
};

export default Theme;