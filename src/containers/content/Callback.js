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
import Typography from "@material-ui/core/es/Typography/Typography";
import Center from "react-center";
import {withStyles, withTheme} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {connect} from "react-redux";
import {OAUTH2_CALLBACK, oauth2Callback} from "../../actions/Oauth";

const styles = () => ({
	title: {
		fontSize: 148,
		fontWeight: 200,
		color: "#454545"
	},
	subtitle: {
		textAlign: 'center',
		fontFamily: "Manrope",
		fontWeight: 500
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: '80vh'
	}
});

class Callback extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: props.headers
		};
	}


	componentDidMount() {
		window.document.title = `Callback - ${process.env.REACT_APP_APP_NAME}`;
		// Get the list of parameters
		const params = new URLSearchParams(this.props.location.search);
		console.log(`params: ${params}`);
		// Create the callback request to the backend
		const provider = this.props.location.pathname.split("/callback-")[1];
		console.log(`Using provider: ${provider}`);
		const headers = this.state.headers;
		headers['X-Auth-Source'] = provider;
		this.props.oauth2Callback(params, headers);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if(nextProps.loading === false && nextProps.error == null) {
			this.props.history.push('/');
		}
		this.setState({...nextProps});
	}

	render() {
		const {classes} = this.props;
		return (
			<div className={classes.container}>
				<div style={{justifyContent: 'center', alignItems: 'center'}}>
					{this.state.error == null ?
						<div>
							<Center><CircularProgress style={{margin: 24}}/></Center>
							<Center><Typography className={classes.subtitle} variant={"subtitle1"}>We're just doing some setup...</Typography></Center>
						</div>
						:
						<div>
							<Center><Typography className={classes.subtitle} variant={"subtitle1"}>{this.state.error}</Typography></Center>
						</div>
					}
				</div>
			</div>
		);
	}
}
const mapStateToProps = state => ({
	headers: state.auth.headers,
	loading: state.loading[OAUTH2_CALLBACK],
	error: state.errors[OAUTH2_CALLBACK]
});
const mapDispatchToProps = ({
	oauth2Callback
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(Callback)));