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
import {BASE_URL} from "../../constants";
import {useTheme} from "@material-ui/styles";

const useStyles = makeStyles(() => ({
	button: {
		fontFamily: "Manrope",
		fontWeight: 500,
		margin: 4
	}
}));

const SocialButton = ({id, colour, name, icon}: {id: string, colour: string, name: string, icon: string}) => {
	const {palette} = useTheme();
	const classes = useStyles();
	const colourOverride = palette.type === "dark" ? {backgroundColor: palette.secondary.main} : {};
	return (
		<Button href={`${BASE_URL}/api/v2/oauth2/authorise?provider=${id}`} className={classes.button} style={colourOverride}>
			<Icon path={icon} size={1} color={colour}/>
			{name}
		</Button>
	);
};
export default SocialButton;