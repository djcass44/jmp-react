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

import {Avatar, ListItemText, makeStyles, Theme} from "@material-ui/core";
import getAvatarScheme from "../../style/getAvatarScheme";
import {SentimentDissatisfied} from "@material-ui/icons";
import ListItem from "@material-ui/core/ListItem";
import React from "react";
import {useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	avatar: {
		marginRight: 12
	}
}));

const EmptyCard: React.FC = () => {
	const theme = useTheme<Theme>();
	const classes = useStyles();

	const scheme = getAvatarScheme(theme, 3);
	const avatar = {
		backgroundColor: scheme[0],
		color: scheme[1]
	};
	return (
		<ListItem key="null" component='li'>
			<Avatar className={classes.avatar} style={avatar}>
				<SentimentDissatisfied/>
			</Avatar>
			<ListItemText className={classes.title} primary="Nothing could be found."/>
		</ListItem>
	);
};
export default EmptyCard;
