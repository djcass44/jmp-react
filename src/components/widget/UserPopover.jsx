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

import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";
import {Avatar} from "evergreen-ui";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},
	avatar: {
		padding: theme.spacing(2)
	},
	displayName: {
		fontFamily: "Manrope",
		fontWeight: 500,
		maxWidth: 175,
		width: 125
	}
}));

const UserPopover = ({user, elevation}) => {
	const classes = useStyles();
	return (
		<Paper elevation={elevation} className={classes.paper}>
			<Grid container spacing={1}>
				<Grid item xs={6}>
					<Avatar
						className={classes.avatar}
						name={(user && (user.displayName || user.username)) || "Anonymous"}
						src={user && user.avatarUrl}
						size={64}
					/>
				</Grid>
				<Divider orientation={"horizontal"}/>
				<Grid item xs={6} style={{float: "left"}}>
					<Typography className={classes.displayName} noWrap variant={"h6"}>
						{(user && (user.displayName || user.username)) || "Anonymous"}
					</Typography>
					{(user && user.username) != null && <Typography variant={"subtitle1"}>
						{user.username}
					</Typography>}
				</Grid>
			</Grid>
		</Paper>
	);
};
UserPopover.propTypes = {
	user: PropTypes.object,
	elevation: PropTypes.number
};
UserPopover.defaultProps = {
	user: null,
	elevation: 2
};
export default UserPopover;