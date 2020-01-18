import React, {useEffect, useState} from "react";
import {
	Button,
	Checkbox,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
	Typography
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {MODAL_GROUP_EDIT, setDialog} from "../../actions/Modal";
import {defaultState} from "../../reducers/Modal";
import ValidatedTextField from "../../components/field/ValidatedTextField";
import {PATCH_GROUP, patchGroup} from "../../actions/Groups";
import FormControl from "@material-ui/core/FormControl";
import {resetError} from "../../actions/Generic";
import {GET_PROVIDERS, getProviders} from "../../store/actions/auth/GetProviders";

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
	formControl: {
		marginTop: theme.spacing(1),
		minWidth: 250
	}
}));

const initialName = {
	value: '',
	error: '',
	regex: new RegExp('^[a-zA-Z0-9_.-]{4,}$')
};

export default () => {
	// hooks
	const dispatch = useDispatch();
	const classes = useStyles();

	// selectors
	const loading = useSelector(state => state.loading[PATCH_GROUP]);
	const loading2 = useSelector(state => state.loading[GET_PROVIDERS]);
	const error = useSelector(state => state.errors[PATCH_GROUP]);
	const {headers, allProviders} = useSelector(state => state.auth);
	const {other, open} = useSelector(state => state.modal[MODAL_GROUP_EDIT] || defaultState);

	const group = other.group || {};


	const [name, setName] = useState(initialName);
	const [isPublic, setIsPublic] = useState(group.public || false);
	const [defaultFor, setDefaultFor] = useState(group.defaultFor || "");
	const [submit, setSubmit] = useState(false);

	const close = () => setDialog(dispatch, MODAL_GROUP_EDIT, false);

	useEffect(() => {
		if (loading === false && submit === true && error == null)
			close();
	}, [loading, error]);

	const onOpen = () => {
		setName({...initialName, value: group.name});
		setIsPublic(group.public || false);
		setDefaultFor(group.defaultFor || "");
		resetError(dispatch, PATCH_GROUP);
		getProviders(dispatch, headers);
	};

	const onSubmit = () => {
		patchGroup(dispatch, headers, {
			...group,
			name: name.value,
			public: isPublic,
			defaultFor: isPublic !== true && defaultFor
		});
		setSubmit(true);
	};

	return (
		<Dialog open={open === true} aria-labelledby="form-dialog-title" onClose={() => close()}
		        onEnter={() => onOpen()} maxWidth="sm" fullWidth>
			<DialogTitle id="form-dialog-title">
				<Typography className={classes.title}>Edit group</Typography>
			</DialogTitle>
			<DialogContent>
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
				<FormControlLabel
					style={{width: "100%"}}
					control={
						<Checkbox
							checked={group && isPublic === true}
							onChange={(e) => setIsPublic(e.target.checked)}
						/>
					}
					label="Public"
				/>
				{loading2 === true && <CircularProgress size={20}/>}
				{(loading2 === false && allProviders && allProviders.length > 0) &&
				<FormControl className={classes.formControl} fullWidth variant={"outlined"}
				             disabled={isPublic === true}>
					<InputLabel htmlFor="defaultFor">Default for</InputLabel>
					<Select
						value={defaultFor}
						inputProps={{
							name: "defaultFor",
							id: "defaultFor"
						}}
						onChange={(e) => setDefaultFor(e.target.value)}>
						{allProviders.map(i => <MenuItem key={i.first} value={i.first}>{i.first}</MenuItem>)}
					</Select>
				</FormControl>}
				{error && <Typography variant="caption" color="error">{error.toString()}</Typography>}
			</DialogContent>
			<DialogActions>
				<Button className={classes.button} color="secondary" onClick={() => close()}>Cancel</Button>
				<Button className={classes.button} color="primary" onClick={() => onSubmit()}
				        disabled={name.error !== '' || loading === true || loading2 === true || name.value.length === 0}>
					Update
				</Button>
			</DialogActions>
		</Dialog>
	);
};
