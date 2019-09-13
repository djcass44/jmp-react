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

import React, {useState} from "react";
import {mdiAppleSafari, mdiEdge, mdiFirefox, mdiGoogleChrome, mdiInternetExplorer} from "@mdi/js";
import Icon from "@mdi/react";
import {IconButton, makeStyles, Typography} from "@material-ui/core";
import {APP_KEY, APP_NAME, BASE_URL} from "../../../constants";

const useStyles = makeStyles(theme => ({
	name: {
		fontFamily: "Manrope",
		fontWeight: 500,
		paddingTop: 8,
		paddingBottom: 4
	},
	content: {
		borderRadius: 12,
		padding: 12,
		backgroundColor: theme.palette.background.paper
	}
}));

export default () => {
	const [selected, setSelected] = useState(-1);
	const browserData = [
		{
			icon: mdiGoogleChrome,
			colour: '#1da462',
			name: "Google Chrome",
			content: <span>
				1. Open settings (<code>chrome://settings</code>)<br/>
				2. Click <b>Manage search engines</b><br/>
				3. Add new with the following information<br/>
				&emsp;Search engine = <kbd>{APP_NAME}</kbd><br/>
				&emsp;Keyword = <kbd>{APP_KEY}</kbd><br/>
				&emsp;URL = <kbd>{BASE_URL}/jmp?query=%s</kbd>
			</span>,
			info: 'This has only been tested in Google Chrome and Chromium. Its usability in other Chromium-based browsers is unknown.',
			supported: 2
		},
		{
			icon: mdiFirefox,
			colour: '#ff0039',
			name: 'Mozilla Firefox',
			content: <span>
				Add a new bookmark with the following values<br/>
				&emsp;Name = <kbd>{APP_NAME}</kbd><br/>
				&emsp;Keyword = <kbd>{APP_KEY}</kbd><br/>
				&emsp;Location = <kbd>{BASE_URL}/jmp?query=%s</kbd>
			</span>,
			supported: 2
		},
		{
			icon: mdiEdge,
			colour: '#3277bc',
			name: 'Microsoft Edge (pre-Chromium)',
			content: <span>
				1. Open {APP_NAME}<br/>
				2. Open Settings -> Advanced -> Change search provider<br/>
				3. Set {APP_NAME} as default
			</span>,
			info: 'This applies to EdgeHTML and not Edge-Chromium. Edge-Chromium is the same as Google Chrome',
			supported: 2
		},
		{
			icon: mdiAppleSafari,
			colour: '#006cff',
			name: 'Safari',
			content: <span>
				Safari 10+ is supported, 9 will work with compatibility issues.
				Due to Apple locking down the search engine choices, you will need to install an extension in order to use {APP_NAME}
			</span>,
			info: 'Safari is only available for macOS',
			supported: 1
		},
		{
			icon: mdiInternetExplorer,
			name: 'Internet Explorer',
			colour: '#1EBBEE',
			content: 'Only IE11 and above are supported likely with compatibility issues. We recommend that you use a more modern browser such as Firefox, Chrome or Edge',
			supported: 0
		}
	];

	const classes = useStyles();
	const browsers = [];
	browserData.forEach((i, index) => {
		browsers.push(
			<IconButton centerRipple={false} style={{color: i.colour}} key={index} onClick={() => setSelected(selected === index ? -1 : index)}>
				<Icon path={i.icon} size={1} color={i.colour}/>
			</IconButton>
		)
	});
	return (
		<div>
			<div>
				{browsers}
			</div>
			{selected >= 0 &&
				<div className={classes.content}>
					<Typography variant={"h6"} className={classes.name} style={{color: browserData[selected].colour}}>
						{browserData[selected].name}
					</Typography>
					<Typography variant={"body1"}>{browserData[selected].content}</Typography>
				</div>
			}
		</div>
	);
};
