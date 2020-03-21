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
import {Collapse, ListItemSecondaryAction, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import Center from "react-center";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import Icon from "@mdi/react";
import {mdiChevronDown, mdiChevronUp} from "@mdi/js";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import BrowserGuide from "./help/BrowserGuide";
import getHelpCardColour from "../../selectors/getHelpCardColour";
import useTheme from "@material-ui/core/styles/useTheme";
import {APP_NAME, APP_NOUN} from "../../constants";
import {useHistory, useLocation} from "react-router";

const useStyles = makeStyles((theme: Theme) => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	name: {
		fontFamily: "Manrope",
		fontWeight: 500,
		color: theme.palette.primary.main,
		margin: theme.spacing(2)
	},
	avatar: {
		width: 56,
		height: 56,
		borderRadius: 100,
		margin: 24,
		padding: 6,
		backgroundColor: theme.palette.background.default
	},
	content: {
		padding: 16,
		borderRadius: 12,
		color: theme.palette.text.primary
	},
	item: {
		borderRadius: 12
	},
	itemAction: {
		pointerEvents: 'none'
	}
}));

interface QnA {
	id: string;
	q: string;
	a: string | ReactNode;
}

const Help: React.FC = () => {
	// hooks
	const classes = useStyles();
	const theme = useTheme<Theme>();
	const history = useHistory();
	const location = useLocation();

	// local state
	const [expand, setExpand] = useState<string | null>(null);
	const [data, setData] = useState<Array<ReactNode>>([]);
	const [qna] = useState<Array<QnA>>([
		{
			id: "browser-setup",
			q: "Browser setup guides",
			a: <BrowserGuide/>
		},
		{
			id: "data-collection",
			q: "What data is collected?",
			a: <span>
				When you log in with a federated identity provider (e.g. GitHub, Google, Keycloak) we ask for your username, name and avatar which is used for personalisation of the application.
				This data is never sold to any 3rd parties, nor is it used for marketing.
			</span>
		},
		{
			id: "http-urls",
			q: "Why are some URLs red?",
			a: <span>HTTP URLs are marked as red to communicate their lack of security. HTTP websites are being phased out all across the internet and your browser probably already shows warnings.<br/><br/>The red highlight is only a warning and doesn't interfere with your ability to access them, however the site wont be indexed and will likely be missing metadata (e.g. title and favicon).</span>
		},
		{
			id: "login-expiration",
			q: `Why can't I access my personal ${APP_NOUN}s sometimes?`,
			a: <span>Your login only persists for a set period of time, once it expires you won't be able to access your personal/group {APP_NOUN}s until you login again.</span>
		},
		{
			id: "global-jumps",
			q: `Why can't I create global ${APP_NOUN}s?`,
			a: <span>Creating global {APP_NOUN}s is a privilege given only to Admins. Contact your local SysAdmin if you need your account upgraded.</span>
		},
		{
			id: "group-jumps",
			q: `How do I share a ${APP_NOUN} with select users?`,
			a: <span>Create a Group! When you next create a {APP_NOUN}, set the type to <code>Group</code> and select the Group containing your users.<br/>The only people who will be able to use this {APP_NOUN} will be the users in the group.</span>
		},
		{
			id: "reporting-issues",
			q: "I found a bug",
			a: <span>Awesome! Create an <a target="_blank" rel="noopener noreferrer"
			                               href="https://github.com/djcass44/jmp/issues">issue</a> and it will be looked at.</span>
		},
		{
			id: "password-security",
			q: "What happens to my password?",
			a: <span>
				Security is a very important issue and it's certainly not ignored here.
				<br/>If using <b>local authentication</b>, your password is hashed &amp; salted then stored in the database. It is only used to verify your login and generated tokens for you to use the app. It is never decrypted again and cannot be seen by anyone.
				<br/><br/>If using <b>LDAP</b>, your password is never stored and is only used to be verified against the LDAP server.
				<br/><br/>If using <b>OAuth2</b>, you are redirected to the provider (e.g. Google) which returns an authentication token. {APP_NAME} uses this token to verify your identity when you make requests.
			</span>
		}
	]);

	useEffect(() => {
		const {hash} = location;
		if (!hash) {
			setExpand(null);
			return;
		}
		setExpand(hash.substring(1, hash.length));
	}, [location]);

	useEffect(() => {
		// set the appropriate colours for the card-content
		const card = {
			backgroundColor: getHelpCardColour(theme)
		};
		setData(qna.map(i => {
			return (
				<div key={i.id}>
					<ListItem button className={classes.item} value={i.id} onClick={() => toggleExpansion(i.id)}
					          component={"li"}>
						<ListItemText
							primary={<span
								className={classes.title}
								style={{color: theme.palette.text.primary}}>
								{i.q}
							</span>}
						/>
						<ListItemSecondaryAction className={classes.itemAction}>
							<Icon path={i.id === expand ? mdiChevronUp : mdiChevronDown} size={1}
							      color={theme.palette.text.hint}/>
						</ListItemSecondaryAction>
					</ListItem>
					<Collapse in={i.id === expand} unmountOnExit timeout="auto">
						<Typography
							className={classes.content}
							style={card}
							variant="body1">
							{i.a}
						</Typography>
					</Collapse>
				</div>
			);
		}));
	}, [qna, expand]);

	const toggleExpansion = (id: string): void => {
		if (id === expand)
			history.push("#");
		else
			history.push(`#${id}`);
	};

	return (
		<>
			<Center>
				<Avatar
					className={classes.avatar}
					component={Paper}
					src={`${process.env.PUBLIC_URL}/jmp2.png`}
					alt={APP_NAME}
				/>
			</Center>
			<Center>
				<img height={192} src={"/draw/undraw_circles_y7s2.svg"} alt={""}/>
			</Center>
			<Center>
				<Typography variant="h4" className={classes.name}>Need a hand?</Typography>
			</Center>
			<List component='ul'>
				{data}
			</List>
		</>
	);
};
export default Help;
