import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {LinearProgress, ListSubheader, makeStyles, Theme, Typography} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
import InfoItem from "../../../components/content/settings/InfoItem";
import {GET_INFO_ERROR, GET_INFO_SYS, getInfoSystem} from "../../../actions/Info";
import JSONPretty from "react-json-pretty";
import {mdiBugCheckOutline, mdiMemory} from "@mdi/js";
import Icon from "@mdi/react";
import Status from "./Status";
import {TState} from "../../../store/reducers";
import {AuthState} from "../../../store/reducers/auth";

const useStyles = makeStyles((theme: Theme) => ({
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

	const classes = useStyles();
	const theme = useTheme();

	const {headers} = useSelector<TState, AuthState>(state => state.auth);
	// @ts-ignore
	const {systemInfo, error} = useSelector<TState, any>(state => state.info);
	const systemInfoError = useSelector<TState, any | null>(state => state.errors.get(GET_INFO_SYS));
	const errorLoad = useSelector<TState, any | null>(state => state.loading.get(GET_INFO_ERROR));

	useEffect(() => {
		getInfoSystem(dispatch, headers);
	}, [headers]);


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
			<InfoItem title={<span>Application health</span>} content={status} open icon={
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
