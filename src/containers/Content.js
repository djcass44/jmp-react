import React from "react";
import {CircularProgress, Grid} from "@material-ui/core";
import Jumps from "./content/Jumps";
import {Switch, Route} from "react-router-dom";
import Login from "./content/Login";
import {connect} from "react-redux";
import {OAUTH_VERIFY, oauthRefresh, oauthRequest, oauthVerify} from "../actions/Auth";
import {createLoadingSelector} from "../reducers/Tools";
import NotFound from "./content/NotFound";

class Content extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: {}
		}
	}

	componentDidMount() {
		this.props.oauthVerify(this.state.headers);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		console.log(`cur: ${this.props.loading}, next: ${nextProps.loading}`);
		// if(nextProps.isLoggedIn !== this.props.isLoggedIn) {
		// 	// update()
		// }
	}

	render() {
		let content = this.state.loading === true ? (<Grid item xs={12} sm={6}><CircularProgress/></Grid>) : (<Grid item xs={12} sm={6}>
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
const loadingSelector = createLoadingSelector([OAUTH_VERIFY]);

const mapStateToProps = state => ({
	loading: loadingSelector(state),
	headers: state.headers,
	isLoggedIn: state.isLoggedIn
});
const mapDispatchToProps = ({
	oauthVerify,
	oauthRequest,
	oauthRefresh
});
export default connect(mapStateToProps, mapDispatchToProps)(Content);