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
 *
 */

import * as React from "react";
import {Button, makeStyles} from "@material-ui/core";
import Icon from "@mdi/react";
import {useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	button: {
		fontFamily: "Manrope",
		fontWeight: 500,
		margin: 4,
		// the below 2 should be merged in some way
		backgroundColor: theme.palette.type === "dark" ? theme.palette.secondary.main : theme.palette.background.default,
		color: theme.palette.getContrastText(theme.palette.type === "dark" ? theme.palette.secondary.main : theme.palette.background.default),
		textTransform: "capitalize"
	},
	icon: {
		paddingLeft: 8,
		paddingRight: 8
	},
	text: {
		paddingLeft: 8
	}
}));

interface SocialButtonProps {
	url: string;
	colour: string;
	name: string;
	icon: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({url, colour, name, icon}: SocialButtonProps) => {
	const theme = useTheme();
	const classes = useStyles();
	const variant = theme.palette.type === "dark" ? "contained" : "text";
	return (
		<Button href={url} className={classes.button} variant={variant}>
			<Icon className={classes.icon} path={icon} size={"1.5rem"} color={colour}/>
			{name}
		</Button>
	);
};
export default SocialButton;
