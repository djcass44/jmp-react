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

import React, {useEffect} from "react";
import {getInfoAuth} from "../../../actions/Info";
import {ListSubheader, withStyles, withTheme} from "@material-ui/core";
import {connect} from "react-redux";
import InfoItem from "../../../components/content/settings/InfoItem";
import Icon from "@mdi/react";
import {mdiFolderAccountOutline} from "@mdi/js";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	content: {
		fontSize: 14,
		flex: 1
	},
	grow: {flexGrow: 1},
	statusOK: {
		color: theme.palette.success.main
	},
	statusFail: {
		color: theme.palette.error.main
	},
});

const Auth = props => {
	useEffect(() => {
		props.getInfoAuth(props.headers);
	});

	const {classes, theme} = props;
	const auth = (
		<div>
			<p>Connected... {props.auth['connected'] === true ? <span className={classes.statusOK}>Yes</span> : <span className={classes.statusFail}>No</span>}</p>
			<p>{props.auth['name']} provides {props.auth['users']} users and {props.auth['groups']} groups.</p>
		</div>
	);
	return (
		<div>
			<ListSubheader className={classes.title} inset component={"div"}>Authentication</ListSubheader>
			<InfoItem title={"Identity Provider (read-only)"} content={auth} icon={
				<Icon style={{paddingRight: 8}} path={mdiFolderAccountOutline} size={1} color={theme.palette.success.dark}/>
			}/>
		</div>
	);
};
const mapStateToProps = state => ({
	auth: state.info.auth,
	headers: state.auth.headers
});
const mapDispatchToProps = ({
	getInfoAuth
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(Auth)));
