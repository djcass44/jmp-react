import React, {useEffect} from "react";
import Center from "react-center";
import {Paper, makeStyles, Typography, Avatar} from "@material-ui/core";
import Info from "./settings/Info";
import General from "./settings/General";
import Auth from "./settings/Auth";
import {useSelector} from "react-redux";
import Icon from "@mdi/react";
import {mdiSettingsOutline} from "@mdi/js";
import {APP_NAME} from "../../constants";
import {useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	name: {
		fontFamily: "Manrope",
		fontWeight: 500,
		color: theme.palette.secondary.main
	},
	avatar: {
		width: 56,
		height: 56,
		borderRadius: 100,
		margin: 24,
		padding: 6,
		backgroundColor: theme.palette.background.default
	},
}));

export default () => {
	useEffect(() => {
		window.document.title = `Settings - ${APP_NAME}`;
	}, []);

	const isAdmin = useSelector(state => state.auth.isAdmin);

	const classes = useStyles();
	const theme = useTheme();
	return (
		<div>
			<Center>
				<Avatar className={classes.avatar} component={Paper}>
					<Icon path={mdiSettingsOutline} size={2} color={theme.palette.primary.main}/>
				</Avatar>
			</Center>
			<Center>
				<Typography variant={"h4"} className={classes.name}>Settings</Typography>
			</Center>
			<General/>
			{isAdmin === true ?
				<div>
					<Auth/>
					<Info/>
				</div>
				:
				""
			}
		</div>
	);
};
