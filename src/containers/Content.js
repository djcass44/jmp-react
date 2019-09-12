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
import {Grid, makeStyles} from "@material-ui/core";
import {Route, Switch, withRouter} from "react-router-dom";
import Login from "./content/Login";
import NotFound from "./content/NotFound";
import Logout from "./content/Logout";
import Identity from "./content/Identity";
import Token from "./content/jmp/Token";
import Similar from "./content/jmp/Similar";
import Settings from "./content/Settings";
import Help from "./content/Help";
import Callback from "./content/Callback";
import Status from "./content/Status/index";
import Jumps2 from "./content/Jumps2";
import JumpEditDialog from "./modal/JumpEditDialog";
import DeleteDialog from "./modal/DeleteDialog";
import JumpDialog from "./modal/JumpDialog";

const useStyles = makeStyles(theme => ({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20
	},
	centred: {
		flex: 1,
		justifyContent: 'center'
	},
	padding: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'initial'
		},
	}
}));

export const Content = () => {
	const classes = useStyles();
	return (
		<div className={classes.container}>
			<Grid container spacing={5} className={classes.centred}>
				<Grid item xs={false} sm={1} md={3} className={classes.padding}/>
				<Grid item xs={12} sm={10} md={6}>
					<Switch>
						<Route exact path="/" component={Jumps2} key={"jumps"}/>
						<Route exact path="/identity" component={Identity} key={"identity"}/>
						<Route exact path="/jmp" component={Token} key={"token"}/>
						<Route exact path="/similar" component={Similar} key={"similar"}/>
						<Route exact path="/login" component={Login} key={"login"}/>
						<Route exact path="/logout" component={Logout} key={"logout"}/>
						<Route exact path="/settings" component={Settings} key={"settings"}/>
						<Route exact path="/help" component={Help} key={"help"}/>
						<Route exact path="/callback-*" component={Callback} key={"callback"}/>
						<Route exact path="/status" component={Status} key="status"/>
						<Route component={NotFound} key={"notfound"}/>
					</Switch>
				</Grid>
				<Grid item xs={false} sm={1} md={3} className={classes.padding}/>
			</Grid>
			<JumpEditDialog/>
			<DeleteDialog/>
			<JumpDialog/>
		</div>
	);
};
export default withRouter(Content);
