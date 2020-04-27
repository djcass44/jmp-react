import React, {useEffect, useState} from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	makeStyles,
	Typography
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {ValidatedTextField} from "jmp-coreui";
import {MODAL_GROUP_NEW, setDialog} from "../../store/actions/Modal";
import {resetError} from "../../actions/Generic";
import {PUT_GROUP, putGroup} from "../../store/actions/groups/PutGroup";
import {defaultState, Modal} from "../../store/reducers/modal";
import useAuth from "../../hooks/useAuth";
import {TState} from "../../store/reducers";

const useStyles = makeStyles(() => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		fontSize: 20
	},
	button: {
		fontFamily: "Manrope",
		fontWeight: "bold"
	}
}));

const initialName = {
	value: "",
	error: "",
	regex: new RegExp("^[a-zA-Z0-9_.-]{4,}$")
};

export default () => {
	// hooks
	const dispatch = useDispatch();

	// global state
	const {open} = useSelector<TState, Modal>(state => state.modal[MODAL_GROUP_NEW] || defaultState);
	const {headers} = useAuth();
	const loading = useSelector<TState, boolean>(state => state.loading[PUT_GROUP]);
	const error = useSelector<TState, any | null>(state => state.errors[PUT_GROUP]);

	// local state
	const [name, setName] = useState(initialName);
	const [submit, setSubmit] = useState(false);

	useEffect(() => {
		if (!loading && error == null && submit)
			setDialog(dispatch, MODAL_GROUP_NEW, false, null);
	}, [loading, error]);

	const onOpen = () => {
		resetError(dispatch, PUT_GROUP);
		setName(initialName);
		setSubmit(false);
	};

	const handleSubmit = () => {
		putGroup(dispatch, headers, name.value);
		setSubmit(true);
	};

	const classes = useStyles();
	return (
		<Dialog
			open={open}
			onEnter={() => onOpen()}
			aria-labelledby="form-dialog-title">
			<DialogTitle id="form-dialog-title">
				<Typography className={classes.title}>Add group</Typography>
			</DialogTitle>
			<DialogContent>
				<DialogContentText>Please enter the name of the group you wish to create. This name must be unique and
					can only be changed by an admin.</DialogContentText>
				<ValidatedTextField
					data={name}
					setData={setName}
					invalidLabel="Name must be at least 4 characters or _.-"
					fieldProps={{
						required: true,
						autoFocus: true,
						margin: "dense",
						id: "name",
						label: "Name",
						fullWidth: true,
						variant: "outlined"
					}}
				/>
				{error && <Typography variant="caption" color="error">{error.toString()}</Typography>}
			</DialogContent>
			<DialogActions>
				<Button
					className={classes.button}
					color="secondary"
					onClick={() => setDialog(dispatch, MODAL_GROUP_NEW, false, null)}
					disabled={loading}>
					Cancel
				</Button>
				<Button
					className={classes.button}
					color="primary"
					onClick={() => handleSubmit()}
					disabled={name.error !== "" || !name.value.length || loading}>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
};
