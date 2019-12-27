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

import {IconButton, Theme, Tooltip} from "@material-ui/core";
import Icon from "@mdi/react";
import React from "react";
import {mdiCircleSmall} from "@mdi/js";
import {useTheme} from "@material-ui/styles";

interface JumpButtonProps {
	title: string;
	focus: boolean;
	mouse: boolean;
	focusProps: any;
	buttonProps: any;
	iconProps: any;
}

const JumpButton: React.FC<JumpButtonProps> = ({title, focus = false, mouse = true, focusProps, buttonProps, iconProps}: JumpButtonProps) => {
	const theme = useTheme<Theme>();
	return (
		<div>
			<Tooltip title={title}>
				<IconButton
					centerRipple={false}
					{...focusProps}
					{...buttonProps}>
					{(focus || mouse) ?
						<Icon size={0.85} {...iconProps} />
						:
						<Icon path={mdiCircleSmall} size={0.85} color={theme.palette.text.secondary}/>
					}
				</IconButton>
			</Tooltip>
		</div>
	);
};
export default JumpButton;
