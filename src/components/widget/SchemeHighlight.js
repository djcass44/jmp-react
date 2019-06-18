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

const styles = theme => ({
	https: {color: theme.palette.success.main},
	http: {
		color: theme.palette.error.main,
		textDecorationLine: 'line-through'
	}
});

class SchemeHighlight extends React.Component {
	render() {
		// This can likely be done in a much better way
		const {classes} = this.props;
		const split = this.props.text.split("://");
		const type = split[0];
		const domain = split[1];
		let highlighted;
		if(type === "https")
			highlighted = <span className={classes.https}>https://</span>;
		else
			highlighted = <span className={classes.http}>http://</span>;
		return (<span>{highlighted}{domain}</span>)
	}
}
export default withStyles(styles)(withTheme(SchemeHighlight));
