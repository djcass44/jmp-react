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
import {Avatar, useTheme} from "@material-ui/core";
import {GetColor} from "@tafalk/material-color-generator";
import {getInitials} from "../../util";

interface UserAvatarProps {
	className?: string;
	text: string;
	src?: string;
	setAnchorEl?: (e: HTMLElement) => void;
}

const oppositeType = (type: "light" | "dark"): "light" | "dark" => {
	if (type === "light")
		return "dark";
	else
		return "light";
};

const UserAvatar: React.FC<UserAvatarProps> = ({className, text, src, setAnchorEl}): JSX.Element => {
	// hooks
	const theme = useTheme();

	// local state
	const colour = useMemo(() => `#${GetColor(text, theme.palette.type)}`, [text, theme.palette.type]);
	const colourAlt = useMemo(() => `#${GetColor(text, oppositeType(theme.palette.type))}`, [text, theme.palette.type]);

	return (
		<Avatar
			className={className}
			style={{
				backgroundColor: colour,
				color: colourAlt
			}}
			alt={src ? text : undefined}
			src={src || undefined}
			onClick={(e: React.MouseEvent<HTMLElement>) => setAnchorEl?.(e.currentTarget)}
			aria-haspopup={setAnchorEl != null}>
			{getInitials(text)}
		</Avatar>
	);
};
export default UserAvatar;
