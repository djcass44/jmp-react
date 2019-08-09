import {Button, withStyles, withTheme} from "@material-ui/core";
import {mdiAccountNetworkOutline, mdiDatabase, mdiHexagon, mdiImageSearchOutline} from "@mdi/js";
import React, {useEffect} from "react";
import {GET_INFO_STAT, getInfoHealth} from "../../../actions/Info";
import {connect} from "react-redux";
import StatusIcon from "../../../components/widget/StatusIcon";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	statusOK: {
		color: theme.palette.success.main
	},
	statusFail: {
		color: theme.palette.error.main
	},
	statusWarn: {
		color: theme.palette.warning.main
	},
});

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
)(withStyles(styles)(withTheme(Status)));
