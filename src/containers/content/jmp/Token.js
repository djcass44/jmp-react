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
import {client} from "../../../constants";
import {GENERIC_GET_TOKEN, getTokenEnd, getTokenFail, getTokenStart} from "../../../actions/Generic";
import {connect} from "react-redux";
import {withStyles, withTheme} from "@material-ui/core";
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";
import Center from "react-center";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	button: {
		// margin: theme.spacing.unit,
	},
	grow: {flexGrow: 1}
});

class Token extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}

	componentDidMount() {
		this.jumpUser();
	}

	jumpUser() {
		let url = new URL(window.location.href);
		let query = url.searchParams.get("query");
		if(query != null && query !== '') {
			this.props.getTokenStart();
			let that = this;
			client.get(`/api/v2/jump/${query}`, {headers: this.state.headers}).then(r => {
				that.props.getTokenEnd();
				console.log(`token: ${r.data}`);
				// window.location.replace(r.data);
			}).catch(err => {
				that.props.getTokenFail(err.toString());
			});
		}
		else {
			this.props.getTokenFail("You must specify a query!");
		}
		// console.log(`error: ${this.state.error}`);
	}

	render() {
		const errOrMessage = this.state.error != null ?
			<Center>{this.state.error}</Center>
			:
			<Center>Jump complete! You may close this window</Center>;
		return this.state.loading === true ?
			<CircularProgress/>
			:
			<div>{errOrMessage}</div>;
	}
}
const mapStateToProps = state => ({
	loading: state.loading[GENERIC_GET_TOKEN],
	error: state.errors[GENERIC_GET_TOKEN],
	headers: state.auth.headers,
});
const mapDispatchToProps = ({
	getTokenStart,
	getTokenEnd,
	getTokenFail

});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme()(Token)));