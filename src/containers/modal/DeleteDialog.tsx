import React, {ChangeEvent, useEffect, useState} from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
	makeStyles,
	Switch,
	Theme,
	Typography,
	useTheme
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import Icon from "@mdi/react";
import {mdiAlert} from "@mdi/js";
import {DeleteItemPayload, MODAL_DELETE, setDialog} from "../../store/actions/Modal";
import {defaultState, Modal} from "../../store/reducers/modal";
import {deleteJump} from "../../store/actions/jumps/DeleteJump";
import {TState} from "../../store/reducers";
import useAuth from "../../hooks/useAuth";

const useStyles = makeStyles((theme: Theme) => ({
	dialogTitle: {
		backgroundColor: theme.palette.error.main
	},
	titleIcon: {
		float: "left",
		paddingRight: theme.spacing(1),
		paddingTop: theme.spacing(0.5)
	},
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		fontSize: 20,
		color: theme.palette.error.contrastText
	},
	button: {
		fontFamily: "Manrope",
		fontWeight: "bold",
		textTransform: "none"
	},
	red: {
		color: theme.palette.error.main
	},
	approval: {
		fontSize: 14
	},
	text: {
		fontSize: 14,
		color: theme.palette.text.primary
	},
	effectText: {
		fontSize: 13,
		color: theme.palette.text.secondary
	}
}));

export default () => {
	// hooks
	const dispatch = useDispatch();
	const theme = useTheme();

	// global state
	const {headers} = useAuth();
	const {open, other} = useSelector<TState, Modal>(state => state.modal[MODAL_DELETE] || defaultState);

	// local state
	const [ack, setAck] = useState(false);

	const payload = other as DeleteItemPayload | null;
	const requireApproval = payload?.requireApproval || false;
	const deletable = payload?.deletable || null;

	useEffect(() => {
		setAck(false);
	}, [open]);

	/**
	 * Close the dialog and cleanup resources
	 * @param final: when true, 'other' content is set to null. Only set this to true once the dialog is CLOSED (i.e. not visible to the user)
	 */
	const close = (final: boolean = false) => dispatch(setDialog(MODAL_DELETE, false, final ? null : other));

	const onSubmit = () => {
		// convert to a switch when there's more cases
		if (deletable === true) {
			dispatch(deleteJump(headers, other.item.id));
		}
		close();
	};

	const classes = useStyles();
	return (
		<Dialog
			open={open}
			onExited={() => close(true)}
			aria-labelledby="form-dialog-title">
			<DialogTitle
				className={classes.dialogTitle}
				id="form-dialog-title">
				<Icon
					className={classes.titleIcon}
					path={mdiAlert}
					size={1}
					color={theme.palette.error.contrastText}
				/>
				<Typography className={classes.title}>Delete {payload?.itemClass?.toLocaleLowerCase()}</Typography>
			</DialogTitle>
			{payload != null && <DialogContent>
				<DialogContentText className={classes.text}>
					When you delete a {payload.itemClass.toLocaleLowerCase()}, this immediately happens:
				</DialogContentText>
				<ul>
					{payload.effects?.map((i, idx) => <li
						key={`${idx}-${i}`}
						className={classes.effectText}>
						{i}
					</li>)}
				</ul>
				{requireApproval && <FormControlLabel
					classes={{label: `${classes.approval} ${classes.red}`}}
					control={
						<Switch
							color="primary"
							checked={ack}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setAck(e.target.checked)}/>
					}
					label="Use admin power to override"
				/>}
			</DialogContent>}
			<DialogActions>
				<Button
					className={classes.button}
					color="secondary"
					onClick={() => close()}>
					Cancel
				</Button>
				<Button
					className={`${classes.button} ${classes.red}`}
					variant={(requireApproval && !ack) ? "text" : "contained"}
					disableElevation
					onClick={() => onSubmit()}
					disabled={requireApproval && !ack}>
					Delete {payload?.itemClass?.toLocaleLowerCase()}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
