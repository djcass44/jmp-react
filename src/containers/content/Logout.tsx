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
import {useDispatch} from "react-redux";
import {Link, useHistory} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import {CircularProgress, makeStyles, Theme, Typography, useTheme} from "@material-ui/core";
import Icon from "@mdi/react";
import {mdiHomeOutline} from "@mdi/js";
import {APP_NAME} from "../../constants";
import {oauthLogout} from "../../store/actions/auth/AuthLogout";
import {clone} from "../../util";
import {oauth2Logout} from "../../store/actions/auth/OAuth2Logout";
import useAuth from "../../hooks/useAuth";

const useStyles = makeStyles((theme: Theme) => ({
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
	},
	button: {
		pointerEvents: "initial"
	},
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	progress: {
		margin: theme.spacing(2)
	}
}));

const Logout: React.FC = (): JSX.Element => {
	// hooks
	const dispatch = useDispatch();
	const classes = useStyles();
	const history = useHistory();
	const theme = useTheme();

	const {isLoggedIn, headers, request, source} = useAuth();

	useEffect(() => {
		window.document.title = `Logout - ${APP_NAME}`;
		if (request == null || headers == null) return;
		// copy the request/headers because they will be wiped by a logout request
		const r2 = clone(request);
		const h2 = clone(headers);
		// Log the user out
		if (source?.startsWith("oauth2/")) {
			oauth2Logout(dispatch, r2, source, h2);
		} else {
			oauthLogout(dispatch, r2, h2);
		}
	}, []);

	useEffect(() => {
		if (!isLoggedIn)
			history.push("/");
	}, [isLoggedIn]);


	return (
		<Center className={classes.overlay}>
			<div className={classes.button}>
				<Typography className={classes.title} variant="h4" color="textPrimary">
					Ensuring that you're logged out...
				</Typography>
				<Center>
					<CircularProgress className={classes.progress}/>
				</Center>
				<Center style={{paddingTop: 16}}>
					If you're not redirected in a few seconds, click below
				</Center>
				<Center>
					<IconButton
						component={Link} to="/" color="primary" centerRipple={false}
						aria-label="Return to home">
						<Icon path={mdiHomeOutline} color={theme.palette.text.secondary} size={1}/>
					</IconButton>
				</Center>
			</div>
		</Center>
	);
};

export default Logout;
