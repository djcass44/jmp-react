import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles, Typography, withTheme} from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
}));

export const DeleteDialog = props => {
	const defaultTitle = "Delete";
	const defaultBody = "Are you sure? This action is immediate and cannot be undone. If you are an admin, be aware that this change may impact functionality for users.";

	const handleSubmit = e => {
		props.onSubmit(e);
		props.onExited(e);
	};

	const classes = useStyles();
	const {theme} = props;
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
	open: PropTypes.bool,
	title: PropTypes.object,
	body: PropTypes.object,
	onSubmit: PropTypes.func.isRequired,
	onExited: PropTypes.func.isRequired
};
export default withTheme(DeleteDialog);
