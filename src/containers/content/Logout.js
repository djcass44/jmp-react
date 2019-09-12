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
import {oauthLogout} from "../../actions/Auth";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";
import {makeStyles, Typography} from "@material-ui/core";
import {oauth2Logout} from "../../actions/Oauth";
import {APP_NAME} from "../../constants";

const useStyles = makeStyles(theme => ({
	title: {
		fontSize: 148,
		fontWeight: 200,
		color: theme.palette.text.primary
	}
}));

export default ({history}) => {
	// hooks
	const dispatch = useDispatch();
	const {isLoggedIn, headers, request, source} = useSelector(state => state.auth);

	useEffect(() => {
		window.document.title = `Logout - ${APP_NAME}`;
		// Log the user out
		oauthLogout(dispatch, headers);
		oauth2Logout(dispatch, request, source, headers);
	}, []);

	useEffect(() => {
		if(isLoggedIn === false)
			history.push("/");
	}, [isLoggedIn]);

	const classes = useStyles();

	const loggedIn = (
		<>
			<Typography variant={"h1"} className={classes.title}>Ensuring that you're logged out...</Typography>
			<Center><CircularProgress/></Center>
			<Center style={{paddingTop: 16}}>If you're not redirected in a few seconds, click below</Center>
			<Center>
				<IconButton component={Link} to={"/"} color={"primary"} centerRipple={false} aria-label={"Return to home"}>
					<HomeIcon/>
				</IconButton>
			</Center>
		</>
	);
	return (
		<Center>
			{loggedIn}
		</Center>
	);
};
