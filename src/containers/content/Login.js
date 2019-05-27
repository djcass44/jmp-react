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
import {CardContent, Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {OAUTH_REQUEST, oauthRequest} from "../../actions/Auth";
import {connect} from "react-redux";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import Center from "react-center";
import {getVersion} from "../../actions/Generic";

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {
				username: '',
				password: ''
			},
			submitted: false,
			isLoggedIn: props.isLoggedIn,
			version: props.version
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		this.props.getVersion();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if(this.state.isLoggedIn === true) {
			// The user is already logged in, we can leave here
			this.props.history.push('/');
		}
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}

	handleChange = (event) => {
		const {formData} = this.state;
		formData[event.target.name] = event.target.value;
		this.setState({formData});
	};
	handleClick() {
		console.log(`username: ${this.state.formData.username}`);
		let data = window.btoa(`${this.state.formData.username}:${this.state.formData.password}`);
		console.log(`basic auth data: ${data}`);
		this.props.oauthRequest(data);
	}
	render() {
		const {formData, submitted} = this.state;

		const errorMessage = <Center>
			<span style={{color: "red"}}>{this.state.error}</span>
		</Center>;

		return(
			<div>
				{this.state.loading || this.state.isLoggedIn === true ?
					<CircularProgress/>
					:
					<Card>
						<CardContent style={{margin: 12}}>
							<Grid container spacing={4} alignContent={"center"} justify={"center"} component={ValidatorForm} ref={"form"} onSubmit={this.handleClick}>
								<Grid item xs={12}>
									<Center><img src={`${process.env.PUBLIC_URL}/jmp.png`} alt={"App icon"} height={72}/></Center>
									<Typography variant={"h2"} align={"center"}>Login</Typography>
								</Grid>
								<Grid item xs={12}>
									<TextValidator variant={"outlined"} fullWidth label={"Username"} onChange={this.handleChange} name={"username"} value={formData.username} validators={['required']} errorMessages={['This field is required']} />
								</Grid>
								<Grid item xs={12}>
									<TextValidator variant={"outlined"} fullWidth label={"Password"} onChange={this.handleChange} name={"password"} value={formData.password} type={"password"} validators={['required']} errorMessages={['This field is required']} />
								</Grid>
								<Grid item xs={12}>
									<Button variant={"contained"} color={"primary"} fullWidth size={"large"} type={"submit"} disabled={submitted}>Login</Button>
								</Grid>
							</Grid>
							<Center>{this.state.version}</Center>
							{this.state.error != null ? errorMessage : <div/>}
						</CardContent>
					</Card>
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
export default connect(mapStateToProps, mapDispatchToProps)(Login);