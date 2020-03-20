import React, {useEffect, useState} from "react";
import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
	makeStyles,
	Typography
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {DELETABLE_JUMP, MODAL_DELETE, setDialog} from "../../actions/Modal";
import {defaultState} from "../../reducers/Modal";
import {deleteJump} from "../../store/actions/jumps/DeleteJump";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		fontSize: 20
	},
	button: {
		fontFamily: "Manrope",
		fontWeight: "bold"
	},
	red: {
		color: theme.palette.error.main
	}
}));

export default () => {
	// hooks
	const dispatch = useDispatch();

	// seletors
	const {headers} = useSelector(state => state.auth);
	const {other, open} = useSelector(state => state.modal[MODAL_DELETE] || defaultState);

	const [ack, setAck] = useState(false);

	const requireApproval = other.requireApproval || false;
	const deletable = other.deletable || null;

	const defaultTitle = "Delete";
	const defaultBody = `Are you sure? This action is immediate and cannot be undone.` +
		`${requireApproval === true ? " Since this change will likely impact functionality for users, you will need to confirm your actions." : ""}`;

	const title = other.title || defaultTitle;
	const body = other.body || defaultBody;

	useEffect(() => {
		setAck(false);
	}, [open]);

	const close = () => setDialog(dispatch, MODAL_DELETE, false);

	const onSubmit = () => {
		// convert to a switch when there's more cases
		if (deletable === DELETABLE_JUMP) {
			deleteJump(dispatch, headers, other.item.id);
		}
		close();
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
				{requireApproval === true && <FormControlLabel
					className={classes.red}
					control={
						<Checkbox
							className={classes.red}
							checked={ack}
							onChange={(e) => setAck(e.target.checked)}/>
					}
					label={"Use admin power to override"}
				/>}
			</DialogContent>
			<DialogActions>
				<Button className={classes.button} color={"secondary"} onClick={() => close()}>Cancel</Button>
				<Button className={`${classes.button} ${classes.red}`} onClick={() => onSubmit()}
				        disabled={requireApproval === true && ack === false}>Delete</Button>
			</DialogActions>
		</Dialog>
	);
};
