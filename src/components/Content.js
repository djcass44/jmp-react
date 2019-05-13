import React from "react";
import {Grid} from "@material-ui/core";
import Jumps from "./content/Jumps";
import {Route} from "react-router-dom";
import Login from "./content/Login";
import {connect} from "react-redux";
import {oauthVerify} from "../actions/Auth";

class Content extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: {}
		}
	}

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
function mapStateToProps(state) {
	return state;
}
function mapDispatchToProps(dispatch) {
	return {
		oauthVerify: headers => {
			dispatch(oauthVerify(headers))
		}
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Content);