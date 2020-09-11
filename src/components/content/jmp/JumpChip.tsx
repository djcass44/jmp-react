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
import {Avatar, Chip, makeStyles, Theme, Tooltip, useTheme} from "@material-ui/core";
import Img from "react-image";
import {Skeleton} from "@material-ui/lab";
import Icon from "@mdi/react";
import {Link} from "react-router-dom";
import {usePalette} from "react-palette";
import {mdiAccountCircleOutline, mdiAccountGroupOutline, mdiEarth} from "@mdi/js";
import {Jump} from "../../../types";
import getAvatarFromPalette from "../../../selectors/getAvatarFromPalette";
import getHelpCardColour from "../../../selectors/getHelpCardColour";
import getColourFromHex from "../../../style/getColourFromHex";
import getSafeTextColour from "../../../selectors/getSafeTextColour";
import getAvatarScheme from "../../../style/getAvatarScheme";

const useStyles = makeStyles((theme: Theme) => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	chip: {
		margin: theme.spacing(0.5),
		fontFamily: "Manrope",
		fontWeight: 500
	}
}));

interface JumpChipProps {
	jump: Jump;
}

const JumpChip: React.FC<JumpChipProps> = ({jump}): JSX.Element => {
	// hooks
	const theme = useTheme();
	const classes = useStyles();

	const personal = jump.public ? 0 : jump.owner != null ? 1 : 2;
	const {data, loading, error} = usePalette(jump.image || "");
	// set the appropriate colours for the card-content
	const avatarPalette = getAvatarFromPalette(theme, "", data);
	let bg: string | null = getHelpCardColour(theme);
	if (!loading && error == null) {
		try {
			bg = getColourFromHex(avatarPalette.bg, 0.2);
		} catch (e) {
			console.error(e);
		} // this will probably only be thrown by firefox, so just swallow it
	}
	const scheme = getAvatarScheme(theme, personal);
	const textStyle = {
		color: getSafeTextColour(theme, bg, theme.palette.getContrastText(scheme[0]))
	};
	const avatar = {
		icon: personal === 0 ? mdiEarth : personal === 1 ? mdiAccountCircleOutline : mdiAccountGroupOutline,
		bg: scheme[0],
		fg: scheme[1]
	};

	return (
		<Tooltip
			disableFocusListener
			title={jump.location}
			placement="bottom"
			interactive
			key={`${jump.id}${jump.name}`}>
			<Chip
				avatar={<Avatar style={{backgroundColor: bg || avatar.bg, color: avatarPalette.fg || avatar.fg}}>
					{/* Website icon or MDI icon fallback */}
					<Img
						src={jump.image}
						loader={<Skeleton animation="wave" variant="circle" width={32} height={32}/>}
						unloader={<Icon path={avatar.icon} color={avatar.fg} size={1}/>}
					/>
				</Avatar>}
				label={<span style={textStyle}>{jump.name}</span>}
				clickable
				component={Link}
				to={`/jmp?query=${jump.name}&id=${jump.id}`}
				style={{backgroundColor: bg || avatar.bg, color: avatar.fg}}
				className={classes.chip}/>
		</Tooltip>
	);
};
export default JumpChip;
