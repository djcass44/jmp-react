import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {CircularProgress, InputLabel, LinearProgress, makeStyles, Select, Typography} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import {useDispatch, useSelector} from "react-redux";
import {GET_USER_GROUPS, getUserGroupsDispatch} from "../../actions/Groups";
import {PUT_JUMP, putJumpDispatch} from "../../actions/Jumps";
import {MODAL_JUMP_NEW, setDialog} from "../../actions/Modal";
import {APP_NOUN} from "../../constants";
import {defaultState} from "../../reducers/Modal";
import {resetError} from "../../actions/Generic";

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
	progress: {
		backgroundColor: "transparent"
	},
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

const JumpDialog = () => {
	// hooks
	const dispatch = useDispatch();

	// seletors
	const loadingGroups = useSelector(state => state.loading[GET_USER_GROUPS]);
	const loading = useSelector(state => state.loading[PUT_JUMP]);
	const error = useSelector(state => state.errors[PUT_JUMP]);
	const {headers, isAdmin, isLoggedIn, userProfile} = useSelector(state => state.auth);
	const {userGroups} = useSelector(state => state.groups);
	const {open} = useSelector(state => state.modal[MODAL_JUMP_NEW] || defaultState);

	const uid = userProfile && userProfile.id;

	const [name, setName] = useState(initialName);
	const [url, setUrl] = useState(initialUrl);
	const [type, setType] = useState('');
	const [groupId, setGroupId] = useState('');
	const [submit, setSubmit] = useState(false);

	const close = () => setDialog(dispatch, MODAL_JUMP_NEW, false);

	useEffect(() => {
		resetError(dispatch, PUT_JUMP);
		resetError(dispatch, GET_USER_GROUPS);
		if (open === true && isLoggedIn === true)
			getUserGroupsDispatch(dispatch, headers, uid);
		setName(initialName);
		setUrl(initialUrl);
		setType("");
		setSubmit(false);
	}, [open]);

	useEffect(() => {
		if (loading === false && submit === true && error == null)
			close();
	}, [loading, error]);

	const onChange = (e, get, set, msg = "Invalid") => {
		const {value} = e.target;
		const error = get.regex.test(value) === true ? "" : msg;
		set({...get, value, error});
	};

	const onNameChange = (e) => onChange(e, name, setName);
	const onUrlChange = (e) => onChange(e, url, setUrl);

	const onSubmit = () => {
		// ignore the type error below, it's fine
		const gid = type === 2 ? `?gid=${groupId}` : '';
		putJumpDispatch(dispatch, headers, JSON.stringify({
			name: name.value,
			location: url.value,
			personal: type,
			alias: []
		}), gid);
		setSubmit(true);
	};

	const classes = useStyles();
	const groups = [];
	userGroups.forEach(g => {
		groups.push(<MenuItem value={g.id} key={g.id}>{g.name}</MenuItem>);
	});
	return (
		<Dialog open={open === true} aria-labelledby={"form-dialog-title"}>
			<DialogTitle id={"form-dialog-title"} className={classes.title}>
				<Typography className={classes.title}>New {APP_NOUN}</Typography>
			</DialogTitle>
			<DialogContent>
				<TextField required autoFocus margin={"dense"} id={"name"} label={"Name"} value={name.value} fullWidth
				           error={name.error.length !== 0} helperText={name.error} onChange={(e) => onNameChange(e)}/>
				<TextField required margin={"dense"} id={"location"} label={"Location"} value={url.value} autoComplete={"url"} fullWidth
				           error={url.error.length !== 0} helperText={url.error} onChange={(e) => onUrlChange(e)}/>
				<FormControl fullWidth>
					<InputLabel htmlFor={"type"}>Type</InputLabel>
					<Select value={type} inputProps={{name: 'type', id: 'type'}} onChange={(e) => setType(e.target.value)}>
						<MenuItem value={0} disabled={isAdmin !== true}>Global</MenuItem>
						<MenuItem value={1}>Personal</MenuItem>
						<MenuItem value={2} disabled={userGroups.length === 0}>Group</MenuItem>
					</Select>
				</FormControl>
				{loadingGroups === true ? <LinearProgress className={classes.progress}/> : ""}
				{type === 2 && userGroups.length > 0 ?
					<FormControl fullWidth>
						<InputLabel htmlFor={"group"}>Group</InputLabel>
						<Select value={groupId} inputProps={{name: "group", id: "group"}}
						        onChange={(e) => setGroupId(e.target.value)}>
							{groups}
						</Select>
					</FormControl>
					:
					""
				}
				<Typography style={{fontWeight: "bold"}} variant={"caption"}
				            color={"error"}>{error && error.toString()}</Typography>
			</DialogContent>
			<DialogActions>
				{loading === true && <CircularProgress className={classes.progress} size={15} thickness={8}/>}
				<Button className={classes.button} color={"secondary"} disabled={submit === true}
				        onClick={() => close()}>Cancel</Button>
				<Button className={classes.button} color={"primary"} onClick={() => onSubmit()}
				        disabled={(type === 2 && groupId === "") || name.error !== "" ||
				        url.error !== "" || loadingGroups === true || loading === true || submit === true ||
				        name.value.length === 0 || url.value.length === 0}>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
};
export default JumpDialog;
