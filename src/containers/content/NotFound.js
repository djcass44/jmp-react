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
import {withStyles} from "@material-ui/core";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import BackIcon from "@material-ui/icons/ArrowBack";
import HomeIcon from "@material-ui/icons/Home";
import {Link} from "react-router-dom";

const styles = theme => ({
	title: {
		fontSize: 148,
		fontWeight: 200,
		color: "#454545"
	}
});

class NotFound extends React.Component {
	render() {
		const {classes} = this.props;
		return <div>
			<div>
				<Center><h1 className={classes.title}>404</h1></Center>
				<Center><Typography style={{textAlign: "center"}} variant={"headline"}>The page you're looking for doesn't exist or the server refused to disclose it.</Typography></Center>
				<Center>
					<IconButton color={"secondary"} href={"javascript:window.history.back()"} aria-label={"Go back"}>
						<BackIcon/>
					</IconButton>
					<IconButton component={Link} to={"/"} color={"primary"} aria-label={"Return to home"}>
						<HomeIcon/>
					</IconButton>
				</Center>
			</div>
		</div>
	}
}
export default withStyles(styles)(NotFound);