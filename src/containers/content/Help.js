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
import {Collapse, ListItemSecondaryAction, Paper, Typography, withStyles, withTheme} from "@material-ui/core";
import Center from "react-center";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import Icon from "@mdi/react";
import {mdiChevronDown, mdiChevronUp} from "@mdi/js";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import BrowserGuide from "./help/BrowserGuide";
import BackButton from "../../components/widget/BackButton";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	name: {fontFamily: "Manrope", fontWeight: 500, color: theme.palette.secondary.main},
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
		borderRadius: 12,
		backgroundColor: theme.palette.primary.light
	}
});

class Help extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			qna: [
				{
					q: "Browser setup guides",
					a: <BrowserGuide/>
				},
				{
					q: "Why are some URLs red?",
					a: <span>HTTP URLs are marked as red to communicate their lack of security. HTTP websites are being phased out all across the internet and your browser probably already shows warnings.<br/><br/>The red highlight is only a warning and doesn't interfere with your ability to access them, however the site wont be indexed and will likely be missing metadata (e.g. title and favicon).</span>
				},
				{
					q: `Why can't I access my personal ${process.env.REACT_APP_APP_NOUN}s sometimes?`,
					a: <span>Your login only persists for a set period of time, once it expires you won't be able to access your personal/group {process.env.REACT_APP_APP_NOUN}s until you login again.</span>
				},
				{
					q: `Why can't I create global ${process.env.REACT_APP_APP_NOUN}s?`,
					a: <span>Creating global {process.env.REACT_APP_APP_NOUN}s is a privilege given only to Admins. Contact your local SysAdmin if you need your account upgraded.</span>
				},
				{
					q: `How do I share a ${process.env.REACT_APP_APP_NOUN} with select users?`,
					a: <span>Create a Group! When you next create a {process.env.REACT_APP_APP_NOUN}, set the type to <code>Group</code> and select the Group containing your users.<br/>The only people who will be able to use this {process.env.REACT_APP_APP_NOUN} will be the users in the group.</span>
				},
				{
					q: "I found a bug",
					a: <span>Awesome! Create an <a target="_blank" rel="noopener noreferrer" href="https://github.com/djcass44/jmp/issues">issue</a> and it will be looked at.</span>
				},
				{
					q: "What happens to my password?",
					a: <span>Security is a very important issue and it's certainly not ignored here. <br/>If using <b>local authentication</b>, your password is hashed &amp; salted then stored in the database. It is only used to verify your login and generated tokens for you to use the app. It is never decrypted again and cannot be seen by anyone.<br/><br/>If using <b>LDAP</b>, your password is never stored and is only used to be verified against the LDAP server.</span>
				}
			]
		}
	}
	toggleExpansion(e, index) {
		const {qna} = this.state;
		const i = qna[index];
		if(i.expanded == null) i.expanded = true;
		else i.expanded = i.expanded !== true;
		this.setState({...qna});
	}

	render() {
		const {classes, theme} = this.props;
		const items = [];
		this.state.qna.forEach((i, index) => {
			items.push(
				<div key={index}>
					<ListItem button disableRipple value={i.id} onClick={(e) => this.toggleExpansion(e, index)} component={'li'}>
						<ListItemText primary={<span className={classes.title}>{i.q}</span>}/>
						<ListItemSecondaryAction>
							<Icon path={i.expanded === true ? mdiChevronUp : mdiChevronDown} size={1} color={theme.palette.primary.main}/>
						</ListItemSecondaryAction>
					</ListItem>
					<Collapse in={i.expanded} unmountOnExit timeout={"auto"}>
						<Typography component={'div'} className={classes.content} variant={"body1"}>{i.a}</Typography>
					</Collapse>
				</div>
			)
		});
		return (
			<div>
				<BackButton label={"Back to home"} to={"/"}/>
				<Center>
					<Avatar className={classes.avatar} component={Paper} src={`${process.env.PUBLIC_URL}/jmp.png`} alt={process.env.REACT_APP_APP_NAME}/>
				</Center>
				<Center>
					<Typography variant={"h4"} className={classes.name}>How can we help you?</Typography>
				</Center>
				<List component={'ul'}>
					{items}
				</List>
			</div>
		);
	}
}
export default withStyles(styles)(withTheme(Help));