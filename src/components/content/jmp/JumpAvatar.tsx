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
 */

import {mdiAccountCircleOutline, mdiAccountGroupOutline, mdiEarth} from "@mdi/js";
import {Avatar, Theme, useTheme} from "@material-ui/core";
import Icon from "@mdi/react";
import {Skeleton} from "@material-ui/lab";
import React from "react";
import Img from "react-image";
import {makeStyles} from "@material-ui/core/styles";
import {Jump} from "../../../types";
import getHelpCardColour from "../../../selectors/getHelpCardColour";
import getColourFromHex from "../../../style/getColourFromHex";
import getAvatarFromPalette from "../../../selectors/getAvatarFromPalette";
import getAvatarScheme from "../../../style/getAvatarScheme";

const useStyles = makeStyles((theme: Theme) => ({
	avatar: {
		margin: theme.spacing(1),
		marginRight: theme.spacing(2)
	},
	image: {
		margin: theme.spacing(0.5)
	}
}));

interface JumpAvatarProps {
	jump: Jump;
	palette: any;
	loading: boolean;
	error: Error | null;
	size?: number;
}

const JumpAvatar: React.FC<JumpAvatarProps> = ({jump, palette, loading, error, size = 40}: JumpAvatarProps) => {
	// hooks
	const theme = useTheme<Theme>();
	const classes = useStyles();

	const personal = jump.public ? 0 : jump.owner != null ? 1 : 2;
	// set the appropriate colours for the card-content
	const avatarPalette = getAvatarFromPalette(theme, "", palette);
	let bg: string | null = getHelpCardColour(theme);
	if (!loading && error == null) {
		try {
			bg = getColourFromHex(avatarPalette.bg, 0.2);
		} catch (e) {
			console.error(e);
		} // this will probably only be thrown by firefox, so just swallow it
	}
	const scheme = getAvatarScheme(theme, personal);
	const avatar = {
		icon: personal === 0 ? mdiEarth : personal === 1 ? mdiAccountCircleOutline : mdiAccountGroupOutline,
		bg: scheme[0],
		fg: scheme[1]
	};
	return (
		<Avatar
			className={classes.avatar}
			style={{backgroundColor: bg || avatar.bg, color: avatarPalette.fg || avatar.fg, width: size, height: size}}>
			<Img
				className={classes.image}
				src={jump.image}
				loader={
					<Skeleton animation="wave" variant="circle" width={32} height={32}/>
				}
				unloader={
					<Icon path={avatar.icon} color={avatar.fg} size={1}/>
				}
			/>
		</Avatar>
	);
};
export default JumpAvatar;
