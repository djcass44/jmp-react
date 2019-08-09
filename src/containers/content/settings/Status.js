import {Button, withTheme} from "@material-ui/core";
import {mdiAccountNetworkOutline, mdiDatabase, mdiHexagon, mdiImageSearchOutline} from "@mdi/js";
import React, {useEffect} from "react";
import {GET_INFO_STAT, getInfoHealth} from "../../../actions/Info";
import {connect} from "react-redux";
import StatusIcon from "../../../components/widget/StatusIcon";
import PropTypes from "prop-types";

const Status = props => {
	useEffect(() => {
		handleReload();
	}, []);

	const handleReload = () => { props.getInfoHealth(props.headers) };

	return (
		<div>
			<div>
				<StatusIcon active={props.status.http === "OK"} title={`JMP Core: ${props.status.http}`} icon={mdiHexagon} />
				<StatusIcon active={props.status['database'] === true} title={`Database: ${props.status['database']}`} icon={mdiDatabase} />
				<StatusIcon active={props.status['identityProvider'] === true} title={`Identity Provider: ${props.status['identityProvider']}`} icon={mdiAccountNetworkOutline} />
				<StatusIcon active={props.status['imageApi'] === true} title={`Image API: ${props.status['imageApi']}`} icon={mdiImageSearchOutline} />
			</div>
			{props['showReload'] === true ? <Button disabled={props.loading === true} color="primary" onClick={() => {handleReload()}}>Reload</Button> : ""}
		</div>
	);
};
Status.propTypes = {
	loading: PropTypes.bool,
	headers: PropTypes.object,
	status: PropTypes.object
};
const mapStateToProps = state => ({
	status: state.info.status,
	statusCheck: state.info.statusCheck || null,
	loading: state.loading[GET_INFO_STAT],
	headers: state.auth.headers,
});
const mapDispatchToProps = ({
	getInfoHealth
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTheme(Status));
