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
import Icon from "@mdi/react";
import {mdiArrowLeft} from "@mdi/js";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import {makeStyles} from "@material-ui/core";
import {Link, withRouter} from "react-router-dom";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope", fontWeight: 500,
		color: theme.palette.grey.A700
	},
}));

function BackButton(props) {
	const classes = useStyles();
	return (
		<div>
			<IconButton component={Link} to={props.to} centerRipple={false}><Icon path={mdiArrowLeft} size={1}/></IconButton>
			<span className={classes.title}>{props.label != null ? props.label : "Back"}</span>
		</div>
	)
}
export default withRouter(BackButton);