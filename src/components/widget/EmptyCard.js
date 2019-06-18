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
import Avatar from "@material-ui/core/es/Avatar";
import ListItemText from "@material-ui/core/es/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import {SentimentDissatisfied} from "@material-ui/icons";
import {withTheme} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	avatar: {
		backgroundColor: theme.palette.error.light,
		color: theme.palette.error.dark,
		marginRight: 12
	}
});

class EmptyCard extends React.Component {
	render() {
		const {classes} = this.props;
		return (
			<ListItem key={"null"} component={'li'}>
				<Avatar className={classes.avatar}>
					<SentimentDissatisfied/>
				</Avatar>
				<ListItemText className={classes.title} primary={"Nothing could be found."}/>
			</ListItem>
		)
	}
}
export default withStyles(styles)(withTheme(EmptyCard));
