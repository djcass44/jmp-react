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

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {IconButton, makeStyles, withTheme} from "@material-ui/core";
import Icon from "@mdi/react";
import {mdiHelpCircleOutline} from "@mdi/js";
import {Avatar} from "evergreen-ui";
import LinearProgress from "@material-ui/core/LinearProgress";
import React from "react";
import getIconColour from "../style/getIconColour";
import {APP_NAME} from "../constants";

// THIS CLASS CANNOT BE CONVERTED TO TYPESCRIPT UNTIL EVERGREEN-UI HAS TYPE DEFINITIONS

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
	grow: {
		flexGrow: 1
	},
	progress: {
		flex: 1,
		backgroundColor: theme.palette.background.default
	},
	avatar: {
		marginTop: 4
	}
}));

export const NavLoading = ({theme}) => {
	const classes = useStyles();
	return (
		<div>
			<AppBar position={"static"} color={"default"}>
				<Toolbar>
					<Typography className={classes.title} variant={"h6"} color={"inherit"}>
						{APP_NAME}
					</Typography>
					<Typography className={classes.title} style={{fontWeight: 300}} variant={"h6"} color={"inherit"}>
						{process.env.REACT_APP_APP_MSG}
					</Typography>
					<div className={classes.grow}/>
					<div className={classes.sectionDesktop}>
						<IconButton centerRipple={false} color={"inherit"}>
							<Icon path={mdiHelpCircleOutline} size={1} color={getIconColour(theme)}/>
						</IconButton>
					</div>
					<Avatar size={40} className={classes.avatar} />
				</Toolbar>
			</AppBar>
			<LinearProgress className={classes.progress}/>
		</div>
	);
};
export default withTheme(NavLoading);