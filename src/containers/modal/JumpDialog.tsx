import React, {ChangeEvent, ReactNode, useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {CircularProgress, InputLabel, LinearProgress, makeStyles, Select, Typography} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import {useDispatch, useSelector} from "react-redux";
import {ValidatedTextField} from "jmp-coreui";
import {MODAL_JUMP_NEW, setDialog} from "../../store/actions/Modal";
import {APP_NOUN} from "../../constants";
import {defaultState, Modal} from "../../store/reducers/modal";
import {resetError} from "../../actions/Generic";
import {GET_USER_GROUPS, getUserGroups} from "../../store/actions/groups/GetUserGroups";
import {PUT_JUMP, putJump} from "../../store/actions/jumps/PutJump";
import {TState} from "../../store/reducers";
import {AuthState} from "../../store/reducers/auth";
import {GroupsState} from "../../store/reducers/groups";

const useStyles = makeStyles(() => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		fontSize: 20
	},
	button: {
		fontFamily: "Manrope",
		fontWeight: "bold"
	},
	progress: {
		backgroundColor: "transparent"
	},
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

const JumpDialog = () => {
	// hooks
	const dispatch = useDispatch();
	const classes = useStyles();

	// global state
	const loadingGroups = useSelector<TState, boolean>(state => state.loading[GET_USER_GROUPS]);
	const loading = useSelector<TState, boolean>(state => state.loading[PUT_JUMP]);
	const error = useSelector<TState, any | null>(state => state.errors[PUT_JUMP]);
	const {headers, isAdmin, isLoggedIn, userProfile} = useSelector<TState, AuthState>(state => state.auth);
	const {userGroups} = useSelector<TState, GroupsState>(state => state.groups);
	const {open} = useSelector<TState, Modal>(state => state.modal[MODAL_JUMP_NEW] || defaultState);

	const uid = userProfile?.id;

	// local state
	const [name, setName] = useState(initialName);
	const [url, setUrl] = useState(initialUrl);
	const [type, setType] = useState<number | null>(null);
	const [groupId, setGroupId] = useState("");
	const [submit, setSubmit] = useState(false);
	const [groups, setGroups] = useState<Array<ReactNode>>([]);

	const close = () => setDialog(dispatch, MODAL_JUMP_NEW, false, null);

	useEffect(() => {
		resetError(dispatch, PUT_JUMP);
		resetError(dispatch, GET_USER_GROUPS);
		setName(initialName);
		setUrl(initialUrl);
		setType(null);
		setSubmit(false);
	}, [open]);

	useEffect(() => {
		if (open && isLoggedIn && uid)
			getUserGroups(dispatch, headers, uid);
	}, [uid, open, isLoggedIn]);

	useEffect(() => {
		if (!loading && submit && error == null)
			close();
	}, [loading, error]);

	useEffect(() => {
		setGroups(userGroups.map(g => <MenuItem value={g.id} key={g.id}>{g.name}</MenuItem>));
	}, [userGroups]);

	const onSubmit = () => {
		// ignore the type error below, it's fine
		const gid = type === 2 ? `?gid=${groupId}` : "";
		putJump(dispatch, headers, {
			id: 0,
			name: name.value,
			location: url.value,
			personal: type || 1, // default to personal
			alias: []
		}, gid);
		setSubmit(true);
	};

	return (
		<Dialog
			open={open}
			aria-labelledby="form-dialog-title">
			<DialogTitle id="form-dialog-title" className={classes.title}>
				<Typography className={classes.title}>New {APP_NOUN}</Typography>
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
				<FormControl fullWidth>
					<InputLabel htmlFor="type">Type</InputLabel>
					<Select
						value={type?.toString() || ""}
						inputProps={{name: "type", id: "type"}}
						onChange={(e: ChangeEvent<{value: unknown}>) => setType(Number(e.target.value))}>
						<MenuItem value={0} disabled={!isAdmin}>Global</MenuItem>
						<MenuItem value={1}>Personal</MenuItem>
						<MenuItem value={2} disabled={userGroups.length === 0}>Group</MenuItem>
					</Select>
				</FormControl>
				{loadingGroups ? <LinearProgress className={classes.progress}/> : ""}
				{type === 2 && userGroups.length > 0 &&
				<FormControl fullWidth>
					<InputLabel htmlFor="group">Group</InputLabel>
					<Select value={groupId} inputProps={{name: "group", id: "group"}}
					        onChange={(e: ChangeEvent<{value: unknown}>) => setGroupId(e.target.value as string)}>
						{groups}
					</Select>
				</FormControl>
				}
				{error && <Typography style={{fontWeight: "bold"}} variant="caption"
				                      color="error">{error && error.toString()}</Typography>}
			</DialogContent>
			<DialogActions>
				{loading && <CircularProgress className={classes.progress} size={15} thickness={8}/>}
				<Button className={classes.button} color="secondary" disabled={loading}
				        onClick={() => close()}>Cancel</Button>
				<Button className={classes.button} color="primary" onClick={() => onSubmit()}
				        disabled={(type === 2 && groupId === "") || name.error !== "" ||
				        url.error !== "" || loadingGroups || loading || name.value.length === 0 || url.value.length === 0}>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
};
export default JumpDialog;
