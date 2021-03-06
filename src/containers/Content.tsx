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

import React, {useEffect, useRef} from "react";
import {Grid, makeStyles, Theme} from "@material-ui/core";
import {Route, Switch} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setGridWidth} from "../store/actions/Generic";
import useWindowSize from "../hooks/useWindowSize";
import Login from "./content/Login";
import NotFound from "./content/NotFound";
import Logout from "./content/Logout";
import Token from "./content/jmp/Token";
import Similar from "./content/jmp/Similar";
import Settings from "./content/Settings";
import Help from "./content/Help";
import Callback from "./content/Callback";
import Jumps from "./content/Jumps";
import JumpEditDialog from "./modal/JumpEditDialog";
import DeleteDialog from "./modal/DeleteDialog";
import JumpDialog from "./modal/JumpDialog";
import Identity from "./content/Identity";

const useStyles = makeStyles((theme: Theme) => ({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		marginTop: 64
	},
	centered: {
		flex: 1,
		justifyContent: "center"
	},
	padding: {
		display: "none",
		[theme.breakpoints.up("sm")]: {
			display: "initial"
		}
	}
}));

const Content: React.FC = (): JSX.Element => {
	// hooks
	const classes = useStyles();
	const dispatch = useDispatch();
	const dimensions = useWindowSize();
	const gridRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!gridRef.current)
			return;
		dispatch(setGridWidth(gridRef.current.offsetWidth));
	}, [gridRef, gridRef.current?.offsetWidth, dimensions]);

	return (
		<div className={classes.container}>
			<Grid container spacing={0} className={classes.centered}>
				<Grid item xs={false} sm={3} lg={2} className={classes.padding}/>
				<Grid item xs={12} sm={6} lg={4} ref={gridRef}>
					<Switch>
						<Route exact path="/" component={Jumps} key="jumps"/>
						<Route path="/search" component={Jumps}/>
						<Route path="/identity" component={Identity} key="identity"/>
						<Route exact path="/jmp" component={Token} key="token"/>
						<Route exact path="/similar" component={Similar} key="similar"/>
						<Route exact path="/login" component={Login} key="login"/>
						<Route exact path="/logout" component={Logout} key="logout"/>
						<Route exact path="/settings" component={Settings} key="settings"/>
						<Route exact path="/help" component={Help} key="help"/>
						<Route exact path="/callback" component={Callback} key="callback"/>
						<Route component={NotFound} key="notfound"/>
					</Switch>
				</Grid>
				<Grid item xs={false} sm={3} lg={2} className={classes.padding}/>
			</Grid>
			<JumpEditDialog/>
			<DeleteDialog/>
			<JumpDialog/>
		</div>
	);
};
export default Content;
