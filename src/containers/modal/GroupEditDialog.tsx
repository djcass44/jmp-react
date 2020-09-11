import React, {useEffect, useState} from "react";
import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	LinearProgress,
	makeStyles,
	MenuItem,
	TextField,
	Typography
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {ValidatedTextField} from "jmp-coreui";
import {MODAL_GROUP_EDIT, setDialog} from "../../store/actions/Modal";
import {defaultState, Modal} from "../../store/reducers/modal";
import {GET_PROVIDERS, getProviders} from "../../store/actions/auth/GetProviders";
import {PATCH_GROUP, patchGroup} from "../../store/actions/groups/PatchGroup";
import useAuth from "../../hooks/useAuth";
import {TState} from "../../store/reducers";
import {AuthState} from "../../store/reducers/auth";
import {resetError} from "../../store/actions";
import useLoading from "../../hooks/useLoading";
import {ErrorState} from "../../config/types/Feedback";
import getErrorMessage from "../../selectors/getErrorMessage";

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
	formControl: {
		marginTop: theme.spacing(1),
		minWidth: 250
	}
}));

const initialName = {
	value: "",
	error: "",
	regex: new RegExp("^[a-zA-Z0-9_.-]{4,}$")
};

const GroupEditDialog: React.FC = () => {
	// hooks
	const dispatch = useDispatch();
	const classes = useStyles();
	const {headers} = useAuth();

	// selectors
	const loading = useLoading([PATCH_GROUP]);
	const loading2 = useLoading([GET_PROVIDERS]);
	const error = useSelector<TState, ErrorState | null>(state => state.errors[PATCH_GROUP]);
	const {allProviders} = useSelector<TState, AuthState>(state => state.auth);
	const {other, open} = useSelector<TState, Modal>(state => state.modal[MODAL_GROUP_EDIT] || defaultState);

	const group = other?.group || {};


	const [name, setName] = useState(initialName);
	const [isPublic, setIsPublic] = useState(group.public || false);
	const [defaultFor, setDefaultFor] = useState(group.defaultFor || "");
	const [submit, setSubmit] = useState(false);

	const close = () => dispatch(setDialog(MODAL_GROUP_EDIT, false, null));

	useEffect(() => {
		if (!loading && submit && error == null)
			close();
	}, [loading, error]);

	const onOpen = () => {
		setName({...initialName, value: group.name});
		setIsPublic(group.public || false);
		setDefaultFor(group.defaultFor || "");
		dispatch(resetError(PATCH_GROUP));
		dispatch(getProviders(headers));
	};

	const onSubmit = () => {
		dispatch(patchGroup(headers, {
			...group,
			name: name.value,
			public: isPublic,
			defaultFor: isPublic !== true && defaultFor
		}));
		setSubmit(true);
	};

	return (
		<Dialog
			open={open}
			aria-labelledby="form-dialog-title"
			onClose={() => close()}
			onEnter={() => onOpen()}
			maxWidth="sm"
			fullWidth>
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
						fullWidth: true,
						variant: "outlined"
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
				{loading2 && <LinearProgress/>}
				{(allProviders && allProviders.length > 0) &&
				<TextField
					select
					disabled={isPublic === true || loading2}
					fullWidth
					label="Default for"
					value={defaultFor}
					variant="outlined"
					inputProps={{
						name: "defaultFor",
						id: "defaultFor"
					}}
					onChange={(e) => setDefaultFor(e.target.value)}>
					{allProviders.map(i => <MenuItem key={i.first} value={i.first}>{i.first}</MenuItem>)}
				</TextField>}
				{error && <Typography variant="caption" color="error">{getErrorMessage(error)}</Typography>}
			</DialogContent>
			<DialogActions>
				<Button
					className={classes.button}
					color="secondary"
					onClick={() => close()}>
					Cancel
				</Button>
				<Button
					className={classes.button}
					color="primary"
					onClick={() => onSubmit()}
					disabled={name.error !== "" || loading || loading2 || name.value.length === 0}>
					Update
				</Button>
			</DialogActions>
		</Dialog>
	);
};
export default GroupEditDialog;
