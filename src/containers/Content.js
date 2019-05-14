import React from "react";
import {Grid} from "@material-ui/core";
import Jumps from "./content/Jumps";
import {Route} from "react-router-dom";
import Login from "./content/Login";
import {connect} from "react-redux";
import {oauthRefresh, oauthRequest, oauthVerify} from "../actions/Auth";

class Content extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: {},
			loading: false
		}
	}

	componentDidMount() {
		this.props.oauthVerify(this.state.headers);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if(nextProps.isLoggedIn !== this.props.isLoggedIn) {
			// update()
			this.setState({loading: false});
		}
	}

	render() {
		let content = (<div>Loading...</div>);
		if(this.state.loading === false) {
			content = (<div style={{padding: 20}}>
				<Grid container spacing={40}>
					<Grid item sm={3}/>
					<Grid item xs={12} sm={6}>
						<Route exact path={"/"} component={Jumps}/>
						<Route exact path={"/login"} component={Login}/>
					</Grid>
					<Grid item sm={3}/>
				</Grid>
			</div>);
		}
		return content;
	}
}
const mapStateToProps = state => ({
	headers: state.headers,
	isLoggedIn: state.isLoggedIn
});
const mapDispatchToProps = ({
	oauthVerify,
	oauthRequest,
	oauthRefresh
});
export default connect(mapStateToProps, mapDispatchToProps)(Content);