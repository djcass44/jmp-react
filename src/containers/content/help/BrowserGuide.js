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

import React from "react";
import {mdiAppleSafari, mdiEdge, mdiFirefox, mdiGoogleChrome, mdiInternetExplorer} from "@mdi/js";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@mdi/react";
import {Typography, withStyles, withTheme} from "@material-ui/core";
import {BASE_URL} from "../../../constants";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	name: {
		fontFamily: "Manrope",
		fontWeight: 500,
		paddingTop: 8,
		paddingBottom: 4
	},
	avatar: {
		backgroundColor: '#FAFAFA',
		width: 56,
		height: 56,
		borderRadius: 100,
		margin: 24,
		padding: 6
	},
	content: {
		padding: 16,
		backgroundColor: theme.palette.primary.light
	}
});

class BrowserGuide extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: -1,
			browsers: [
				{
					icon: mdiGoogleChrome,
					colour: '#1da462',
					name: "Google Chrome",
					logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Chrome_icon_%28September_2014%29.svg',
					content: <span>1. Open settings (<code>chrome://settings</code>)<br/>2. Click <b>Manage search engines</b><br/>3. Add new with the following information<br/>&emsp;Search engine = <kbd>{process.env.REACT_APP_APP_NAME}</kbd><br/>&emsp;Keyword = <kbd>{process.env.REACT_APP_APP_KEY}</kbd><br/>&emsp;URL = <kbd>{BASE_URL}/jmp?query=%s</kbd></span>,
					info: 'This has only been tested in Google Chrome and Chromium. Its usability in other Chromium-based browsers is unknown.',
					supported: 2
				},
				{
					icon: mdiFirefox,
					colour: '#ff0039',
					name: 'Mozilla Firefox',
					logo: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Firefox_Logo%2C_2017.svg',
					content: <span>1. Add a new bookmark with the following values<br/>&emsp;Name = <kbd>{process.env.REACT_APP_APP_NAME}</kbd><br/>&emsp;Keyword = <kbd>{process.env.REACT_APP_APP_KEY}</kbd><br/>&emsp;Location = <kbd>{BASE_URL}/jmp?query=%s</kbd></span>,
					supported: 2
				},
				{
					icon: mdiEdge,
					colour: '#3277bc',
					name: 'Microsoft Edge (pre-Chromium)',
					logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Microsoft_Edge_logo.svg/450px-Microsoft_Edge_logo.svg.png',
					content: <span>1. Open {process.env.REACT_APP_APP_NAME}<br/>2. Open Settings -> Advanced -> Change search provider<br/>3. Set {process.env.REACT_APP_APP_NAME} as default</span>,
					info: 'This applies to EdgeHTML and not Edge-Chromium. Edge-Chromium is the same as Google Chrome',
					supported: 2
				},
				{
					icon: mdiAppleSafari,
					colour: '#006cff',
					name: 'Safari',
					logo: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Safari_browser_logo.svg',
					content: <span>Safari 10+ is supported, 9 will work with compatibility issues. Due to Apple locking down the search engine choices, you will need to install an extension in order to use {process.env.REACT_APP_APP_NAME}</span>,
					info: 'Safari is only available for macOS',
					supported: 1
				},
				{
					icon: mdiInternetExplorer,
					name: 'Internet Explorer',
					colour: '#1EBBEE',
					logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Internet_Explorer_10%2B11_logo.svg/489px-Internet_Explorer_10%2B11_logo.svg.png',
					content: 'Only IE11 and above are supported likely with compatibility issues. We recommend that you use a better browser such as Firefox, Chrome or Edge',
					supported: 0
				}
			]
		}
	}

	render() {
		const {classes} = this.props;
		const browsers = [];
		this.state.browsers.forEach((i, index) => {
			browsers.push(
				<IconButton centerRipple={false} style={{color: i.colour}} key={index} onClick={(e) => {
					if(this.state.selected === index)
						this.setState({selected: -1});
					else
						this.setState({selected: index})
				}}>
					<Icon path={i.icon} size={1} color={i.colour}/>
				</IconButton>
			)
		});
		return (
			<div>
				<div>
					{browsers}
				</div>
				{this.state.selected >= 0 ?
					<div>
						<Typography variant={"h6"} className={classes.name}>{this.state.browsers[this.state.selected].name}</Typography>
						<Typography variant={"body1"}>{this.state.browsers[this.state.selected].content}</Typography>
					</div>
					:
					""
				}
			</div>
		);
	}
}
export default withStyles(styles)(withTheme(BrowserGuide));