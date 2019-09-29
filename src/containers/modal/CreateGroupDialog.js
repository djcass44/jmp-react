import React, {useEffect, useState} from 'react';
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
import {MODAL_GROUP_NEW, setDialog} from "../../actions/Modal";
import {useDispatch, useSelector} from "react-redux";
import {PUT_GROUP, putGroup} from "../../actions/Groups";
import ValidatedTextField from "../../components/field/ValidatedTextField";
import {defaultState} from "../../reducers/Modal";
import {resetError} from "../../actions/Generic";

const useStyles = makeStyles(() => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		fontSize: 20
	},
	button: {
		fontFamily: "Manrope",
		fontWeight: 'bold'
	}
}));

const initialName = {
	value: '',
	error: '',
	regex: new RegExp('^[a-zA-Z0-9_.-]{4,}$')
};

export default () => {
	const dispatch = useDispatch();

	const {open} = useSelector(state => state.modal[MODAL_GROUP_NEW] || defaultState);
	const {headers} = useSelector(state => state.auth);
	const loading = useSelector(state => state.loading[PUT_GROUP]);
	const error = useSelector(state => state.errors[PUT_GROUP]);

	const [name, setName] = useState(initialName);
	const [submit, setSubmit] = useState(false);

	useEffect(() => {
		if (loading === false && error == null && submit === true)
			setDialog(dispatch, MODAL_GROUP_NEW, false);
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
		<Dialog open={open === true} onEnter={() => onOpen()} aria-labelledby={"form-dialog-title"}>
			<DialogTitle id={"form-dialog-title"}>
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
						fullWidth: true
					}}
				/>
				{error && <Typography variant="caption" color="error">{error.toString()}</Typography>}
			</DialogContent>
			<DialogActions>
				<Button className={classes.button} color={"secondary"}
				        onClick={() => setDialog(dispatch, MODAL_GROUP_NEW, false)}
				        disabled={loading === true}>Cancel</Button>
				<Button className={classes.button} color={"primary"} onClick={() => handleSubmit()}
				        disabled={name.error !== "" || !name.value.length || loading === true}>Create</Button>
			</DialogActions>
		</Dialog>
	);
};
