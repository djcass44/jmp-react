import React, {useEffect} from "react";
import {connect} from "react-redux";
import {ListSubheader, makeStyles, Typography} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
import InfoItem from "../../../components/content/settings/InfoItem";
import {
	GET_INFO_APP, GET_INFO_ERROR,
	GET_INFO_SYS,
	getInfoApp, getInfoError,
	getInfoSystem
} from "../../../actions/Info";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import JSONPretty from "react-json-pretty";
import {
	mdiApplication,
	mdiBugCheckOutline,
	mdiMemory
} from "@mdi/js";
import Icon from "@mdi/react";
import Status from "./Status";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	statusOK: {
		color: theme.palette.success.main
	},
	statusFail: {
		color: theme.palette.error.main
	},
	statusWarn: {
		color: theme.palette.warning.main
	},
	progress: {
		backgroundColor: theme.palette.background.default
	}
}));

const Info = ({headers, isAdmin, isLoggedIn, error, ...props}) => {
	useEffect(() => {
		props.getInfoApp(headers);
		props.getInfoSystem(headers);
		props.getInfoError(headers);
	}, []);
	const classes = useStyles();
	const theme = useTheme();
	const status = (
		<div>
			<Status showReload/>
			<Typography variant={"body1"} className={classes.title}>Recent exceptions</Typography>
			<p>There have been {error.length} exceptions in the last 15 minutes.</p>
			{props.errorLoad === true ? <LinearProgress className={classes.progress}/> : ""}
		</div>
	);
	const appInfo = (<JSONPretty data={JSON.stringify(props.appInfo)}/>);
	const sysInfo = (<JSONPretty data={JSON.stringify(props.systemInfo)}/>);
	return (
		<div>
			<ListSubheader className={classes.title} inset component={"div"}>Information &amp; status</ListSubheader>
			<InfoItem title={<span>Application health</span>} content={status} open={true} icon={
				<Icon style={{paddingRight: 8}} path={mdiBugCheckOutline} size={1} color={theme.palette.error.main}/>
			}/>
			<InfoItem title={<span>Application information</span>} content={appInfo} error={props.appInfoError} icon={
				<Icon style={{paddingRight: 8}} path={mdiApplication} size={1} color={theme.palette.info.main}/>
			}/>
			<InfoItem title={<span>System information</span>} content={sysInfo} error={props.systemInfoError} icon={
				<Icon style={{paddingRight: 8}} path={mdiMemory} size={1} color={theme.palette.secondary.main}/>
			}/>
		</div>
	);
};
const mapStateToProps = state => ({
	isAdmin: state.auth.isAdmin,
	isLoggedIn: state.auth.isLoggedIn,
	headers: state.auth.headers,
	appInfo: state.info.appInfo,
	appInfoError: state.errors[GET_INFO_APP],
	systemInfo: state.info.systemInfo,
	systemInfoError: state.errors[GET_INFO_SYS],
	error: state.info.error,
	errorLoad: state.loading[GET_INFO_ERROR]
});
const mapDispatchToProps = ({
	getInfoApp,
	getInfoSystem,
	getInfoError
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Info);
