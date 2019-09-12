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

import React, {useEffect, useState} from "react";
import {APP_NAME} from "../../../constants";
import {useDispatch, useSelector} from "react-redux";
import {CircularProgress, makeStyles} from "@material-ui/core";
import Center from "react-center";
import {withRouter} from "react-router-dom";
import {GET_TARGET, getTargetJump} from "../../../actions/Jumps";

const useStyles = makeStyles(theme => ({
	text: {
		color: theme.palette.text.primary
	},
	overlay: {
		position: "fixed",
		width: "100%",
		height: "100%",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "transparent",
		pointerEvents: "none"
	}
}));

export const Token = ({history}) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const loading = useSelector(state => state.loading[GET_TARGET]);
	const error = useSelector(state => state.errors[GET_TARGET]);
	const {headers} = useSelector(state => state.auth);
	const {target} = useSelector(state => state.jumps);

	const [failure, setFailure] = useState(error);

	const jumpUser = () => {
		let url = new URL(window.location.href);
		let query = url.searchParams.get("query");
		const id = url.searchParams.get("id");
		if(query != null && query !== '') {
			if (id != null && id !== "")
				query += `?id=${id}`;
			// find out were we are going
			getTargetJump(dispatch, headers, query);
		} else
			setFailure("You must specify a query!");
	};
	// initial hook run on start (componentdidmount)
	useEffect(() => {
		window.document.title = `${APP_NAME}`;
		jumpUser();
	}, []);

	// hook which checks for a result from getTargetJump
	useEffect(() => {
		if (loading === false && error == null && target != null) {
			if (target.found === true)
				window.location.replace(target.location);
			else
				history.push(target.location);
		}
	}, [loading, error, target]);

	const message = (error != null || failure != null) ? (error || failure) : "Jumping... You can close this window if it stays open";
	return (
		<Center className={classes.overlay}>
			{loading === true ?
				<CircularProgress/>
				:
				<span className={classes.text}>{message}</span>
			}
		</Center>
	);
};
export default withRouter(Token);
