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
import {APP_NAME, BASE_URL} from "../../../constants";
import {useDispatch, useSelector} from "react-redux";
import {CircularProgress, makeStyles, Theme} from "@material-ui/core";
import Center from "react-center";
import {GET_TARGET} from "../../../actions/Jumps";
import {RouteComponentProps} from "react-router";
import {TState} from "../../../store/reducers";
import {AuthState} from "../../../store/reducers/auth";
import {RSAA} from "redux-api-middleware";
import {Dispatch} from "redux";

const useStyles = makeStyles((theme: Theme) => ({
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

interface DoJumpDTO {
	found: boolean;
	location: string;
}

const Token: React.FC<RouteComponentProps> = ({history}) => {
	const classes = useStyles();
	const dispatch = useDispatch<Dispatch>();
	const {headers} = useSelector<TState, AuthState>(state => state.auth);
	// @ts-ignore
	const loading = useSelector<TState, boolean>(state => state.loading[GET_TARGET] ?? false);
	// @ts-ignore
	const error = useSelector<TState, Error | null>(state => state.errors[GET_TARGET]);

	const [failure, setFailure] = useState<Error | string | null>(error);

	/**
	 * Handle the api response and move us to where we need to go
	 * @param target
	 */
	const handleTargetResponse = (target: DoJumpDTO) => {
		if (target.found) {
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
	const getTarget = (d: Dispatch, query: string): void => {
		dispatch({
			[RSAA]: {
				endpoint: `${BASE_URL}/api/v2/jump/${encodeURIComponent(query)}`,
				method: "GET",
				headers: headers as any,
				types: [`${GET_TARGET}_REQUEST`, `${GET_TARGET}_SUCCESS`, `${GET_TARGET}_FAILURE`]
			}
		}).then(r => {
			handleTargetResponse(r.payload as DoJumpDTO);
		});
	};

	const jumpUser = () => {
		const url = new URL(window.location.href);
		let query = url.searchParams.get("query");
		const id = url.searchParams.get("id");
		if (query != null && query !== '') {
			if (id != null && id !== "")
				query += `&id=${id}`;
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

	const message = (error != null || failure != null) ? (error?.toString() || failure) : "Jumping... You can close this window if it stays open";
	return (
		<Center className={classes.overlay}>
			{loading ?
				<CircularProgress/>
				:
				<span className={classes.text}>{message}</span>
			}
		</Center>
	);
};

export default Token;
