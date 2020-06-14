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

import React, {useMemo} from "react";
import {Avatar, Button, makeStyles, Theme, Typography, useTheme} from "@material-ui/core";
import Center from "react-center";
import {GetColor} from "@tafalk/material-color-generator";
import {User} from "../../../../types";
import {getInitials} from "../../../../util";

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
	// hooks
	const classes = useStyles();
	const theme = useTheme();

	// local state
	const displayName = useMemo(() => user?.displayName || user?.username || "Anonymous", [user]);
	const displayColour = useMemo(() => `#${GetColor(displayName, theme.palette.type)}`, [displayName, theme.palette.type]);

	return (
		<div className={classes.root}>
			<Center>
				<Avatar
					className={classes.avatar}
					style={{backgroundColor: displayColour, color: theme.palette.getContrastText(displayColour)}}
					alt={user?.avatarUrl ? displayName : undefined}
					src={user?.avatarUrl || undefined}>
					{getInitials(displayName)}
				</Avatar>
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