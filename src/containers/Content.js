import React from "react";
import {CircularProgress, Grid} from "@material-ui/core";
import Jumps from "./content/Jumps";
import {Switch, Route} from "react-router-dom";
import Login from "./content/Login";
import {connect} from "react-redux";
import {OAUTH_REFRESH, OAUTH_VERIFY, oauthRefresh, oauthRequest, oauthVerify} from "../actions/Auth";
import {createLoadingSelector} from "../reducers/Tools";
import NotFound from "./content/NotFound";
import {LS_HEADERS} from "../constants";
import {Banner} from "material-ui-banner";

class Content extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: JSON.parse(localStorage.getItem(LS_HEADERS)) || {},
		}
	}

	componentDidMount() {
		console.log(this.state.headers);
		this.props.oauthVerify(this.state.refresh, this.state.headers);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}

	render() {
		let content = this.state.loading === true ? (<Grid item xs={12} sm={6}><CircularProgress/></Grid>) : (<Grid item xs={12} sm={6}>
			<Banner open={this.state.error === true} label={"An error occurred! This banner is very ugly, please someone fix it :("} paperProps={{elevation: 1}} showDismissButton={false}/>
			<Switch>
				<Route exact path={"/"} component={Jumps}/>
				<Route exact path={"/login"} component={Login}/>
				<Route component={NotFound}/>
			</Switch>
		</Grid>);
		return (<div style={{padding: 20}}>
			<Grid container spacing={40}>
				<Grid item sm={3}/>
				{content}
				<Grid item sm={3}/>
			</Grid>
		</div>);
	}
}

const mapStateToProps = state => ({
	loading: state.loading[OAUTH_VERIFY],
	error: state.errors[OAUTH_REFRESH],
	headers: state.auth.headers,
	isLoggedIn: state.auth.isLoggedIn,
	refresh: state.auth.refresh
});
const mapDispatchToProps = ({
	oauthVerify,
	oauthRequest,
	oauthRefresh
});
export default connect(mapStateToProps, mapDispatchToProps)(Content);