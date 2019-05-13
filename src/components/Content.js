import React from "react";
import {Grid} from "@material-ui/core";
import Jumps from "./content/Jumps";
import {Route} from "react-router-dom";
import Login from "./content/Login";

class Content extends React.Component {
	render() {
		return <div style={{padding: 20}}>
			<Grid container spacing={40}>
				<Grid item sm={3}/>
				<Grid item xs={12} sm={6}>
					<Route exact path={"/"} component={Jumps}/>
					<Route exact path={"/login"} component={Login}/>
				</Grid>
				<Grid item sm={3}/>
			</Grid>
		</div>
	}
}
export default Content;