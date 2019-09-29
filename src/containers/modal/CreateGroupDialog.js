import React, {useEffect, useState} from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	makeStyles,
	TextField,
	Typography
} from "@material-ui/core";
import {setGroupNew} from "../../actions/Modal";
import {useDispatch, useSelector} from "react-redux";
import {PUT_GROUP, putGroup} from "../../actions/Groups";

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

export default () => {
	const dispatch = useDispatch();

	const {open} = useSelector(state => state.modal.group.new);
	const {headers} = useSelector(state => state.auth);
	const loading = useSelector(state => state.loading[PUT_GROUP]);
	const error = useSelector(state => state.errors[PUT_GROUP]);

	const [name, setName] = useState("");
	const [submit, setSubmit] = useState(false);

	useEffect(() => {
		if (loading === false && error == null && submit === true)
			setGroupNew(dispatch, false);
	}, [loading, error]);

	const handleSubmit = () => {
		putGroup(dispatch, headers, name);
		setSubmit(true);
	};

	const classes = useStyles();
	return (
		<Dialog open={open === true} aria-labelledby={"form-dialog-title"}>
			<DialogTitle id={"form-dialog-title"}>
				<Typography className={classes.title}>Add group</Typography>
			</DialogTitle>
			<DialogContent>
				<DialogContentText>Please enter the name of the group you wish to create. This name must be unique and
					can only be changed by an admin.</DialogContentText>
				<TextField required autoFocus margin={"dense"} id={"name"} label={"Group name"} fullWidth onChange={(e) => setName(e.target.value)}/>
				{error && <Typography variant="caption" color="error">{error.toString()}</Typography>}
			</DialogContent>
			<DialogActions>
				<Button className={classes.button} color={"secondary"} onClick={() => setGroupNew(dispatch, false)}
				        disabled={loading === true}>Cancel</Button>
				<Button className={classes.button} color={"primary"} onClick={() => handleSubmit()}
				        disabled={!name.length || loading === true}>Create</Button>
			</DialogActions>
		</Dialog>
	);
};
