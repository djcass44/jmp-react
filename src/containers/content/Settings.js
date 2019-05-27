import React from "react";
import Typography from "@material-ui/core/Typography";
import Center from "react-center";
import {withTheme, withStyles} from "@material-ui/core";
import Info from "./settings/Info";
import BackButton from "../../components/widget/BackButton";
import General from "./settings/General";

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
		const {classes} = this.props;
		return (
			<div>
				<BackButton label={"Back to home"} to={"/"}/>
				<Center>
					<Typography variant={"h3"} className={classes.title}>Settings</Typography>
				</Center>
				<Center><Typography style={{padding: 24}} variant={"subtitle1"}>Manage JMP and its settings to make yourself more at home</Typography></Center>
				<General/>
				<Info/>
			</div>
		)
	}
}
export default withStyles(styles)(withTheme(Settings));