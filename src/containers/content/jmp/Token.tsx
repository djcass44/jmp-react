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
import {useDispatch, useSelector} from "react-redux";
import {CircularProgress, makeStyles, Theme, Typography} from "@material-ui/core";
import Center from "react-center";
import {useHistory} from "react-router-dom";
import {Dispatch} from "redux";
import {ImageMessage} from "jmp-coreui";
import {TState} from "../../../store/reducers";
import {APP_NAME} from "../../../constants";
import useAuth from "../../../hooks/useAuth";
import useLoading from "../../../hooks/useLoading";
import {GET_TARGET, getTarget} from "../../../store/actions/Generic";
import {ErrorState} from "../../../config/types/Feedback";

const useStyles = makeStyles((theme: Theme) => ({
	text: {
		margin: theme.spacing(2)
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

const jumpImages = [
	`${process.env.PUBLIC_URL}/draw/undraw_balloons_vxx5.svg`,
	`${process.env.PUBLIC_URL}/draw/undraw_i_can_fly_7egl.svg`,
	`${process.env.PUBLIC_URL}/draw/undraw_instant_support_elxh.svg`
];

const Token: React.FC = () => {
	// hooks
	const classes = useStyles();
	const dispatch = useDispatch<Dispatch>();
	const history = useHistory();

	// global state
	const {headers} = useAuth();
	const loading = useLoading([GET_TARGET]);
	const error = useSelector<TState, ErrorState | null>(state => state.errors[GET_TARGET]);

	// component state
	const [failure, setFailure] = useState<ErrorState | string | null>(error);

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
	 * Make the api call to get our target
	 * @param path: the path (jump name)
	 * @param query: the query parameters to tack onto the end of the get request
	 */
	const getAndFollowTarget = (path: string, query: string): void => {
		dispatch(getTarget(path, query, headers)).then(r => handleTargetResponse(r.payload));
	};

	const jumpUser = () => {
		const url = new URL(window.location.href);
		const path = url.searchParams.get("query");
		let query = "";
		const id = url.searchParams.get("id");
		if (path != null && path !== "") {
			if (id != null && id !== "")
				query = `?id=${id}`;
			// find out were we are going
			getAndFollowTarget(path, query);
		} else {
			setFailure("You must specify a query!");
		}
	};


	useEffect(() => {
		window.document.title = `${APP_NAME}`;
		window.setTimeout(() => jumpUser(), 100);
	}, []);

	const message = (error != null || failure != null) ? (error?.toString() || failure) : "Jumping... You can close this window if it stays open";
	return (
		<Center className={classes.overlay}>
			<div>
				<Center>
					<ImageMessage
						src={(error || failure) ? `${process.env.PUBLIC_URL}/draw/undraw_warning_cyit.svg` : jumpImages}
						message=""
						height={256}
					/>
				</Center>
				{loading ?
					<Center>
						<CircularProgress/>
					</Center>
					:
					<div>
						<Typography
							className={classes.text}
							color="textPrimary"
							align="center">
							{message}
						</Typography>
					</div>
				}
			</div>
		</Center>
	);
};

export default Token;
