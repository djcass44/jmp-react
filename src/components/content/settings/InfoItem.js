import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Icon from "@mdi/react";
import {mdiChevronDown} from "@mdi/js";
import {withStyles, withTheme} from "@material-ui/core";
import Banner from "../../widget/Banner";
import ErrorIcon from "@material-ui/icons/ErrorOutline";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	button: {
		// margin: theme.spacing.unit,
	},
	grow: {flexGrow: 1}
});

class InfoItem extends React.Component {
	render() {
		const {classes, theme} = this.props;
		return (
			<ExpansionPanel>
				<ExpansionPanelSummary expandIcon={<Icon path={mdiChevronDown} size={1}/>} aria-controls="panel1bh-content" id="panel1bh-header">
					<Typography className={classes.title}>{this.props.title}</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Banner avatarStyle={{backgroundColor: theme.palette.error.light, color: theme.palette.error.dark}} label={this.props.error} open={this.props.error != null} icon={<ErrorIcon style={{color: theme.palette.error.dark}}/>}/>
					<div>{this.props.content}</div>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}
export default withStyles(styles)(withTheme()(InfoItem));