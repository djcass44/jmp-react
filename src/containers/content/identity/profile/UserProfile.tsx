/*
 *    Copyright 2020 Django Cass
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
import {Avatar} from "evergreen-ui";
import {Button, makeStyles, Theme, Typography} from "@material-ui/core";
import Center from "react-center";
import {User} from "../../../../types";

const useStyles = makeStyles((theme: Theme) => ({
	avatar: {
		padding: theme.spacing(2),
		margin: theme.spacing(1)
	},
	root: {
		width: "100%",
		minWidth: 350
	},
	displayName: {
		fontFamily: "Manrope",
		fontWeight: 600
	},
	username: {
		fontSize: 14
	},
	addButton: {
		borderRadius: theme.spacing(3),
		margin: theme.spacing(2),
		textTransform: "none",
		fontFamily: "Manrope",
		fontWeight: 600,
		fontSize: 13,
		height: 36
	}
}));

interface UserProfileProps {
	user: User | null;
	isAdmin?: boolean;
	settingsProps?: object;
}

const UserProfile: React.FC<UserProfileProps> = ({user, isAdmin = false, settingsProps}) => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Center>
				<Avatar
					className={classes.avatar}
					name={user?.displayName || user?.username || "Anonymous"}
					src={user?.avatarUrl || undefined}
					size={72}
				/>
			</Center>
			<Typography
				className={classes.displayName}
				color="textPrimary"
				align="center">
				{user?.displayName || user?.username || "Anonymous"}
			</Typography>
			<Typography
				className={classes.username}
				color="textSecondary"
				align="center">
				{user?.username || "Anonymous"}
			</Typography>
			<Center>
				<Button
					className={classes.addButton}
					variant="outlined"
					{...settingsProps}>
					{isAdmin ? "Account and configuration" : "Manage your JMP Account"}
				</Button>
			</Center>
		</div>
	);
};
export default UserProfile;