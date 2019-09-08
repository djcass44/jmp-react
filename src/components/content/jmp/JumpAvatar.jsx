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

import getAvatarScheme from "../../../style/getAvatarScheme";
import {mdiAccountCircleOutline, mdiAccountGroupOutline, mdiEarth} from "@mdi/js";
import getAvatarFromPalette from "../../../selectors/getAvatarFromPalette";
import {useTheme} from "@material-ui/styles";
import ReactImageFallback from "react-image-fallback";
import Icon from "@mdi/react";
import {Avatar} from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";

const JumpAvatar = ({jump, background, palette, loading, error}) => {
	// hooks
	const theme = useTheme();

	const scheme = getAvatarScheme(theme, jump.personal);
	let icon;
	switch (jump.personal) {
		default:
			icon = mdiEarth;
			break;
		case 1:
			icon = mdiAccountCircleOutline;
			break;
		case 2:
			icon = mdiAccountGroupOutline;
			break;
	}
	const avatarPalette = getAvatarFromPalette(theme, icon, palette);
	const avatar = loading === false && error == null ? {
		icon: icon,
		bg: background ? avatarPalette.bg : "transparent",
		fg: avatarPalette.fg
	} : {
		icon: icon,
		bg: background ? scheme[0] : "transparent",
		fg: scheme[1]
	};
	return (
		<Avatar component={"div"} style={{backgroundColor: avatar.bg, color: avatar.fg, marginRight: 12}}>
			<ReactImageFallback style={{borderRadius: 64}} src={jump.image} fallbackImage={
				<Icon path={avatar.icon} color={avatar.fg} size={1}/>
			} initialImage={
				<Icon path={avatar.icon} color={avatar.fg} size={1}/>
			}/>
		</Avatar>
	);
};
JumpAvatar.propTypes = {
	jump: PropTypes.object.isRequired,
	background: PropTypes.bool
};
JumpAvatar.defaultProps = {
	background: true
};
export default JumpAvatar;
