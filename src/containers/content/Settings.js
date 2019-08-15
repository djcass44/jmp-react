import React, {useEffect} from "react";
import Typography from "@material-ui/core/Typography";
import Center from "react-center";
import {withTheme, Paper, makeStyles} from "@material-ui/core";
import Info from "./settings/Info";
import General from "./settings/General";
import Auth from "./settings/Auth";
import {connect} from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@mdi/react";
import {mdiSettingsOutline} from "@mdi/js";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
	name: {fontFamily: "Manrope", fontWeight: 500, color: theme.palette.secondary.main},
	avatar: {
		width: 56,
		height: 56,
		borderRadius: 100,
		margin: 24,
		padding: 6
	},
}));

export const Settings = props => {
	useEffect(() => {
		window.document.title = `Settings - ${process.env.REACT_APP_APP_NAME}`;
	}, []);

	const classes = useStyles();
	const {theme} = props;
	return (
		<div>
			<Center>
				<Avatar className={classes.avatar} style={{backgroundColor: theme.palette.background.paper}} component={Paper}>
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
Settings.propTypes = {
	isAdmin: PropTypes.bool
};

const mapStateToProps = state => ({
	isAdmin: state.auth.isAdmin
});
export default connect(
	mapStateToProps,
	null
)(withTheme(Settings));
