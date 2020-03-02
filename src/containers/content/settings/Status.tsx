import {Button} from "@material-ui/core";
import {mdiAccountNetworkOutline, mdiDatabase, mdiHexagon, mdiImageSearchOutline} from "@mdi/js";
import React, {useEffect} from "react";
import {GET_INFO_STAT, getInfoHealth} from "../../../actions/Info";
import {useDispatch, useSelector} from "react-redux";
import StatusIcon from "../../../components/widget/StatusIcon";
import {TState} from "../../../store/reducers";
import {AuthState} from "../../../store/reducers/auth";

interface StatusProps {
	showReload?: boolean;
}

const Status: React.FC<StatusProps> = ({showReload = false}) => {
	const dispatch = useDispatch();

	const loading = useSelector<TState, boolean>(state => state.loading.get(GET_INFO_STAT) || false);
	// @ts-ignore
	const {components} = useSelector<TState, any>(state => state.info.status);
	const {headers} = useSelector<TState, AuthState>(state => state.auth);

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
			{showReload && <Button disabled={loading} color="primary" onClick={() => handleReload()}>Reload</Button>}
		</>
	);
};
export default Status;
