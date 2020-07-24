import React, {ReactNode, useEffect, useState} from "react";
import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	makeStyles,
	Theme,
	Typography
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {ValidatedTextField} from "jmp-coreui";
import ChipInput from "material-ui-chip-input";
import {APP_NOUN} from "../../constants";
import {MODAL_JUMP_EDIT, setDialog} from "../../store/actions/Modal";
import {defaultState, Modal} from "../../store/reducers/modal";
import {PATCH_JUMP, patchJump} from "../../store/actions/jumps/PatchJump";
import {TState} from "../../store/reducers";
import {Alias} from "../../types";
import useAuth from "../../hooks/useAuth";
import {resetError} from "../../store/actions";
import useLoading from "../../hooks/useLoading";

const useStyles = makeStyles((theme: Theme) => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		fontSize: 20
	},
	button: {
		fontFamily: "Manrope",
		fontWeight: "bold",
		textTransform: "none"
	},
	actions: {
		marginRight: theme.spacing(1.5)
	},
	textLabel: {
		color: theme.palette.text.secondary
	},
	field: {
		marginTop: theme.spacing(1)
	}
}));

const initialName = {
	value: "",
	error: "",
	regex: new RegExp("^[a-zA-Z0-9_.-]+$")
};
const initialUrl = {
	value: "",
	error: "",
	regex: new RegExp("https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)")
};

const chipRegex = new RegExp("(^[0-9a-zA-Z]+$)");

export default () => {
	// hooks
	const classes = useStyles();
	const dispatch = useDispatch();

	// global state
	const loading = useLoading([PATCH_JUMP]);
	const error = useSelector<TState, any | null>(state => state.errors[PATCH_JUMP]);
	const {headers} = useAuth();
	const {other, open} = useSelector<TState, Modal>(state => state.modal[MODAL_JUMP_EDIT] || defaultState);

	const jump = other?.jump;


	const [name, setName] = useState(initialName);
	const [url, setUrl] = useState(initialUrl);
	const [alias, setAlias] = useState<Array<string>>([]);
	const [submit, setSubmit] = useState(false);

	const close = (final: boolean = false) => dispatch(setDialog(MODAL_JUMP_EDIT, false, final ? null : other));

	useEffect(() => {
		if (!loading && submit && error == null)
			close();
	}, [loading, error]);

	const onOpen = () => {
		dispatch(resetError(PATCH_JUMP));
		setName({...initialName, value: jump.name});
		setUrl({...initialUrl, value: jump.location});

		const aliases: Array<string> = [];
		jump.alias.forEach((i: Alias) => {
			aliases.push(i.name);
		});
		setAlias(aliases);
	};

	const onSubmit = () => {
		const aliases: Array<Alias> = [];
		alias.forEach(item => {
			let i = -1;
			for (let j = 0; j < jump.alias.length; j++) {
				if (jump.alias[j].name === item) {
					i = j;
					break;
				}
			}
			if (i >= 0) {
				// keep an existing alias
				aliases.push({
					id: jump.alias[i].id,
					name: jump.alias[i].name
				});
			} else {
				// create a new alias
				aliases.push({
					id: 0,
					name: item
				});
			}
		});
		patchJump(dispatch, headers, {
			id: jump.id,
			name: name.value,
			location: url.value,
			personal: jump.public ? 0 : jump.ownerGroup == null ? 1 : 2,
			alias: aliases
		});
		setSubmit(true);
	};

	const textLabel = (text: string): ReactNode => {
		return <span
			className={classes.textLabel}>
			{text}
		</span>;
	};

	const disabled = name.error !== "" || url.error !== "" || loading || name.value.length === 0 || url.value.length === 0;
	return (
		<Dialog
			open={open}
			maxWidth="xs"
			fullWidth
			aria-labelledby="form-dialog-title"
			onExited={() => close(true)}
			onEnter={() => onOpen()}>
			<DialogTitle id="form-dialog-title">
				<Typography className={classes.title}>
					Edit {APP_NOUN}
				</Typography>
			</DialogTitle>
			<DialogContent style={{overflowY: "initial"}}>
				<ValidatedTextField
					data={name}
					setData={setName}
					invalidLabel="Name must be at least 1 character or _.-"
					fieldProps={{
						required: true,
						autoFocus: true,
						margin: "dense",
						id: "name",
						label: textLabel("Name"),
						fullWidth: true,
						variant: "outlined",
						size: "small"
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
						label: textLabel("URL"),
						fullWidth: true,
						autoComplete: "url",
						variant: "outlined",
						size: "small"
					}}
				/>
				<ChipInput
					className={classes.field}
					label={textLabel("Aliases")}
					fullWidth
					defaultValue={alias}
					variant="outlined"
					onChange={(c) => setAlias(c)}
					onBeforeAdd={(c) => chipRegex.test(c)}
					helperText="An alias must be letters and digits only."
				/>
			</DialogContent>
			<DialogActions className={classes.actions}>
				{error && <Typography
					color="error">
					Something went wrong.
				</Typography>}
				{loading && <CircularProgress size={15} thickness={8}/>}
				<Button
					className={classes.button}
					color="secondary"
					onClick={() => close()}
					disabled={loading}>
					Cancel
				</Button>
				<Button
					className={classes.button}
					color="primary"
					variant={disabled ? "text" : "contained"}
					disableElevation
					onClick={() => onSubmit()}
					disabled={disabled}>
					Edit {APP_NOUN.toLocaleLowerCase()}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
