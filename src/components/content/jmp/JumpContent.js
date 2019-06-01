import React from "react";
import {Collapse, Tooltip, Typography, withStyles, withTheme} from "@material-ui/core";
import Icon from "@mdi/react";
import Moment from "react-moment";
import LockIcon from "@material-ui/icons/LockOutlined";
import LockOpenIcon from "@material-ui/icons/LockOpenOutlined";
import {mdiFire} from "@mdi/js";

const styles = theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	main: {
		padding: 16,
		backgroundColor: "#F5F5F5"
	}
});

class JumpContent extends React.Component {
	render() {
		const {jump, classes, theme} = this.props;
		const secureStatus = jump.location.startsWith("https://") ? {
			title: "This site is encrypted.",
			icon: <LockIcon style={{color: theme.palette.success.main}}/>
		} : {
			title: "This site is insecure",
			icon: <LockOpenIcon color={"error"}/>
		};
		return (
			<Collapse className={classes.main} in={this.props.open} unmountOnExit timeout={"auto"}>
				<Typography variant={"subtitle1"} className={classes.title}>
					{jump.title}
				</Typography>
				<Tooltip disableFocusListener title={secureStatus.title} placement={"bottom"} interactive>
					{secureStatus.icon}
				</Tooltip>
				<small className={classes.title}><Icon path={mdiFire} size={1} color={theme.palette.warning.main}/>x{jump.metaUsage}</small>
				<p>Created <Moment fromNow>{jump.metaCreation}</Moment></p>
				{jump.metaUpdate !== jump.metaCreation ? <p>Edited <Moment fromNow>{jump.metaUpdate}</Moment></p>: ""}
			</Collapse>
		);
	}
}
export default withStyles(styles)(withTheme(JumpContent));