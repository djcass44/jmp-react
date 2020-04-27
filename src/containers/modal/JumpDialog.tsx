import React, {ChangeEvent, ReactNode, useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
	CircularProgress,
	LinearProgress,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	makeStyles,
	Select,
	TextField,
	Theme,
	Typography
} from "@material-ui/core";
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
import useAuth from "../../hooks/useAuth";

const useStyles = makeStyles((theme: Theme) => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		fontSize: 16
	},
	button: {
		fontFamily: "Manrope",
		fontWeight: "bold",
		textTransform: "none"
	},
	progress: {
		backgroundColor: "transparent"
	},
	li: {
		paddingLeft: 0,
		paddingRight: 0
	},
	actions: {
		marginRight: theme.spacing(1.5)
	},
	textField: {
		paddingTop: 27,
		paddingLeft: 12,
		paddingRight: 12,
		paddingBottom: 10
	},
	textLabel: {
		color: theme.palette.text.secondary
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

const JumpDialog = () => {
	// hooks
	const dispatch = useDispatch();
	const classes = useStyles();

	// global state
	const loadingGroups = useSelector<TState, boolean>(state => state.loading[GET_USER_GROUPS]);
	const loading = useSelector<TState, boolean>(state => state.loading[PUT_JUMP]);
	const error = useSelector<TState, any | null>(state => state.errors[PUT_JUMP]);
	const {headers, isAdmin, isLoggedIn} = useAuth();
	const {userProfile} = useSelector<TState, AuthState>(state => state.auth);
	const {userGroups} = useSelector<TState, GroupsState>(state => state.groups);
	const {open} = useSelector<TState, Modal>(state => state.modal[MODAL_JUMP_NEW] || defaultState);

	const uid = userProfile?.id;

	// local state
	const [name, setName] = useState(initialName);
	const [url, setUrl] = useState(initialUrl);
	const [type, setType] = useState<number>(1); // default to personal
	const [groupId, setGroupId] = useState("");
	const [submit, setSubmit] = useState(false);
	const [groups, setGroups] = useState<Array<ReactNode>>([]);

	const close = () => setDialog(dispatch, MODAL_JUMP_NEW, false, null);

	useEffect(() => {
		resetError(dispatch, PUT_JUMP);
		resetError(dispatch, GET_USER_GROUPS);
		setName(initialName);
		setUrl(initialUrl);
		setType(1);
		setSubmit(false);
		setGroupId("");
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

	useEffect(() => {
		// reset the selected group if the jump type changes
		setGroupId("");
	}, [type]);

	const onSubmit = () => {
		// ignore the type error below, it's fine
		const gid = type === 2 ? `?gid=${groupId}` : "";
		putJump(dispatch, headers, {
			id: 0,
			name: name.value,
			location: url.value,
			personal: type,
			alias: []
		}, gid);
		setSubmit(true);
	};

	const textLabel = (text: string): ReactNode => {
		return <span
			className={classes.textLabel}>
			{text}
		</span>;
	};

	const disabled = (type === 2 && groupId === "") || name.error !== "" || url.error !== "" || loadingGroups || loading || name.value.length === 0 || url.value.length === 0;

	return (
		<Dialog
			open={open}
			maxWidth="xs"
			fullWidth
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
				<List>
					<ListItem className={classes.li}>
						<ListItemText
							primary="Set visibility"
							primaryTypographyProps={{color: "textPrimary"}}
							secondary={type === 0 ? "Visible to all" : type === 1 ? "Visible to me" : "Visible to some"}
							secondaryTypographyProps={{color: "textSecondary"}}
						/>
						<ListItemSecondaryAction style={{right: 0}}>
							<TextField
								style={{minWidth: 100}}
								select
								variant="outlined"
								size="small"
								onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setType(Number(e.target.value))}
								value={type.toString()}>
								<MenuItem value={0} disabled={!isAdmin}>Global</MenuItem>
								<MenuItem value={1}>Personal</MenuItem>
								<MenuItem value={2} disabled={userGroups.length === 0}>Group</MenuItem>
							</TextField>
						</ListItemSecondaryAction>
					</ListItem>
				</List>
				{loadingGroups && <LinearProgress className={classes.progress}/>}
				{type === 2 && userGroups.length > 0 &&
				<Select
					fullWidth
					variant="outlined"
					value={groupId}
					inputProps={{name: "group", id: "group"}}
					onChange={(e: ChangeEvent<{value: unknown}>) => setGroupId(e.target.value as string)}>
					{groups}
				</Select>}
			</DialogContent>
			<DialogActions className={classes.actions}>
				{error && <Typography
					color="error">
					Something went wrong.
				</Typography>}
				{loading && <CircularProgress className={classes.progress} size={15} thickness={8}/>}
				<Button
					className={classes.button}
					color="secondary"
					disabled={loading}
					onClick={() => close()}>
					Cancel
				</Button>
				<Button
					className={classes.button}
					color="primary"
					variant={disabled ? "text" : "contained"}
					disableElevation
					onClick={() => onSubmit()}
					disabled={disabled}>
					Create {APP_NOUN.toLocaleLowerCase()}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
export default JumpDialog;
