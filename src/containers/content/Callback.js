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
import Typography from "@material-ui/core/es/Typography/Typography";
import Center from "react-center";
import {makeStyles, withTheme} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {connect} from "react-redux";
import {OAUTH2_CALLBACK, oauth2Callback} from "../../actions/Oauth";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
	subtitle: {
		textAlign: 'center',
		fontFamily: "Manrope",
		fontWeight: 500,
		color: theme.palette.text.primary
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: '80vh'
	},
	inner: {
		justifyContent: 'center',
		alignItems: 'center'
	}
}));

const Callback = ({headers, loading, error, oauth2Callback, ...props}) => {
	useEffect(() => {
		window.document.title = `Callback - ${process.env.REACT_APP_APP_NAME}`;
		// Get the list of parameters
		const params = new URLSearchParams(props.location.search);
		console.log(`params: ${params}`);
		// Create the callback request to the backend
		const provider = props.location.pathname.split("/callback-")[1];
		console.log(`Using provider: ${provider}`);

		const sentHeaders = headers;
		sentHeaders['X-Auth-Source'] = provider;
		oauth2Callback(params, sentHeaders);
	}, []);

	useEffect(() => {
		if(loading === false && error == null)
			props.history.push('/');
	}, [loading, error]);

	const classes = useStyles();
	return (
		<div className={classes.container}>
			<div className={classes.inner}>
				{error == null ?
					<>
						<Center>
							<CircularProgress style={{margin: 24}}/>
						</Center>
						<Center>
							<Typography className={classes.subtitle} variant={"subtitle1"}>We're just doing some setup...</Typography>
						</Center>
					</>
					:
					<>
						<Center>
							<Typography className={classes.subtitle} variant={"subtitle1"}>{error.toString()}</Typography>
						</Center>
					</>
				}
			</div>
		</div>
	);
};
Callback.propTypes = {
	headers: PropTypes.object.isRequired,
	loading: PropTypes.bool,
	error: PropTypes.object,
	oauth2Callback: PropTypes.func.isRequired
};
Callback.defaultProps = {
	loading: false,
	error: null
};
const mapStateToProps = state => ({
	headers: state.auth.headers,
	loading: state.loading[OAUTH2_CALLBACK],
	error: state.errors[OAUTH2_CALLBACK]
});
const mapDispatchToProps = ({
	oauth2Callback
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTheme(Callback));