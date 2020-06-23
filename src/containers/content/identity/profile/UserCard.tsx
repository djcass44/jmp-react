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

import React, {useMemo, useState} from "react";
import {makeStyles, Typography, useTheme} from "@material-ui/core";
import {mdiAccountOutline, mdiAccountSupervisor, mdiDotsVertical} from "@mdi/js";
import {GenericIconButton} from "jmp-coreui";
import getIconColour from "../../../../style/getIconColour";
import {getProviderData, Provider} from "../../../../util";
import {SimpleMap, User} from "../../../../types";
import UserAvatar from "../../../../components/identity/UserAvatar";
import IdentityCard from "./IdentityCard";

const useStyles = makeStyles(() => ({
	displayName: {
		fontFamily: "Manrope",
		fontWeight: 600
	},
	username: {
		fontSize: 14
	}
}));

interface UserCardProps {
	user: User;
	setAnchorEl?: (e: EventTarget & HTMLButtonElement) => void;
}

const UserCard: React.FC<UserCardProps> = ({user, setAnchorEl}) => {
	// hooks
	const classes = useStyles();
	const theme = useTheme();

	// local state
	const [providers] = useState<SimpleMap<Provider>>(getProviderData(theme));
	const displayName = useMemo(() => user?.displayName || user?.username || "Anonymous", [user]);

	const avatar = (
		<UserAvatar
			text={displayName}
			src={user?.avatarUrl}
		/>
	);

	const primary = (
		<Typography
			className={classes.displayName}
			color="textPrimary">
			{user.displayName || user.username}
		</Typography>
	);

	const source: Provider | null = providers[user.source];
	const actions = (<>
		{user.admin && <GenericIconButton
			title="This user is an administrator"
			icon={mdiAccountSupervisor}
			colour={theme.palette.error.main}
		/>}
		<GenericIconButton
			title={source?.name || user.source}
			icon={source?.icon || mdiAccountOutline}
			colour={source?.colour || theme.palette.primary.main}
		/>
		<GenericIconButton
			title="Options"
			icon={mdiDotsVertical}
			colour={getIconColour(theme)}
			onClick={e => setAnchorEl?.(e.currentTarget)}
		/>
	</>);

	return (
		<IdentityCard
			avatar={avatar}
			primary={primary}
			secondary={user.displayName !== user.username && `@${user.username}`}
			actions={actions}
		/>
	);
};
export default UserCard;
