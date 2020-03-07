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

import React, {useState} from "react";
import {Card, CardActions, CardContent, Theme, Tooltip, Typography, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {User} from "../../../../types";
import {Avatar} from "evergreen-ui";
import Icon from "@mdi/react";
import {mdiAccountOutline, mdiAccountSupervisor, mdiDotsVertical} from "@mdi/js";
import getIconColour from "../../../../style/getIconColour";
import IconButton from "@material-ui/core/IconButton";
import {getProviderData} from "../../../../util";

const useStyles = makeStyles((theme: Theme) => ({
	avatar: {
		margin: 16
	},
	root: {
		display: 'flex',
		borderRadius: 12
	},
	details: {
		display: 'flex',
		flexDirection: 'column',
	},
	content: {
		flex: '1 0 auto',
	},
	displayName: {
		fontFamily: "Manrope",
		fontWeight: 600
	},
	username: {
		fontSize: 14
	},
	actions: {
		float: "right",
		flexGrow: 1,
		marginRight: theme.spacing(1.5)
	},
	icons: {
		marginTop: theme.spacing(0.5)
	},
	icon: {
		marginTop: theme.spacing(0.5),
		marginRight: theme.spacing(0.5)
	}
}));

interface UserCardProps {
	user: User;
	selected?: boolean;
	setAnchorEl?: (e: any) => void;
}

const UserCard: React.FC<UserCardProps> = ({user, selected = false, setAnchorEl}) => {
	// hooks
	const classes = useStyles();
	const theme = useTheme();

	// local state
	const [providers] = useState<any>(getProviderData(theme));

	return (
		<div>
			<Card
				className={classes.root}
				elevation={0}>
				<Avatar
					className={classes.avatar}
					name={user?.displayName || user?.username || "Anonymous"}
					src={user?.avatarUrl || undefined}
					size={72}>
				</Avatar>
				<div className={classes.details}>
					<CardContent className={classes.content}>
						<Typography
							className={classes.displayName}
							color="textPrimary">
							{user.displayName || user.username}
						</Typography>
						<Typography
							className={classes.username}
							color="textSecondary">
							@{user.username}
						</Typography>
						<div className={classes.icons}>
							<Tooltip className={classes.icon} title={providers[user.source]?.name || user.source}>
								<Icon path={providers[user.source]?.icon || mdiAccountOutline} size={1}
								      color={providers[user.source]?.colour || theme.palette.primary.main}/>
							</Tooltip>
							{user.admin && <Tooltip className={classes.icon} title="This user is an administrator">
								<Icon path={mdiAccountSupervisor} color={theme.palette.error.main} size={1}/>
							</Tooltip>}
						</div>
					</CardContent>
				</div>
				<CardActions className={classes.actions}>
					<div style={{width: "100%"}}/>
					<IconButton centerRipple={false} onClick={(e) => setAnchorEl?.(e)}>
						<Icon path={mdiDotsVertical} size={1} color={getIconColour(theme)}/>
					</IconButton>
				</CardActions>
			</Card>
		</div>
	);
};
export default UserCard;
