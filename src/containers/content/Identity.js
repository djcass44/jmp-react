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
import {withStyles, withTheme} from "@material-ui/core";
import {connect} from "react-redux";
import Users from "./identity/Users";
import Groups from "./identity/Groups";
import BackButton from "../../components/widget/BackButton";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	button: {
		// margin: theme.spacing.unit,
	},
	grow: {flexGrow: 1}
});

class Identity extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: props.headers
		}
	}

	render() {
		return (
			<div>
				<BackButton label={"Back to home"} to={"/"}/>
				<Users/>
				<Groups/>
			</div>
		)
	}

}
const mapStateToProps = state => ({
	headers: state.auth.headers,
	searchFilter: state.generic.searchFilter
});
const mapDispatchToProps = ({});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(Identity)));