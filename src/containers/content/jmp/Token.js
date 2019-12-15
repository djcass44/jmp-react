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
import {APP_NAME, client} from "../../../constants";
import {useDispatch, useSelector} from "react-redux";
import {CircularProgress, makeStyles} from "@material-ui/core";
import Center from "react-center";
import {GET_TARGET} from "../../../actions/Jumps";

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

export default ({history}) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const loading = useSelector(state => state.loading[GET_TARGET]);
	const error = useSelector(state => state.errors[GET_TARGET]);
	const {headers} = useSelector(state => state.auth);

	const [failure, setFailure] = useState(error);

	/**
	 * Handle the api response and move us to where we need to go
	 * @param target
	 */
	const handleTargetResponse = target => {
		if (target.found === true) {
			// we're leaving jmp, so use the window api call
			window.location.replace(target.location);
		} else {
			// use the router push for performance
			history.push(target.location);
		}
	};

	/**
	 * Make the api call to get our target.
	 * This isn't using redux because of a "race-condition" where target isn't the expected value until too late
	 * @param d: dispatch
	 * @param query: the path/query parameters to tack onto the end of the get request
	 */
	const getTarget = (d, query) => {
		d({type: `${GET_TARGET}_REQUEST`});
		client.get(`/api/v2/jump/${query}`, {headers}).then(r => {
			d({type: `${GET_TARGET}_SUCCESS`, payload: r.data});
			handleTargetResponse(r.data);
		}).catch(err => {
			d({type: `${GET_TARGET}_FAILURE`, payload: err, error: true});
		});
	};

	const jumpUser = () => {
		const url = new URL(window.location.href);
		let query = url.searchParams.get("query");
		const id = url.searchParams.get("id");
		console.dir(query, id);
		if (query != null && query !== '') {
			if (id != null && id !== "")
				query += `?id=${id}`;
			// find out were we are going
			getTarget(dispatch, query);
		} else {
			setFailure("You must specify a query!");
		}
	};
	// initial hook run on start (componentdidmount)
	useEffect(() => {
		window.document.title = `${APP_NAME}`;
		jumpUser();
	}, []);

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
