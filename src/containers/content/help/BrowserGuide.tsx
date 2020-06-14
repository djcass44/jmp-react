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

import React, {ReactNode, useEffect, useState} from "react";
import {mdiAppleSafari, mdiFirefox, mdiGoogleChrome, mdiMicrosoftEdge, mdiMicrosoftInternetExplorer} from "@mdi/js";
import Icon from "@mdi/react";
import {Collapse, IconButton, Link, makeStyles, Theme, Typography} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {Code, ThemedTooltip} from "jmp-coreui";
import {APP_KEY, APP_NAME, BASE_URL} from "../../../constants";

const useStyles = makeStyles((theme: Theme) => ({
	browserBar: {
		marginBottom: theme.spacing(1)
	},
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
	},
	alert: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2)
	}
}));

interface Browser {
	icon: string;
	colour: string;
	name: string;
	content: ReactNode;
	info?: ReactNode | string | null;
	severity: "info" | "error" | "success" | "warning" | undefined;
}

const BrowserGuide: React.FC = () => {
	const classes = useStyles();
	const [selected, setSelected] = useState<Browser | null>(null);
	const [open, setOpen] = useState<boolean>(false);

	const [data, setData] = useState<Array<ReactNode>>([]);
	const [browserData] = useState<Array<Browser>>([
		{
			icon: mdiGoogleChrome,
			colour: "#1da462",
			name: "Google Chrome",
			content: <span>
				Make sure to go to extension settings and enter <Code>{BASE_URL}</Code>
				<br/>
				<br/>
				1. Open settings (<Code>chrome://settings/searchEngines</Code>)<br/>
				2. Click <b>Manage search engines</b><br/>
				3. Add new with the following information<br/>
				&emsp;Search engine = <Code>{APP_NAME}</Code><br/>
				&emsp;Keyword = <Code>{APP_KEY}</Code><br/>
				&emsp;URL = <Code>{BASE_URL}/jmp?query=%s</Code>
			</span>,
			info: <Typography variant="subtitle2">Skip setup using the&nbsp;
				<Link
					target="_blank" rel="noopener noreferrer"
					href="https://chrome.google.com/webstore/detail/jmp/nkhlenilbcdnmekcknikcjoiappodhgm">Chrome
					addon!</Link>
			</Typography>,
			severity: "info"
		},
		{
			icon: mdiFirefox,
			colour: "#ff0039",
			name: "Mozilla Firefox",
			content: <div>
				Make sure to go to extension settings and enter <Code>{BASE_URL}</Code>
				<br/>
				<br/>
				Add a new bookmark with the following values<br/>
				&emsp;Name = <Code>{APP_NAME}</Code><br/>
				&emsp;Keyword = <Code>{APP_KEY}</Code><br/>
				&emsp;Location = <Code>{BASE_URL}/jmp?query=%s</Code>
			</div>,
			info: <Typography variant="subtitle2">Skip setup using the&nbsp;
				<Link
					target="_blank" rel="noopener noreferrer"
					href="https://addons.mozilla.org/en-US/firefox/addon/jmp-webext/">Firefox addon!</Link>
			</Typography>,
			severity: "info"
		},
		{
			icon: mdiMicrosoftEdge,
			colour: "#3277bc",
			name: "Microsoft Edge",
			content: <span>
				Make sure to go to extension settings and enter <Code>{BASE_URL}</Code>
				<br/>
				<br/>
				1. Open settings (<Code>edge://settings/searchEngines</Code>)<br/>
				2. Click <b>Manage search engines</b><br/>
				3. Add new with the following information<br/>
				&emsp;Search engine = <Code>{APP_NAME}</Code><br/>
				&emsp;Keyword = <Code>{APP_KEY}</Code><br/>
				&emsp;URL = <Code>{BASE_URL}/jmp?query=%s</Code>
			</span>,
			info: <Typography variant="subtitle2">Skip setup using the&nbsp;
				<Link
					target="_blank" rel="noopener noreferrer"
					href="https://chrome.google.com/webstore/detail/jmp/nkhlenilbcdnmekcknikcjoiappodhgm">Edge
					addon!</Link>
			</Typography>,
			severity: "info"
		},
		{
			icon: mdiAppleSafari,
			colour: "#006cff",
			name: "Safari",
			content: <React.Fragment/>,
			info: "Safari is not supported.",
			severity: "error"
		},
		{
			icon: mdiMicrosoftInternetExplorer,
			name: "Internet Explorer",
			colour: "#1EBBEE",
			content: <React.Fragment/>,
			info: "Internet Explorer is not supported.",
			severity: "error"
		}
	]);

	useEffect(() => {
		setData(browserData.map(i => (
			<ThemedTooltip translate title={i.name} key={i.icon}>
				<IconButton
					centerRipple={false} style={{color: i.colour}} onClick={() => {
					if (selected === i && open) {
						setOpen(false);
						return;
					}
					setSelected(i);
					setOpen(true);
				}}>
					<Icon path={i.icon} size={1} color={i.colour}/>
				</IconButton>
			</ThemedTooltip>)))
	}, [selected, open, browserData]);

	return (
		<div>
			<div className={classes.browserBar}>
				{data}
			</div>
			<Collapse in={open}>
				{selected != null && <div className={classes.content}>
					<Typography variant="h6" className={classes.name} style={{color: selected.colour}}>
						{selected.name}
					</Typography>
					{selected.info &&
					<Alert className={classes.alert} severity={selected.severity}>{selected.info}</Alert>}
					{selected.content}
				</div>}
			</Collapse>
		</div>
	);
};

export default BrowserGuide;
