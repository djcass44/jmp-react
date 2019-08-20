import {GET_INFO_STAT, getInfoHealth} from "../../../actions/Info";
import Status from "./Status";
import {connect} from "react-redux";

const mapStateToProps = state => ({
	status: state.info.status,
	headers: state.auth.headers,
	loading: state.loading[GET_INFO_STAT],
	error: state.errors[GET_INFO_STAT]
});
const mapDispatchToProps = ({
	getInfoHealth
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Status);