import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Icon from "@mdi/react";
import {mdiChevronDown} from "@mdi/js";
import {makeStyles} from "@material-ui/core";
import Banner from "../../widget/Banner";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	content: {
		fontSize: 14,
		flex: 1
	},
	errorIcon: {
		color: theme.palette.error.dark
	}
}));

export const InfoItem = ({title, error, open, icon, content}: {title: string, error: object, open: boolean, icon: string, content: object}) => {
	const classes = useStyles();
	return (
		<ExpansionPanel defaultExpanded={open}>
			<ExpansionPanelSummary expandIcon={<Icon path={mdiChevronDown} size={1}/>} aria-controls="panel1bh-content" id="panel1bh-header">
				{icon}
				<Typography className={classes.title}>{title}</Typography>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails>
				<Banner label={error} open={error != null}/>
				<div className={classes.content}>{content}</div>
			</ExpansionPanelDetails>
		</ExpansionPanel>
	);
};
export default InfoItem;
