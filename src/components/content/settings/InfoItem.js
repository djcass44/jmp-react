import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Icon from "@mdi/react";
import {mdiChevronDown} from "@mdi/js";
import {makeStyles, withTheme} from "@material-ui/core";
import Banner from "../../widget/Banner";
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	content: {
		fontSize: 14,
		flex: 1
	},
	button: {
		// margin: theme.spacing.unit,
	},
	grow: {flexGrow: 1}
}));

export const InfoItem = props => {
	const classes = useStyles();
	const {theme} = props;
	const {error} = theme.palette;
	return (
		<ExpansionPanel defaultExpanded={props.open}>
			<ExpansionPanelSummary expandIcon={<Icon path={mdiChevronDown} size={1}/>} aria-controls="panel1bh-content" id="panel1bh-header">
				{props.icon}
				<Typography className={classes.title}>{props.title}</Typography>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails>
				<Banner avatarStyle={{backgroundColor: error.light, color: error.dark}}
			        label={props.error} open={props.error != null} icon={<ErrorIcon style={{color: error.dark}}/>}/>
				<div className={classes.content}>{props.content}</div>
			</ExpansionPanelDetails>
		</ExpansionPanel>
	);
};
InfoItem.propTypes = {
	open: PropTypes.bool,
	title: PropTypes.object.isRequired,
	error: PropTypes.string,
	content: PropTypes.object.isRequired
};
export default withTheme(InfoItem);
