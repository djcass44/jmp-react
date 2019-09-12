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
import {ListSubheader, makeStyles} from "@material-ui/core";
import {connect} from "react-redux";
import InfoItem from "../../../components/content/settings/InfoItem";
import Icon from "@mdi/react";
import {mdiFolderAccountOutline} from "@mdi/js";
import {useTheme} from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope", fontWeight: 500
	},
	content: {
		fontSize: 14,
		flex: 1
	},
	statusOK: {
		color: theme.palette.success.main
	},
	statusFail: {
		color: theme.palette.error.main
	},
}));

const Auth = ({auth, headers, ...props}) => {
	useEffect(() => {
		props.getInfoAuth(headers);
	}, []);

	const classes = useStyles();
	const theme = useTheme();
	const content = (
		<div>
			<p>Connected... {auth['connected'] === true ? <span className={classes.statusOK}>Yes</span> : <span className={classes.statusFail}>No</span>}</p>
			<p>{auth['name']} provides {auth['users']} users and {auth['groups']} groups.</p>
		</div>
	);
	return (
		<div>
			<ListSubheader className={classes.title} inset component={"div"}>Authentication</ListSubheader>
			<InfoItem title={<span>Identity Provider</span>} content={content} icon={
				<Icon style={{paddingRight: 8}} path={mdiFolderAccountOutline} size={1} color={theme.palette.success.dark}/>
			}/>
		</div>
	);
};
Auth.propTypes = {
	auth: PropTypes.object.isRequired,
	headers: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
	auth: state.info.auth,
	headers: state.auth.headers
});
const mapDispatchToProps = ({
	getInfoAuth
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Auth);
