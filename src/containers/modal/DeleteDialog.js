import React, {useEffect, useState} from 'react';
import {Checkbox, DialogContentText, FormControlLabel, makeStyles, Typography, withTheme, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {setDelete} from "../../actions/Modal";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		fontSize: 20
	},
	button: {
		fontFamily: "Manrope",
		fontWeight: 'bold'
	},
	override: {
		color: theme.palette.error.main
	}
}));

export const DeleteDialog = ({open, title, body, requireApproval, ...props}) => {
	const [ack, setAck] = useState(false);

	const defaultTitle = "Delete";
	const defaultBody = `Are you sure? This action is immediate and cannot be undone.` +
		`${requireApproval === true ? "Since this change will likely impact functionality for users, you will need to be certain of your actions." : ""}`;

	useEffect(() => {
		setAck(false);
	}, [open]);

	const onSubmit = () => {
		props.onSubmit();
		props.setDelete(false, null);
	};
	const onExit = () => {
		props.setDelete(false, null);
	};

	const classes = useStyles();
	return (
		<Dialog open={open === true} aria-labelledby={"form-dialog-title"}>
			<DialogTitle id={"form-dialog-title"}>
				<Typography className={classes.title}>{title != null ? title : defaultTitle}</Typography>
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{body != null ? body : defaultBody}
				</DialogContentText>
				{requireApproval === true
					?
					<FormControlLabel className={classes.override} control={
						<Checkbox className={classes.override} checked={ack} onChange={(e) => setAck(e.target.checked)}/>
					} label={"Use admin power to override"}/>
					:
					""
				}
			</DialogContent>
			<DialogActions>
				<Button className={classes.button} color={"secondary"} onClick={() => onExit()}>Cancel</Button>
				<Button className={classes.button} color={"primary"} onClick={() => onSubmit()} disabled={requireApproval === true && ack === false}>Delete</Button>
			</DialogActions>
		</Dialog>
	);
};
DeleteDialog.propTypes = {
	open: PropTypes.bool,
	title: PropTypes.object,
	body: PropTypes.object,
	requireApproval: PropTypes.bool,
	onSubmit: PropTypes.func.isRequired
};
DeleteDialog.defaultProps = {
	requireApproval: false
};
const mapStateToProps = state => ({
	isAdmin: state.auth.isAdmin,
	requireApproval: state.modal.generic.delete.requireApproval,
	open: state.modal.generic.delete.open,
});
const mapDispatchToProps = ({
	setDelete
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTheme(DeleteDialog));
