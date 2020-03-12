import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ListSubheader, makeStyles, Theme} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
import InfoItem from "../../../components/content/settings/InfoItem";
import JSONPretty from "react-json-pretty";
import {mdiBugCheckOutline, mdiMemory} from "@mdi/js";
import Icon from "@mdi/react";
import Status from "./Status";
import {TState} from "../../../store/reducers";
import {AuthState} from "../../../store/reducers/auth";
import {GET_INFO_SYS, getInfoSystem} from "../../../store/actions/info/GetInfoSystem";

const useStyles = makeStyles((theme: Theme) => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	icon: {
		paddingRight: theme.spacing(1)
	}
}));

const Info: React.FC = () => {
	// hooks
	const dispatch = useDispatch();
	const classes = useStyles();
	const {palette} = useTheme();

	// global state
	const {headers} = useSelector<TState, AuthState>(state => state.auth);
	// @ts-ignore
	const {systemInfo} = useSelector<TState, object>(state => state.info);
	const systemInfoError = useSelector<TState, any | null>(state => state.errors[GET_INFO_SYS]);

	useEffect(() => {
		getInfoSystem(dispatch, headers);
	}, [headers]);

	return (
		<div>
			<ListSubheader
				className={classes.title}
				inset>
				Information &amp; status
			</ListSubheader>
			<InfoItem
				title={<span>Application health</span>}
				content={<Status showReload/>}
				open
				icon={
					<Icon className={classes.icon} path={mdiBugCheckOutline} size={1} color={palette.error.main}/>
				}/>
			<InfoItem
				title={<span>System information</span>}
				content={
					<JSONPretty data={JSON.stringify(systemInfo)}/>
				}
				error={systemInfoError} icon={
				<Icon className={classes.icon} path={mdiMemory} size={1} color={palette.secondary.main}/>
			}/>
		</div>
	);
};
export default Info;
