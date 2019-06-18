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
import {FormControlLabel, ListSubheader, Switch, withStyles, withTheme} from "@material-ui/core";
import InfoItem from "../../../components/content/settings/InfoItem";
import {LS_DARK} from "../../../constants";
import Button from "@material-ui/core/Button";
import Icon from "@mdi/react";
import {mdiSettingsOutline} from "@mdi/js";
import Badge from "@material-ui/core/Badge";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	content: {
		fontSize: 14,
		flex: 1
	},
	grow: {flexGrow: 1}
});

class General extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dark: localStorage.getItem(LS_DARK) === 'true' || false,
			darkLS: localStorage.getItem(LS_DARK) === 'true' || false // Doesn't change
		};
		this.handleDarkChange = this.handleDarkChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	handleDarkChange(value) {
		this.setState({dark: value.target.checked});
	}
	handleSave() {
		localStorage.setItem(LS_DARK, this.state.dark.toString());
		window.location.reload(); // Chad refresh
	}

	render() {
		const {classes, theme} = this.props;
		const visual = (
			<div>
				<p style={{color: theme.palette.error.main}}>BETA: This feature is incomplete and will lead to graphical issues.</p>
				<FormControlLabel control={
					<Switch checked={this.state.dark} onChange={this.handleDarkChange}/>
				} label={"Dark theme"}/>
				<Button variant={"contained"} color={"primary"} disabled={this.state.dark === this.state.darkLS} onClick={this.handleSave}>Save</Button>
			</div>
		);
		return (
			<div>
				<ListSubheader className={classes.title} inset component={"div"}>General</ListSubheader>
				<InfoItem title={<Badge color={"primary"} badgeContent={"BETA"}>Visuals & theme</Badge>} content={visual} icon={
					<Icon style={{paddingRight: 8}} path={mdiSettingsOutline} size={1} color={theme.palette.primary.main}/>
				}/>
			</div>
		)
	}
}
export default withStyles(styles)(withTheme(General));
