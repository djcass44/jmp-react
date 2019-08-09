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
import {client} from "../../../constants";
import {GENERIC_GET_TOKEN, getTokenEnd, getTokenFail, getTokenStart} from "../../../actions/Generic";
import {connect} from "react-redux";
import {withTheme} from "@material-ui/core";
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";
import Center from "react-center";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";

export const Token = props => {
	useEffect(() => {
		window.document.title = `${process.env.REACT_APP_APP_NAME}`;
		jumpUser();
	}, []);

	const jumpUser = () => {
		let url = new URL(window.location.href);
		let query = url.searchParams.get("query");
		const id = url.searchParams.get("id");
		if(query != null && query !== '') {
			props.getTokenStart();
			if(id != null && id !== '') {
				query += `?id=${id}`;
			}
			client.get(`/api/v2/jump/${query}`, {headers: props.headers}).then(r => {
				props.getTokenEnd();
				console.log(`token: ${r.data}`);
				if(r.data['found'] === true) {
					window.location.replace(r.data['location']);
				}
				else {
					props.history.push(r.data['location']);
				}
			}).catch(err => {
				props.getTokenFail(err.toString());
			});
		}
		else {
			props.getTokenFail("You must specify a query!");
		}
	};

	const errorMessage = props.error != null ?
		<Center>{props.error}</Center>
		:
		<Center>Jumping... You can close this window if it stays open</Center>;
	return props.loading === true ?
		<Center><CircularProgress/></Center>
		:
		<div>{errorMessage}</div>;
};
Token.propTypes = {
	loading: PropTypes.bool,
	error: PropTypes.object,
	headers: PropTypes.object
};
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
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTheme(Token)));
