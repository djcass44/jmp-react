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
import Users from "./identity/Users";
import Groups from "./identity/Groups";
import Center from "react-center";
import Avatar from "@material-ui/core/Avatar";
import {makeStyles, Paper, Theme} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
import Icon from "@mdi/react";
import {mdiAccountGroupOutline} from "@mdi/js";
import Typography from "@material-ui/core/Typography";
import {APP_NAME} from "../../constants";

const useStyles = makeStyles((theme: Theme) => ({
	name: {
		fontFamily: "Manrope",
		fontWeight: 500,
		color: theme.palette.secondary.main
	},
	avatar: {
		width: 56,
		height: 56,
		borderRadius: 100,
		margin: 24,
		padding: 6
	}
}));

const Identity: React.FC = () => {
	useEffect(() => {
		window.document.title = `Identity - ${APP_NAME}`;
	}, []);

	const classes = useStyles();
	const theme = useTheme<Theme>();
	return (
		<div>
			<Center>
				<Avatar className={classes.avatar} style={{backgroundColor: theme.palette.background.paper}}
				        component={Paper}>
					<Icon path={mdiAccountGroupOutline} size={2} color={theme.palette.primary.main}/>
				</Avatar>
			</Center>
			<Center>
				<Typography variant={"h4"} className={classes.name}>Users &amp; Groups</Typography>
			</Center>
			<Users/>
			<Groups/>
		</div>
	);
};
export default Identity;
