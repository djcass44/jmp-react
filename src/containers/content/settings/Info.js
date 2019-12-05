import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ListSubheader, makeStyles, Typography} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
import InfoItem from "../../../components/content/settings/InfoItem";
import {GET_INFO_ERROR, GET_INFO_SYS, getInfoSystem} from "../../../actions/Info";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import JSONPretty from "react-json-pretty";
import {mdiBugCheckOutline, mdiMemory} from "@mdi/js";
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

export default () => {
	const dispatch = useDispatch();

	const {headers} = useSelector(state => state.auth);
	const {systemInfo, error} = useSelector(state => state.info);
	const systemInfoError = useSelector(state => state.errors[GET_INFO_SYS]);
	const errorLoad = useSelector(state => state.loading[GET_INFO_ERROR]);

	useEffect(() => {
		getInfoSystem(dispatch, headers);
	}, [headers]);
	const classes = useStyles();
	const theme = useTheme();
	const status = (
		<div>
			<Status showReload/>
			<Typography variant={"body1"} className={classes.title}>Recent exceptions</Typography>
			<p>There have been {error.length} exceptions in the last 15 minutes.</p>
			{errorLoad === true ? <LinearProgress className={classes.progress}/> : ""}
		</div>
	);

	return (
		<div>
			<ListSubheader className={classes.title} inset component={"div"}>Information &amp; status</ListSubheader>
			<InfoItem title={<span>Application health</span>} content={status} open={true} icon={
				<Icon style={{paddingRight: 8}} path={mdiBugCheckOutline} size={1} color={theme.palette.error.main}/>
			}/>
			<InfoItem title={<span>System information</span>} content={
				<JSONPretty data={JSON.stringify(systemInfo)}/>
			} error={systemInfoError} icon={
				<Icon style={{paddingRight: 8}} path={mdiMemory} size={1} color={theme.palette.secondary.main}/>
			}/>
		</div>
	);
};
