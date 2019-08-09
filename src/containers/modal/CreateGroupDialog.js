import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {TextField, withStyles, withTheme} from "@material-ui/core";
import PropTypes from "prop-types";

const styles = () => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
});

export const CreateGroupDialog = props => {
	const defaultTitle = "Add group";

	const handleSubmit = e => {
		props.onSubmit(e);
		props.onExited(e);
	};

	const {classes, theme} = props;
	return (
		<Dialog open={props.open === true} aria-labelledby={"form-dialog-title"} onClose={props.onExited} fullWidth>
			<DialogTitle id={"form-dialog-title"} className={classes.title}>{props.title != null ? props.title : defaultTitle}</DialogTitle>
			<DialogContent>
				<TextField required autoFocus margin={"dense"} id={"name"} label={"Name"} fullWidth />
			</DialogContent>
			<DialogActions>
				<Button color={"secondary"} onClick={props.onExited}>Cancel</Button>
				<Button style={{color: theme.palette.error.main}} onClick={handleSubmit} disabled={true}>Create</Button>
			</DialogActions>
		</Dialog>
	);
};
CreateGroupDialog.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onExited: PropTypes.func.isRequired,
	title: PropTypes.string
};
export default withStyles(styles)(withTheme(CreateGroupDialog));
