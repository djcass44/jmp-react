import React from "react";
import Typography from "@material-ui/core/Typography";
import Center from "react-center";
import {withTheme, withStyles} from "@material-ui/core";
import Info from "./settings/Info";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	button: {
		// margin: theme.spacing.unit,
	},
	grow: {flexGrow: 1}
});

class Settings extends React.Component {
	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}
	render() {
		const {classes, theme} = this.props;
		return (
			<div>
				<Center>
					<Typography variant={"h3"} className={classes.title}>Settings</Typography>
				</Center>
				<Center><Typography variant={"subtitle1"}>Manage JMP and its settings to make yourself more at home</Typography></Center>
				<Info/>
			</div>
		)
	}
}
export default withStyles(styles)(withTheme()(Settings));