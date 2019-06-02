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
import {getInfoAuth, getInfoProp} from "../../../actions/Info";
import {FormControlLabel, ListSubheader, Switch, TextField, withStyles, withTheme} from "@material-ui/core";
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

class Auth extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: props.headers,
			conf: props.conf,
			auth: props.auth,
			props: [
				'ldap',
				'ldap.host',
				'ldap.port',
				'ldap.context',
				'ldap.user',
				'jmp.ldap.max_failure',
				'jmp.ldap.remove_stale',
				'jmp.ldap.sync_rate',
				'jmp.ldap.user_query',
				'jmp.ldap.user_id',
				'jmp.ldap.group_query',
				'jmp.ldap.group_filter',
				'jmp.ldap.group_uid',
				'jmp.ldap.auth_reconnect',
				'jmp.ext.block_local'
			]
		}
	}
	componentDidMount() {
		this.props.getInfoAuth(this.state.headers);
		this.state.props.forEach(i => {
			this.props.getInfoProp(this.state.headers, i);
		});
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}

	render() {
		const {classes, theme} = this.props;
		// const propItems = [];
		// console.log(this.state.conf);
		// for (const it in this.state.conf) {
		// 	if(!this.state.conf.hasOwnProperty(it)) continue;
		// 	const key = it.key;
		// 	const value = it.value;
		// 	console.log(key, value);
		// 	if(typeof value === 'boolean') {
		// 		propItems.push(
		// 			<div key={key}>
		// 				<FormControlLabel control={
		// 					<Switch checked={value}/>
		// 				} label={key}/>
		// 			</div>
		// 		)
		// 	}
		// 	else {
		// 		propItems.push(
		// 			<div key={key}>
		// 				<TextField value={value} label={key} fullWidth/>
		// 			</div>
		// 		)
		// 	}
		// }
		const auth = (
			<div>
				<p>Connected... {this.state.auth['connected'] === true ? <span className={classes.statusOK}>Yes</span> : <span className={classes.statusFail}>No</span>}</p>
				<p>LDAP is providing {this.state.auth['users']} users and {this.state.auth['groups']} groups.</p>
				{/*<div>*/}
				{/*	{propItems}*/}
				{/*</div>*/}
			</div>
		);
		return (
			<div>
				<ListSubheader className={classes.title} inset component={"div"}>Authentication</ListSubheader>
				<InfoItem title={"LDAP (read-only)"} content={auth} icon={
					<Icon style={{paddingRight: 8}} path={mdiFolderAccountOutline} size={1} color={theme.palette.success.dark}/>
				}/>
			</div>
		);
	}

}
const mapStateToProps = state => ({
	conf: state.info.conf,
	auth: state.info.auth,
	headers: state.auth.headers
});
const mapDispatchToProps = ({
	getInfoProp,
	getInfoAuth
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(Auth)));