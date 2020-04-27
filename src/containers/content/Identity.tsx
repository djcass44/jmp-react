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
import Center from "react-center";
import {Avatar, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import {APP_NAME} from "../../constants";
import Groups from "./identity/Groups";
import Users from "./identity/Users";

const useStyles = makeStyles((theme: Theme) => ({
	name: {
		fontFamily: "Manrope",
		fontWeight: 500,
		color: theme.palette.secondary.main,
		marginTop: theme.spacing(2)
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
	return (
		<div>
			<Center>
				<Avatar
					className={classes.avatar}
					component={Paper}
					src={`${process.env.PUBLIC_URL}/jmp2.png`}
					alt={APP_NAME}
				/>
			</Center>
			<Center>
				<img height={192} src="/draw/undraw_Group_chat_unwm.svg" alt=""/>
			</Center>
			<Center>
				<Typography variant="h4" className={classes.name}>Users &amp; Groups</Typography>
			</Center>
			<Users/>
			<Groups/>
		</div>
	);
};
export default Identity;
