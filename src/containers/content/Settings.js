import React, {useEffect} from "react";
import Typography from "@material-ui/core/Typography";
import Center from "react-center";
import {withTheme, withStyles, Paper} from "@material-ui/core";
import Info from "./settings/Info";
import General from "./settings/General";
import Auth from "./settings/Auth";
import {connect} from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@mdi/react";
import {mdiSettingsOutline} from "@mdi/js";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	name: {fontFamily: "Manrope", fontWeight: 500, color: theme.palette.secondary.main},
	button: {
		// margin: theme.spacing.unit,
	},
	grow: {flexGrow: 1},
	avatar: {
		backgroundColor: '#FAFAFA',
		width: 56,
		height: 56,
		borderRadius: 100,
		margin: 24,
		padding: 6
	},
});

export const Settings = props => {
	useEffect(() => {
		window.document.title = `Settings - ${process.env.REACT_APP_APP_NAME}`;
	});

	const {classes, theme} = props;
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
			{props.isAdmin === true ?
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
const mapStateToProps = state => ({
	isAdmin: state.auth.isAdmin
});
export default connect(mapStateToProps, null)(withStyles(styles)(withTheme(Settings)));
