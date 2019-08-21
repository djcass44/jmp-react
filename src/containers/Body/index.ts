import {OAUTH_VERIFY, oauthVerify} from "../../actions/Auth";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Body} from "./Body";
import * as React from "react";

const mapStateToProps = (state: any) => ({
	loading: state.loading[OAUTH_VERIFY],
	headers: state.auth.headers,
	refresh: state.auth.refresh,
});
const mapDispatchToProps = ({
	oauthVerify
});
export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(Body) as React.ComponentType<any>);