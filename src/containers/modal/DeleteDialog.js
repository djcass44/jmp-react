import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Typography, withStyles, withTheme} from "@material-ui/core";
import PropTypes from "prop-types";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
});

export const DeleteDialog = props => {
	const defaultTitle = "Delete";
	const defaultBody = "Are you sure? This action is immediate and cannot be undone. If you are an admin, be aware that this change may impact functionality for users.";

	const handleSubmit = e => {
		if(typeof(props.onSubmit) === 'function')
			props.onSubmit(e);
		if(typeof(props.onExited) === 'function')
			props.onExited(e);
	};

	const {classes, theme} = props;
	return (
		<Dialog open={props.open === true} aria-labelledby={"form-dialog-title"} onClose={props.onExited}>
			<DialogTitle id={"form-dialog-title"} className={classes.title}>{props.title != null ? props.title : defaultTitle}</DialogTitle>
			<DialogContent>
				<Typography variant={"body1"}>
					{props.body != null ? props.body : defaultBody}
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button color={"secondary"} onClick={props.onExited}>Cancel</Button>
				<Button style={{color: theme.palette.error.main}} onClick={handleSubmit}>Delete</Button>
			</DialogActions>
		</Dialog>
	);
};
DeleteDialog.propTypes = {
	props: PropTypes.object.isRequired
};
export default withStyles(styles)(withTheme(DeleteDialog));
