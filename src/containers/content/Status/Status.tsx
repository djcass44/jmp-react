import {Button, CircularProgress, makeStyles, Typography} from "@material-ui/core";
import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {useTheme} from "@material-ui/core/styles";
import {Theme} from "../../../style/palette";
import StatusPanel from "../settings/Status";
import {getDefault} from "../../../selectors/getTextColour";
import {AxiosError} from "axios";
import {APP_NAME} from "../../../constants";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		fontSize: 72,
		textAlign: "center",
		padding: 24
	},
	message: {
		color: getDefault(theme),
		padding: 8
	},
	root: {
		textAlign: "center"
	}
}));

interface Status {
	code: number,
	http: string,
	database: boolean | string | null,
	identityProvider: boolean | string | null,
	imageApi: boolean
}

/**
 * Generate a decimal value of the actual working components / the expected working components
 * @param status: value from 0.0 to 1.0 stating the amount of working and enabled application components
 */
const getReport = (status: Status) => {
	let expected = 0;
	let actual = 0;
	expected++;
	if(status.http === "OK") {
		actual++;
	}
	if(status.database != null) {
		expected++;
		if(status.database === true || status.database === "OK") {actual++}
	}
	if(status.identityProvider != null) {
		expected++;
		if(status.identityProvider === true || status.identityProvider === "OK") {actual++}
	}
	expected++;
	if(status.imageApi) {actual++}
	return actual / expected;
};

export default ({getInfoHealth, headers, status, loading, error}: {getInfoHealth: Function, headers: object, status: Status, loading: boolean, error: AxiosError | null}) => {
	useEffect(() => {
		window.document.title = `Status - ${APP_NAME}`;
		getInfoHealth(headers);
	}, [getInfoHealth, headers]);

	const theme = useTheme<Theme>();

	const hrStatus = getReport(status);
	let content = {color: theme.palette.success.main, title: "Everything looks okay!", message: "All components appear to be working properly."};
	if(hrStatus === 0)
		content = {color: theme.palette.error.main, title: "System failure", message: "Most or all components are having problems."};
	else if(hrStatus < 1)
		content = {color: theme.palette.warning.main, title: "Something's wrong", message: "One or more components have failed, or are having issues.\nThe application is probably still usable but some features may not be available."};

	const classes = useStyles();
	return (
		<div className={classes.root}>
			<Typography className={classes.title} style={{color: loading === false ? content.color : theme.palette.secondary.main}} variant={"h1"}>
				{loading === true ? "Just a sec" : content.title}
			</Typography>
			<Typography className={classes.message} variant={"subtitle1"}>
				{loading === false ? content.message : ""}
			</Typography>
			{loading === true && <CircularProgress/>}
			<StatusPanel showReload={false}/>
			<Typography className={classes.message} variant={"subtitle2"}>
				{error != null ? `Possible cause: ${error.message}` : ""}
			</Typography>
			<Button component={Link} to="/" color="primary">
				Back to Home
			</Button>
		</div>
	)
};