import React, {useEffect} from "react";
import Center from "react-center";
import {Avatar, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import Info from "./settings/Info";
import General from "./settings/General";
import Auth from "./settings/Auth";
import {useSelector} from "react-redux";
import Icon from "@mdi/react";
import {mdiCogOutline} from "@mdi/js";
import {APP_NAME} from "../../constants";
import {useTheme} from "@material-ui/core/styles";
import {TState} from "../../store/reducers";
import {AuthState} from "../../store/reducers/auth";

const useStyles = makeStyles((theme: Theme) => ({
	name: {
		fontFamily: "Manrope",
		fontWeight: 500,
		color: theme.palette.secondary.main,
		margin: theme.spacing(2)
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

const Settings: React.FC = () => {
	const classes = useStyles();
	const theme = useTheme();

	useEffect(() => {
		window.document.title = `Settings - ${APP_NAME}`;
	}, []);

	const {isAdmin} = useSelector<TState, AuthState>(state => state.auth);

	return (
		<div>
			<Center>
				<Avatar className={classes.avatar} component={Paper}>
					<Icon path={mdiCogOutline} size={2} color={theme.palette.primary.main}/>
				</Avatar>
			</Center>
			<Center>
				<img height={192} src={"/draw/undraw_preferences_uuo2.svg"} alt={""}/>
			</Center>
			<Center>
				<Typography variant={"h4"} className={classes.name}>Settings</Typography>
			</Center>
			<General/>
			{isAdmin && <Auth/>}
			<Info/>
		</div>
	);
};

export default Settings;
