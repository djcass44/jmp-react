import {Button} from "@material-ui/core";
import {mdiAccountNetworkOutline, mdiDatabase, mdiHexagon, mdiImageSearchOutline} from "@mdi/js";
import React, {useEffect} from "react";
import {GET_INFO_STAT, getInfoHealth} from "../../../actions/Info";
import {useDispatch, useSelector} from "react-redux";
import StatusIcon from "../../../components/widget/StatusIcon";
import PropTypes from "prop-types";

const Status = ({showReload}) => {
	const dispatch = useDispatch();

	const loading = useSelector(state => state.loading.get(GET_INFO_STAT));
	const {components} = useSelector(state => state.info.status);
	const {headers} = useSelector(state => state.auth);

	useEffect(() => {
		handleReload();
	}, []);

	const handleReload = () => getInfoHealth(dispatch, headers);

	return (
		<>
			<div>
				<StatusIcon active={components && components.ping.status} title={`Core`} icon={mdiHexagon}/>
				<StatusIcon active={components && components.db.status} title={`Database`} icon={mdiDatabase}/>
				<StatusIcon active={components && components.ping.status} title={`Identity Provider`}
				            icon={mdiAccountNetworkOutline}/>
				<StatusIcon active={components && components.metadata.status} title={`Metadata`}
				            icon={mdiImageSearchOutline}/>
			</div>
			{showReload === true ?
				<Button disabled={loading === true} color="primary" onClick={() => handleReload()}>Reload</Button> : ""}
		</>
	);
};
Status.propTypes = {
	showReload: PropTypes.bool
};
Status.defaultProps = {
	showReload: false
};
export default Status;
