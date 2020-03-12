import {Button} from "@material-ui/core";
import {mdiAccountNetworkOutline, mdiDatabase, mdiHexagon, mdiImageSearchOutline} from "@mdi/js";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import StatusIcon from "../../../components/widget/StatusIcon";
import {TState} from "../../../store/reducers";
import {AuthState} from "../../../store/reducers/auth";
import {GET_INFO_STAT, getInfoHealth} from "../../../store/actions/info/GetInfoHealth";

interface StatusProps {
	showReload?: boolean;
}

const Status: React.FC<StatusProps> = ({showReload = false}) => {
	// hooks
	const dispatch = useDispatch();

	// global state
	const loading = useSelector<TState, boolean>(state => state.loading[GET_INFO_STAT] ?? false);
	const {components} = useSelector<TState, any>(state => state.info.status);
	const {headers} = useSelector<TState, AuthState>(state => state.auth);

	useEffect(() => {
		handleReload();
	}, []);

	const handleReload = () => getInfoHealth(dispatch, headers);

	return (
		<>
			<div>
				<StatusIcon
					active={components?.ping?.status}
					title="Core"
					loading={loading}
					icon={mdiHexagon}
				/>
				<StatusIcon
					active={components?.db?.status}
					title="Database"
					loading={loading}
					icon={mdiDatabase}
				/>
				<StatusIcon
					active={components?.ping?.status}
					title="Identity Provider"
					loading={loading}
					icon={mdiAccountNetworkOutline}
				/>
				<StatusIcon
					active={components?.metadata?.status}
					title="Metadata"
					loading={loading}
					icon={mdiImageSearchOutline}
				/>
				{showReload && <Button
					style={{float: "right"}}
					disabled={loading}
					variant="outlined"
					color="primary"
					onClick={() => handleReload()}>
					Reload
				</Button>}
			</div>
		</>
	);
};
export default Status;
