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

import React, {useEffect} from "react";
import {APP_NAME, client} from "../../../constants";
import {GENERIC_GET_TOKEN, getTokenEnd, getTokenFail, getTokenStart} from "../../../actions/Generic";
import {useDispatch, useSelector} from "react-redux";
import {CircularProgress, makeStyles} from "@material-ui/core";
import Center from "react-center";
import {withRouter} from "react-router-dom";

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
		backgroundColor: "transparent"
	}
}));

export const Token = ({history}) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const loading = useSelector(state => state.loading[GENERIC_GET_TOKEN]);
	const error = useSelector(state => state.errors[GENERIC_GET_TOKEN]);
	const {headers} = useSelector(state => state.auth);

	const jumpUser = () => {
		let url = new URL(window.location.href);
		let query = url.searchParams.get("query");
		const id = url.searchParams.get("id");
		if(query != null && query !== '') {
			getTokenStart(dispatch);
			if (id != null && id !== "")
				query += `?id=${id}`;
			// find out were we are going
			client.get(`/api/v2/jump/${query}`, {headers}).then(r => {
				getTokenEnd(dispatch);
				if (r.data.found === true)
					window.location.replace(r.data.location);
				else
					history.push(r.data.location);
			}).catch(err => {
				getTokenFail(dispatch, err.toString());
			});
		}
		else {
			getTokenFail(dispatch, "You must specify a query!");
		}
	};
	useEffect(() => {
		window.document.title = `${APP_NAME}`;
		jumpUser();
	}, []);
	const message = error != null ? error : "Jumping... You can close this window if it stays open";
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
