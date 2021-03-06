import {Button} from "@material-ui/core";
import {mdiAccountNetworkOutline, mdiDatabase, mdiHexagon, mdiImageSearchOutline} from "@mdi/js";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import StatusIcon from "../../../components/widget/StatusIcon";
import {TState} from "../../../store/reducers";
import {GET_INFO_STAT, getInfoHealth} from "../../../store/actions/info/GetInfoHealth";
import useAuth from "../../../hooks/useAuth";
import useLoading from "../../../hooks/useLoading";

interface StatusProps {
	showReload?: boolean;
}

const Status: React.FC<StatusProps> = ({showReload = false}): JSX.Element => {
	// hooks
	const dispatch = useDispatch();

	// global state
	const loading = useLoading([GET_INFO_STAT]);
	const {components} = useSelector<TState, any>(state => state.info.status);
	const {headers} = useAuth();

	useEffect(() => {
		handleReload();
	}, []);

	const handleReload = () => dispatch(getInfoHealth(headers));

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
					style={{float: "right", textTransform: "none"}}
					disabled={loading}
					variant="outlined"
					color="primary"
					onClick={handleReload}>
					Reload
				</Button>}
			</div>
		</>
	);
};
export default Status;
