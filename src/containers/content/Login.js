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
import {CardContent, Grid, makeStyles, TextField, CircularProgress, Card, Typography, Button} from "@material-ui/core";
import {OAUTH_REQUEST, oauthRequest} from "../../actions/Auth";
import {connect} from "react-redux";
import Center from "react-center";
import {getVersion} from "../../actions/Generic";
import SocialButton from "../../components/widget/SocialButton";
import {mdiGithubCircle, mdiGoogle} from "@mdi/js";
import {oauth2Discover} from "../../actions/Oauth";
import {APP_NAME} from "../../constants";
import PropTypes from "prop-types";
import {useTheme} from "@material-ui/core/styles";

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
	oauthMessage: {
		fontFamily: "Manrope",
		fontWeight: 500,
		textAlign: 'center',
		color: theme.palette.getContrastText(theme.palette.background.default),
	}
}));

const initialUser = {
	value: '',
	error: '',
	regex: new RegExp(/^.{3,}$/)
};
const initialPassword = {
	value: '',
	error: '',
	regex: new RegExp(/^.{8,}$/)
};

const Login = ({isLoggedIn, version, providers, loading, error, ...props}) => {
	// state hooks
	const [username, setUsername] = useState(initialUser);
	const [password, setPassword] = useState(initialPassword);
	// lifecycle hooks
	useEffect(() => {
		window.document.title = `Login - ${APP_NAME}`;
		props.getVersion();
		props.oauth2Discover("github");
		props.oauth2Discover("google");
	}, []);
	useEffect(() => {
		if(isLoggedIn === true) {
			// The user is already logged in, we can leave here
			const url = new URL(window.location.href);
			let target = url.searchParams.get("target");
			props.history.push(target != null && target !== "" ? target : "/");
		}
	}, [isLoggedIn]);
	const onUsernameChange = (e) => {
		const {value} = e.target;
		const err = username.regex.test(value) === true ? "" : "Username must be a minimum of 3 characters";
		setUsername({...username, value, err});
	};
	const onPasswordChange = (e) => {
		const {value} = e.target;
		const err = password.regex.test(value) === true ? "" : "Password must be a minimum of 8 characters";
		setPassword({...password, value, err});
	};
	const onSubmit = () => {
		const data = window.btoa(`${username.value}:${password.value}`);
		props.oauthRequest(data);
	};
	const classes = useStyles();
	const theme = useTheme();
	let errorMessage = <div/>;
	if(error != null) {
		errorMessage = (
			<Center>
				<span style={{color: theme.palette.error.main}}>
					{error.toString().startsWith("Unauthorized") ? "Incorrect username or password" : error.toString()}
				</span>
			</Center>
		);
	}
	return(
		<>
			{loading || isLoggedIn === true ?
				<CircularProgress/>
				:
				<>
					<Grid container spacing={4} alignContent={"center"} justify={"center"}>
						<Grid item lg={2} md={false}/>
						<Grid item lg={8} md={12}>
							<CardContent style={{margin: 12}}>
								<Grid container spacing={4} alignContent={"center"} justify={"center"}>
									<Grid item xs={12}>
										<Center><img src={`${process.env.PUBLIC_URL}/jmp.png`} alt={"App icon"} height={72}/></Center>
										<Typography className={classes.banner} variant={"h2"} align={"center"}>{APP_NAME}</Typography>
									</Grid>
									<Grid item xs={12}>
										<Card style={{padding: 16}}>
											<TextField required autoFocus autoComplete={"username"} margin={"dense"} id={"username"} label={"Username"} variant={"outlined"}
											           value={username.value} fullWidth error={username.error.length !== 0} helperText={username.error}
											           onChange={(e) => onUsernameChange(e)}/>
											<TextField required type={"password"} autoComplete={"password"} margin={"dense"} id={"password"} label={"Password"} variant={"outlined"}
											           value={password.value} fullWidth error={password.error.length !== 0} helperText={password.error}
											           onChange={(e) => onPasswordChange(e)}/>
											<Button style={{marginTop: 8}} className={classes.title} onClick={() => onSubmit()} variant={"contained"} color={"primary"}
											        fullWidth size={"large"} type={"submit"} disabled={loading === true || username.error !== '' ||
													password.error !== '' || username.value.length === 0 || password.value.length === 0}>
												Login
											</Button>
										</Card>
									</Grid>
								</Grid>
								<Center className={classes.title} style={{padding: 8}}>{APP_NAME}&nbsp;{version}</Center>
								{errorMessage}
								{Object.keys(providers).length > 0 ?
									<>
										<p className={classes.oauthMessage}>Login with</p>
										<Center>
											{providers['github'] === true ?
												<SocialButton id={"github"} name={"GitHub"} colour={"#171516"}
												              icon={mdiGithubCircle}/> : ""}
											{providers['google'] === true ?
												<SocialButton id={"google"} name={"Google"} colour={"#4285F4"}
												              icon={mdiGoogle}/> : ""}
										</Center>
									</>
									:
									""
								}
							</CardContent>
						</Grid>
						<Grid item lg={2} md={false}/>
					</Grid>
				</>
			}
		</>
	);
};
Login.propTypes = {
	providers: PropTypes.object.isRequired,
	loading: PropTypes.bool,
	error: PropTypes.object,
	isLoggedIn: PropTypes.bool.isRequired,
	version: PropTypes.string
};
Login.defaultProps = {
	loading: false,
	error: null,
	version: ''
};
const mapStateToProps = state => ({
	providers: {...state.auth.providers},
	loading: state.loading[OAUTH_REQUEST],
	error: state.errors[OAUTH_REQUEST],
	isLoggedIn: state.auth.isLoggedIn,
	version: state.generic.version
});
const mapDispatchToProps = ({
	oauthRequest,
	oauth2Discover,
	getVersion
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Login);
