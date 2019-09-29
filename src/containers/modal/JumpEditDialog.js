import React, {useEffect, useState} from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	makeStyles,
	TextField,
	Typography
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {PATCH_JUMP, patchJumpDispatch} from "../../actions/Jumps";
import {APP_NOUN} from "../../constants";
import {MODAL_JUMP_EDIT, setDialog} from "../../actions/Modal";
import {defaultState} from "../../reducers/Modal";

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
	regex: new RegExp('^[a-zA-Z0-9_.-]*$')
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
		setName({...initialName, value: jump.name});
		setUrl({...initialUrl, value: jump.location});

		let aliases = [];
		jump.alias.forEach(i => {
			aliases.push(i.name);
		});

		setAlias({...initialAlias, value: aliases.join(",")});
	};

	const onChange = (e, get, set, msg = "Invalid") => {
		const {value} = e.target;
		const error = get.regex.test(value) === true ? "" : msg;
		set({...get, value, error});
	};

	const onNameChange = (e) => onChange(e, name, setName);
	const onUrlChange = (e) => onChange(e, url, setUrl);
	const onAliasChange = (e) => onChange(e, alias, setAlias, "Aliases must be letters or digits separated by commas.");

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
				}
				else {
					aliases.push({
						id: 0,
						name: item
					});
				}
			});
		}
		patchJumpDispatch(dispatch, headers, JSON.stringify({
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
				<TextField className={classes.field} required autoFocus margin={"dense"} id={"name"} label={"Name"}
				           value={name.value} fullWidth
				           error={name.error.length !== 0} helperText={name.error} onChange={(e) => onNameChange(e)}/>
				<TextField className={classes.field} required margin={"dense"} id={"location"} label={"Location"}
				           value={url.value} autoComplete={"url"} fullWidth
				           error={url.error.length !== 0} helperText={url.error} onChange={(e) => onUrlChange(e)}/>
				<TextField className={classes.field} margin={"dense"} id={"alias"} label={"Aliases (comma separated)"}
				           value={alias.value} fullWidth
				           error={alias.error.length !== 0} helperText={alias.error} onChange={(e) => onAliasChange(e)}/>
				<Typography variant={"caption"} color={"error"}>{error}</Typography>
			</DialogContent>
			<DialogActions>
				<Button className={classes.button} color={"secondary"} onClick={() => close()}>Cancel</Button>
				<Button className={classes.button} color={"primary"} onClick={() => onSubmit()}
				        disabled={name.error !== '' || url.error !== '' || alias.error !== '' ||
				        loading === true || name.value.length === 0 || url.value.length === 0}>
					Update
				</Button>
			</DialogActions>
		</Dialog>
	);
};
