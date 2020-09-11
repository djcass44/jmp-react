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
import {Avatar, makeStyles, Typography, useTheme} from "@material-ui/core";
import Icon from "@mdi/react";
import {mdiAccountGroupOutline, mdiEarth, mdiEyeOff, mdiPencilOutline, mdiWidgets} from "@mdi/js";
import {useDispatch} from "react-redux";
import {GenericIconButton} from "jmp-coreui";
import getAvatarScheme from "../../../../style/getAvatarScheme";
import {MODAL_GROUP_EDIT, setDialog} from "../../../../store/actions/Modal";
import {getProviderData, Provider} from "../../../../util";
import getIconColour from "../../../../style/getIconColour";
import {Group, SimpleMap} from "../../../../types";
import IdentityCard from "./IdentityCard";

const useStyles = makeStyles(() => ({
	avatar: {},
	displayName: {
		fontFamily: "Manrope",
		fontWeight: 600
	},
	username: {
		fontSize: 14
	}
}));

interface GroupCardProps {
	group: Group;
	isAdmin?: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({group, isAdmin = false}): JSX.Element => {
	// hooks
	const classes = useStyles();
	const theme = useTheme();
	const dispatch = useDispatch();

	// local state
	const [providers] = useState<SimpleMap<Provider>>(getProviderData(theme));

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

	const provider = providers[group.defaultFor || group.source];

	const secondary = (group.public || group.defaultFor != null) ?
		(group.public
			? ["Public", mdiEarth, theme.palette.primary.main]
			: [`Default for ${provider?.name || group.defaultFor} users`, mdiWidgets, theme.palette.info.main])
		: ["Private", mdiEyeOff, theme.palette.secondary.main];

	const primary = (
		<Typography
			className={classes.displayName}
			color="textPrimary">
			{group.name}
		</Typography>
	);

	const content = provider?.name || group.source;

	const actions = (<>
		<GenericIconButton
			title={secondary[0]}
			icon={secondary[1]}
			colour={secondary[2]}
		/>
		{isAdmin && !group.name.startsWith("_") && <GenericIconButton
			title="Edit group"
			icon={mdiPencilOutline}
			colour={getIconColour(theme)}
			onClick={() => dispatch(setDialog(MODAL_GROUP_EDIT, true, {group}))}
		/>}
	</>);

	return (<IdentityCard avatar={avatar} primary={primary} secondary={content} actions={actions}/>);
};
export default GroupCard;
