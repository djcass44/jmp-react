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
import Center from "react-center";
import {makeStyles, Theme, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useLocation} from "react-router-dom";
import {APP_NAME} from "../../constants";
import {TState} from "../../store/reducers";
import {OAUTH2_CALLBACK, oauth2Callback} from "../../store/actions/auth/OAuth2Callback";
import useLoading from "../../hooks/useLoading";
import {ErrorState} from "../../config/types/Feedback";

const useStyles = makeStyles((theme: Theme) => ({
	subtitle: {
		textAlign: "center",
		fontFamily: "Manrope",
		fontWeight: 500,
		color: theme.palette.text.primary,
		pointerEvents: "initial"
	},
	overlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "transparent",
		pointerEvents: "none"
	}
}));

const Callback: React.FC = () => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();

	const loading = useLoading([OAUTH2_CALLBACK]);
	const error = useSelector<TState, ErrorState | null>(state => state.errors[OAUTH2_CALLBACK]);

	useEffect(() => {
		window.document.title = `Callback - ${APP_NAME}`;
		// Get the list of parameters
		const params = new URLSearchParams(location.search);
		oauth2Callback(dispatch, `code=${params.get("code")}&state=${params.get("state")}`);
	}, [dispatch]);

	useEffect(() => {
		if (!loading && error == null)
			history.push("/");
	}, [loading, error]);

	return (
		<Center className={classes.overlay}>
			{error == null ?
				<div>
					<Center>
						<CircularProgress style={{margin: 24}}/>
					</Center>
					<Center>
						<Typography className={classes.subtitle} variant="subtitle1">
							We're just doing some setup...
						</Typography>
					</Center>
				</div>
				:
				<div>
					<Center>
						<Typography
							className={classes.subtitle}
							variant="subtitle1">
							{error.message || error.payload?.response?.error || "Something went wrong"}
						</Typography>
					</Center>
				</div>
			}
		</Center>
	);
};

export default Callback;
