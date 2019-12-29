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
import {ListSubheader, makeStyles, Theme} from "@material-ui/core";
import InfoItem from "../../../components/content/settings/InfoItem";
import Icon from "@mdi/react";
import {mdiFolderAccountOutline} from "@mdi/js";
import {useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
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

interface AuthInfo {
	connected: boolean;
	name: string;
	users: number;
	groups: number;
}

const Auth: React.FC = () => {
	const classes = useStyles();
	const theme = useTheme();

	let auth: AuthInfo | null;

	const [data, setData] = useState<ReactNode | null>(null);

	useEffect(() => {
		setData((
			<div>
				<p>Connected... {auth?.connected === true ? <span className={classes.statusOK}>Yes</span> :
					<span className={classes.statusFail}>No</span>}</p>
				<p>{auth?.name || "Unknown"} provides {auth?.users || 0} users and {auth?.groups || 0} groups.</p>
			</div>
		));
	}, []);

	return (
		<div>
			<ListSubheader className={classes.title} inset component={"div"}>Authentication</ListSubheader>
			<InfoItem open title={<span>Identity Provider</span>} content={data} icon={
				<Icon style={{paddingRight: 8}} path={mdiFolderAccountOutline} size={1}
				      color={theme.palette.success.dark}/>
			}/>
		</div>
	);
};

export default Auth;
