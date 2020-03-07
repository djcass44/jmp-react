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
import {Avatar, Theme, Tooltip, Typography, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {Group} from "../../../../types";
import Icon from "@mdi/react";
import {mdiAccountGroupOutline, mdiAccountOutline, mdiDotsVertical, mdiGlobeModel} from "@mdi/js";
import getIconColour from "../../../../style/getIconColour";
import IconButton from "@material-ui/core/IconButton";
import {getProviderData} from "../../../../util";
import IdentityCard from "./IdentityCard";
import getAvatarScheme from "../../../../style/getAvatarScheme";

const useStyles = makeStyles((theme: Theme) => ({
	avatar: {
		margin: 16
	},
	displayName: {
		fontFamily: "Manrope",
		fontWeight: 600
	},
	username: {
		fontSize: 14
	},
	icons: {
		marginTop: theme.spacing(0.5)
	},
	icon: {
		marginTop: theme.spacing(0.5),
		marginRight: theme.spacing(0.5)
	}
}));

interface GroupCardProps {
	group: Group;
	setAnchorEl?: (e: any) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({group, setAnchorEl}) => {
	// hooks
	const classes = useStyles();
	const theme = useTheme();

	// local state
	const [providers] = useState<any>(getProviderData(theme));

	// get the colour scheme
	const scheme = getAvatarScheme(theme, 2);


	const avatar = (
		<Avatar
			className={classes.avatar}
			style={{backgroundColor: scheme[0], color: scheme[1]}}>
			<Icon
				path={mdiAccountGroupOutline}
				size={1}
				color={scheme[1]}
			/>
		</Avatar>
	);

	const content = (<>
		<Typography
			className={classes.displayName}
			color="textPrimary">
			{group.name}
		</Typography>
		<Typography
			className={classes.username}
			color="textSecondary">
			{providers[group.name]?.name}
		</Typography>
		<div className={classes.icons}>
			<Tooltip className={classes.icon} title={providers[group.source]?.name || group.source}>
				<Icon path={providers[group.source]?.icon || mdiAccountOutline} size={1}
				      color={providers[group.source]?.colour || theme.palette.primary.main}/>
			</Tooltip>
			{group.public && <Tooltip className={classes.icon} title="This group is public">
				<Icon path={mdiGlobeModel} color={theme.palette.primary.main} size={1}/>
			</Tooltip>}
		</div>
	</>);

	const actions = (<>
		<IconButton centerRipple={false} onClick={(e) => setAnchorEl?.(e)}>
			<Icon path={mdiDotsVertical} size={1} color={getIconColour(theme)}/>
		</IconButton>
	</>);

	return (<IdentityCard avatar={avatar} content={content} actions={actions}/>);
};
export default GroupCard;
