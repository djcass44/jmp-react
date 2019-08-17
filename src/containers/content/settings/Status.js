import {Button, withTheme} from "@material-ui/core";
import {mdiAccountNetworkOutline, mdiDatabase, mdiHexagon, mdiImageSearchOutline} from "@mdi/js";
import React, {useEffect} from "react";
import {GET_INFO_STAT, getInfoHealth} from "../../../actions/Info";
import {connect} from "react-redux";
import StatusIcon from "../../../components/widget/StatusIcon";
import PropTypes from "prop-types";

const Status = ({loading, headers, status, getInfoHealth, showReload}) => {
	useEffect(() => {
		handleReload();
	}, []);

	const handleReload = () => getInfoHealth(headers);

	return (
		<>
			<>
				<StatusIcon active={status.http} title={`JMP Core`} icon={mdiHexagon} />
				<StatusIcon active={status['database']} title={`Database`} icon={mdiDatabase} />
				<StatusIcon active={status['identityProvider']} title={`Identity Provider`} icon={mdiAccountNetworkOutline} />
				<StatusIcon active={status['imageApi']} title={`Image API`} icon={mdiImageSearchOutline} />
			</>
			{showReload === true ? <Button disabled={loading === true} color="primary" onClick={() => handleReload()}>Reload</Button> : ""}
		</>
	);
};
Status.propTypes = {
	loading: PropTypes.bool,
	headers: PropTypes.object,
	status: PropTypes.object,
	showReload: PropTypes.bool
};
Status.defaultProps = {
	loading: false,
	showReload: false
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
