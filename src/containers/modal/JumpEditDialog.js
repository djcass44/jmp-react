import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, Typography} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {APP_NOUN} from "../../constants";
import {MODAL_JUMP_EDIT, setDialog} from "../../store/actions/Modal";
import {defaultState} from "../../store/reducers/modal";
import {resetError} from "../../actions/Generic";
import {ValidatedTextField} from "jmp-coreui";
import {PATCH_JUMP, patchJump} from "../../store/actions/jumps/PatchJump";

const useStyles = makeStyles(() => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		fontSize: 20
	},
	button: {
		fontFamily: "Manrope",
		fontWeight: 'bold'
	},
	field: {
		color: "red"
	}
}));

const initialName = {
	value: '',
	error: '',
	regex: new RegExp('^[a-zA-Z0-9_.-]+$')
};
const initialUrl = {
	value: '',
	error: '',
	regex: new RegExp('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)')
};
const initialAlias = {
	value: '',
	error: '',
	regex: new RegExp('(^([0-9a-zA-Z]+,)*[0-9a-zA-Z]+$|^$)')
};

export default () => {
	// hooks
	const dispatch = useDispatch();

	// seletors
	const loading = useSelector(state => state.loading[PATCH_JUMP]);
	const error = useSelector(state => state.errors[PATCH_JUMP]);
	const {headers} = useSelector(state => state.auth);
	const {other, open} = useSelector(state => state.modal[MODAL_JUMP_EDIT] || defaultState);

	const jump = other.jump || {};


	const [name, setName] = useState(initialName);
	const [url, setUrl] = useState(initialUrl);
	const [alias, setAlias] = useState(initialAlias);
	const [submit, setSubmit] = useState(false);

	const close = () => setDialog(dispatch, MODAL_JUMP_EDIT, false);

	useEffect(() => {
		if (loading === false && submit === true && error == null)
			close();
	}, [loading, error]);

	const onOpen = () => {
		resetError(dispatch, PATCH_JUMP);
		setName({...initialName, value: jump.name});
		setUrl({...initialUrl, value: jump.location});

		let aliases = [];
		jump.alias.forEach(i => {
			aliases.push(i.name);
		});

		setAlias({...initialAlias, value: aliases.join(",")});
	};

	const onSubmit = () => {
		const aliases = [];
		if(alias.value.length > 0) {
			let a = alias.value.split(",");
			a.forEach(item => {
				let i = -1;
				for (let j = 0; j < jump.alias.length; j++) {
					if(jump.alias[j].name === item) {
						i = j;
						break;
					}
				}
				if(i >= 0) {
					aliases.push({
						id: jump.alias[i].id,
						name: jump.alias[i].name
					});
				} else {
					aliases.push({
						id: 0,
						name: item
					});
				}
			});
		}
		patchJump(dispatch, headers, JSON.stringify({
			id: jump.id,
			name: name.value,
			location: url.value,
			alias: aliases
		}));
		setSubmit(true);
	};

	const classes = useStyles();
	return (
		<Dialog open={open === true} aria-labelledby={"form-dialog-title"} onClose={() => close()}
		        onEnter={() => onOpen()}>
			<DialogTitle id={"form-dialog-title"}>
				<Typography className={classes.title}>Edit {APP_NOUN}</Typography>
			</DialogTitle>
			<DialogContent>
				<ValidatedTextField
					data={name}
					setData={setName}
					invalidLabel="Name must be at least 1 character or _.-"
					fieldProps={{
						required: true,
						autoFocus: true,
						margin: "dense",
						id: "name",
						label: "Name",
						fullWidth: true
					}}
				/>
				<ValidatedTextField
					data={url}
					setData={setUrl}
					invalidLabel="Must be a valid URL"
					fieldProps={{
						required: true,
						margin: "dense",
						id: "url",
						label: "URL",
						fullWidth: true,
						autoComplete: "url"
					}}
				/>
				<ValidatedTextField
					data={alias}
					setData={setAlias}
					invalidLabel="Aliases must be letters or digits separated by commas."
					fieldProps={{
						required: true,
						margin: "dense",
						id: "alias",
						label: "Aliases",
						fullWidth: true
					}}
				/>
				{error && <Typography variant={"caption"} color={"error"}>{error.toString()}</Typography>}
			</DialogContent>
			<DialogActions>
				<Button className={classes.button} color={"secondary"} onClick={() => close()}
				        disabled={loading === true}>Cancel</Button>
				<Button className={classes.button} color={"primary"} onClick={() => onSubmit()}
				        disabled={name.error !== '' || url.error !== '' || alias.error !== '' ||
				        loading === true || name.value.length === 0 || url.value.length === 0}>
					Update
				</Button>
			</DialogActions>
		</Dialog>
	);
};
