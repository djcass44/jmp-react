import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
	InputLabel,
	LinearProgress, makeStyles,
	Select,
	Typography,
	withTheme
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import {connect} from "react-redux";
import {GET_USER_GROUPS, getUserGroups} from "../../actions/Groups";
import {putJump} from "../../actions/Jumps";
import {setJumpNew} from "../../actions/Modal";
import {APP_NOUN} from "../../constants";
import PropTypes from "prop-types";

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
		backgroundColor: theme.palette.background.default
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

const JumpDialog = ({open, headers, ...props}) => {
	const [name, setName] = useState(initialName);
	const [url, setUrl] = useState(initialUrl);
	const [type, setType] = useState('');
	const [groupId, setGroupId] = useState('');

	useEffect(() => {
		if(open === true && props.isLoggedIn === true)
			props.getUserGroups(headers, props.uid);
		setName(initialName);
		setUrl(initialUrl);
	}, [open]);

	const onNameChange = (e) => {
		const {value} = e.target;
		const error = name.regex.test(value) === true ? "" : "Invalid name";
		setName({...name, value, error});
	};
	const onUrlChange = (e) => {
		const {value} = e.target;
		const error = url.regex.test(value) === true ? "" : "Invalid url";
		setUrl({...url, value, error});
	};

	const onSubmit = () => {
		let gid = type === 2 ? `?gid=${groupId}` : '';
		props.putJump(headers, JSON.stringify({
			name: name.value,
			location: url.value,
			personal: type,
			alias: []
		}), gid);
		props.setJumpNew(false);
	};
	
	const classes = useStyles();
	const userGroups = [];
	props.userGroups.forEach(g => {
		userGroups.push(<MenuItem value={g.id} key={g.id}>{g.name}</MenuItem>);
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
						<MenuItem value={0} disabled={props.isAdmin !== true}>Global</MenuItem>
						<MenuItem value={1}>Personal</MenuItem>
						<MenuItem value={2} disabled={props.userGroups.length === 0}>Group</MenuItem>
					</Select>
				</FormControl>
				{props.loadingGroups === true ? <LinearProgress className={classes.progress}/> : ""}
				{type === 2 && props.userGroups.length > 0 ?
					<FormControl fullWidth>
						<InputLabel htmlFor={"group"}>Group</InputLabel>
						<Select value={groupId} inputProps={{name: 'group', id: 'group'}} onChange={(e) => setGroupId(e.target.value)}>
							{userGroups}
						</Select>
					</FormControl>
					:
					""
				}
				<Typography style={{fontWeight: "bold"}} variant={"caption"} color={"error"}>{props.submitError}</Typography>
			</DialogContent>
			<DialogActions>
				<Button className={classes.button} color={"secondary"} onClick={() => props.setJumpNew(false)}>Cancel</Button>
				<Button className={classes.button} color={"primary"} onClick={() => onSubmit()}
				        disabled={(type === 2 && groupId === '') || name.error !== '' ||
				        url.error !== '' || props.loadingGroups === true ||
				        name.value.length === 0 || url.value.length === 0}>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
};
JumpDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	headers: PropTypes.object.isRequired,
	props: PropTypes.object
};
const mapStateToProps = state => ({
	isAdmin: state.auth.isAdmin,
	isLoggedIn: state.auth.isLoggedIn,
	uid: state.auth.userProfile && state.auth.userProfile.id,
	userGroups: state.groups.userGroups,
	loadingGroups: state.loading[GET_USER_GROUPS],
	headers: state.auth.headers,
	open: state.modal.jump.new.open
});
const mapDispatchToProps= ({
	getUserGroups,
	putJump,
	setJumpNew
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTheme(JumpDialog));
