import React from "react";
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";
import Card from "@material-ui/core/es/Card/Card";
import {CardContent, Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {oauthRequest} from "../../actions/Auth";
import {connect} from "react-redux";
import {createErrorSelector, createLoadingSelector} from "../../reducers/Tools";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {
				username: '',
				password: ''
			},
			submitted: false
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
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
		return(
			<div>
				{this.props.loading ?
					<CircularProgress/>
					:
					<Card>
						<CardContent>
							<Grid container spacing={24} alignContent={"center"} justify={"center"} component={ValidatorForm} ref={"form"} onSubmit={this.handleClick}>
								<Grid item xs={12}>
									<img src={`${process.env.PUBLIC_URL}/favicon.ico`} alt={"App icon"}/>
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
							{this.props.error != null ? <p>{this.state.error}</p> : <div/>}
						</CardContent>
					</Card>
				}
			</div>
		);
	}

}
const loading = createLoadingSelector(['OAUTH_REQUEST']);
// const errors = createErrorSelector(['OAUTH_REQUEST']);

const mapStateToProps = state => ({
	loading: loading(state),
	// error: errors(state)
});
const mapDispatchToProps = ({
	oauthRequest
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);