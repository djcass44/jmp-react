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

import React from "react";
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";
import Card from "@material-ui/core/es/Card/Card";
import {CardContent, Grid, TextField, withStyles, withTheme} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {OAUTH_REQUEST, oauthRequest} from "../../actions/Auth";
import {connect} from "react-redux";
import Center from "react-center";
import {getVersion} from "../../actions/Generic";
import SocialButton from "../../components/widget/SocialButton";
import {mdiGithubCircle, mdiGoogle} from "@mdi/js";

const styles = theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
	},
	banner: {
		fontFamily: "Manrope",
		fontWeight: 500,
		color: theme.palette.secondary.main
	},
});

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: {
				value: '',
				error: '',
				regex: new RegExp(/^.{3,}$/)
			},
			password: {
				value: '',
				error: '',
				regex: new RegExp(/^.{8,}$/)
			},
			submitted: false,
			isLoggedIn: props.isLoggedIn,
			version: props.version
		};
	}

	componentDidMount() {
		window.document.title = `Login - ${process.env.REACT_APP_APP_NAME}`;
		this.props.getVersion();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if(this.state.isLoggedIn === true) {
			// The user is already logged in, we can leave here
			const url = new URL(window.location.href);
			let target = url.searchParams.get("target");
			if(target != null && target !== '')
				this.props.history.push(target);
			else
				this.props.history.push('/');
		}
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}

	handleUsernameChange(e) {
		let val = e.target.value;
		const {username} = this.state;
		username.value = val;
		if(username.regex.test(val) === false)
			username.error = 'Username must be a minimum of 3 characters';
		else
			username.error = '';
		this.setState({username});
	}
	handlePasswordChange(e) {
		let val = e.target.value;
		const {password} = this.state;
		password.value = val;
		if(password.regex.test(val) === false)
			password.error = 'Password must be a minimum of 8 characters';
		else
			password.error = '';
		this.setState({password});
	}
	handleClick() {
		let data = window.btoa(`${this.state.username.value}:${this.state.password.value}`);
		this.props.oauthRequest(data);
	}
	render() {
		const {classes} = this.props;
		let errorMessage;
		if(this.state.error != null) {
			errorMessage = <Center>
			<span style={{color: "red"}}>
				{this.state.error != null && this.state.error.startsWith("Unauthorized") ? "Incorrect username or password" : this.state.error}
			</span>
			</Center>;
		}
		else {
			errorMessage = <div/>;
		}

		return(
			<div>
				{this.state.loading || this.state.isLoggedIn === true ?
					<CircularProgress/>
					:
					<div>
						<Grid container spacing={4} alignContent={"center"} justify={"center"}>
							<Grid item md={2} sm={false}/>
							<Grid item md={8} sm={12}>
								<CardContent style={{margin: 12}}>
									<Grid container spacing={4} alignContent={"center"} justify={"center"}>
										<Grid item xs={12}>
											<Center><img src={`${process.env.PUBLIC_URL}/jmp.png`} alt={"App icon"} height={72}/></Center>
											<Typography className={classes.banner} variant={"h2"} align={"center"}>{process.env.REACT_APP_APP_NAME}</Typography>
										</Grid>
										<Grid item xs={12}>
											<Card style={{padding: 16}}>
												<TextField required autoFocus autoComplete={"username"} margin={"dense"} id={"username"} label={"Username"} variant={"outlined"}
												           value={this.state.username.value} fullWidth error={this.state.username.error.length !== 0} helperText={this.state.username.error}
												           onChange={this.handleUsernameChange.bind(this)}/>
												<TextField required type={"password"} autoComplete={"password"} margin={"dense"} id={"password"} label={"Password"} variant={"outlined"}
												           value={this.state.password.value} fullWidth error={this.state.password.error.length !== 0} helperText={this.state.password.error}
												           onChange={this.handlePasswordChange.bind(this)}/>
												<Button style={{marginTop: 8}} className={classes.title} onClick={this.handleClick.bind(this)} variant={"contained"} color={"primary"}
												        fullWidth size={"large"} type={"submit"} disabled={this.state.loading === true || this.state.submitted || this.state.username.error !== '' ||
														this.state.password.error !== '' || this.state.username.value.length === 0 || this.state.password.value.length === 0}>
													Login
												</Button>
											</Card>
										</Grid>
									</Grid>
									<Center className={classes.title} style={{padding: 8}}>{process.env.REACT_APP_APP_NAME}&nbsp;{this.state.version}</Center>
									{errorMessage}
									<div>
										{process.env.REACT_APP_SHOW_OAUTH === "true" ? <SocialButton id={"github"} name={"GitHub"} colour={"#171516"} icon={mdiGithubCircle}/> : ""}
										{process.env.REACT_APP_SHOW_OAUTH === "true" ? <SocialButton id={"google"} name={"Google"} colour={"#4285f4"} icon={mdiGoogle}/> : ""}
									</div>
								</CardContent>
							</Grid>
							<Grid item md={2} sm={false}/>
						</Grid>
					</div>
				}
			</div>
		);
	}

}

const mapStateToProps = state => ({
	loading: state.loading[OAUTH_REQUEST],
	error: state.errors[OAUTH_REQUEST],
	isLoggedIn: state.auth.isLoggedIn,
	version: state.generic.version
});
const mapDispatchToProps = ({
	oauthRequest,
	getVersion
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(Login)));
