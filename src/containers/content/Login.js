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
import {Button, Card, CardContent, CircularProgress, Grid, makeStyles, Typography} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import Center from "react-center";
import {mdiGithub, mdiGoogle, mdiShieldAccount} from "@mdi/js";
import {useTheme} from "@material-ui/core/styles";
import {ValidatedTextField} from "jmp-coreui";
import {APP_NAME} from "../../constants";
import SocialButton from "../../components/widget/SocialButton";
import getIconColour from "../../style/getIconColour";
import {resetError} from "../../actions/Generic";
import {OAUTH_REQUEST, oauthRequest} from "../../store/actions/auth/AuthRequest";
import {discoverOAuth} from "../../store/actions/auth/DiscoverOAuth";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		color: theme.palette.text.secondary
	},
	banner: {
		fontFamily: "Manrope",
		fontWeight: 500,
		color: theme.palette.secondary.main
	},
	overlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "transparent",
		pointerEvents: "none"
	},
	resetButton: {
		fontFamily: "Manrope",
		fontWeight: "bold",
		textTransform: "none",
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1)
	},
	oauthMessage: {
		fontFamily: "Manrope",
		fontWeight: 500,
		textAlign: "center",
		color: theme.palette.text.primary
	}
}));

const initialUser = {
	value: "",
	error: "",
	regex: new RegExp(/^.{3,}$/)
};
const initialPassword = {
	value: "",
	error: "",
	regex: new RegExp(/^.{8,}$/)
};

export default ({history}) => {
	// hooks
	const dispatch = useDispatch();
	const classes = useStyles();
	const theme = useTheme();

	const {isLoggedIn, providers} = useSelector(state => state.auth);
	const loading = useSelector(state => state.loading[OAUTH_REQUEST]);
	const error = useSelector(state => state.errors[OAUTH_REQUEST]);

	// state hooks
	const [username, setUsername] = useState(initialUser);
	const [password, setPassword] = useState(initialPassword);
	const [page, setPage] = useState(0);
	const [valid, setValid] = useState(false);
	// lifecycle hooks
	useEffect(() => {
		window.document.title = `Login - ${APP_NAME}`;
		discoverOAuth(dispatch, "github");
		discoverOAuth(dispatch, "google");
		discoverOAuth(dispatch, "keycloak");
	}, [dispatch]);

	useEffect(() => {
		if(isLoggedIn === true) {
			// The user is already logged in, we can leave here
			const url = new URL(window.location.href);
			const target = url.searchParams.get("target");
			history.push(target != null && target !== "" ? target : "/");
		}
	}, [history, isLoggedIn]);

	useEffect(() => {
		if (page === 0)
			setValid(username.error === "" && username.value.length > 0);
		else if (page === 1)
			setValid(password.error === "" && password.value.length > 0);
	}, [username, password, page]);


	const onNext = () => {
		if (page === 1) {
			oauthRequest(dispatch, {username: username.value, password: password.value});
		}
		if (page < 2)
			setPage(page + 1);
	};

	const onReset = () => {
		setPage(0);
		setUsername(initialUser);
		setPassword(initialPassword);
		resetError(dispatch, OAUTH_REQUEST);
	};

	return (
		<Center className={classes.overlay}>
			<>
				<Grid style={{height: "100vh"}} container spacing={4} alignContent="center" justify="center">
					<Grid item lg={2} md={false}/>
					<Grid item lg={8} md={12}>
						<CardContent style={{margin: 12, pointerEvents: "initial"}}>
							<Grid container spacing={4} alignContent="center" justify="center">
								<Grid item xs={12}>
									<Center>
										<img src={`${process.env.PUBLIC_URL}/jmp2.png`} alt="App icon" height={72}/>
									</Center>
									<Typography className={classes.banner} variant="h2"
									            align="center">{APP_NAME}</Typography>
								</Grid>
								<Grid item xs={12} sm={9} md={6} lg={4}>
									<Card style={{padding: 16, borderRadius: 12}}>
										{page === 0 && <ValidatedTextField
											data={username}
											setData={setUsername}
											invalidLabel="Username must be a minimum of 3 characters"
											fieldProps={{
												required: true,
												autoFocus: true,
												autoComplete: "username",
												margin: "dense",
												id: "username",
												label: "Username",
												variant: "outlined",
												fullWidth: true
											}}
										/>}
										{page === 1 && <ValidatedTextField
											data={password}
											setData={setPassword}
											invalidLabel="Password must be a minimum of 8 characters"
											fieldProps={{
												required: true,
												type: "password",
												autoComplete: "current-password",
												margin: "dense",
												id: "password",
												label: "Password",
												variant: "outlined",
												fullWidth: true
											}}
										/>}
										<Button style={{
											marginTop: 8,
											textTransform: "none",
											color: getIconColour(theme)
										}} className={classes.title} onClick={() => onNext()} variant="contained"
										        color="primary"
										        fullWidth size="large" type="submit"
										        disabled={!valid || page >= 2 || loading === true || isLoggedIn === true}>
											Continue
											{(loading === true || isLoggedIn === true) &&
											<CircularProgress style={{padding: 4}} size={15} thickness={7}/>}
										</Button>
										{error && <Typography style={{padding: 8}} color="error" align="center">
											{error.toString().startsWith("ApiError: 401") ? "Incorrect username or password" : "Something went wrong"}
										</Typography>}
										{(page > 0 || error != null) &&
										<Button className={classes.resetButton} color="primary"
										        disabled={loading === true || isLoggedIn === true}
										        onClick={() => onReset()}>Reset</Button>}
									</Card>
								</Grid>
							</Grid>
							{providers.size > 0 &&
							<>
								<p className={classes.oauthMessage}>Alternatively, login with</p>
								<Center>
									{providers.get("github") != null &&
									<SocialButton url={providers.get("github")} name="GitHub" colour="#171516"
									              icon={mdiGithub}/>}
									{providers.get("google") != null &&
									<SocialButton url={providers.get("google")} name="Google" colour="#4285F4"
									              icon={mdiGoogle}/>}
									{providers.get("keycloak") != null &&
									<SocialButton url={providers.get("keycloak")} name="Keycloak"
									              colour="#568bf4"
									              icon={mdiShieldAccount}/>}
								</Center>
							</>
							}
						</CardContent>
					</Grid>
					<Grid item lg={2} md={false}/>
				</Grid>
			</>
		</Center>
	);
};
