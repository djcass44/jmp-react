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
						name={user.name || "Anonymous"}
						src={user.avatarUrl}
						size={64}
					/>
				</Grid>
				<Divider orientation={"horizontal"}/>
				<Grid item xs={6} style={{float: "left"}}>
					<Typography variant={"h6"}>
						{user.displayName || "Anonymous"}
					</Typography>
					{user.username != null && <Typography variant={"subtitle1"}>
						{user.username}
					</Typography>}
				</Grid>
			</Grid>
		</Paper>
	);
};
UserPopover.propTypes = {
	user: PropTypes.object.isRequired,
	elevation: PropTypes.number
};
UserPopover.defaultProps = {
	elevation: 2
};
export default UserPopover;