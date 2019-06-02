import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {CircularProgress, InputLabel, Select, Typography, withStyles, withTheme} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import {connect} from "react-redux";
import {GET_USER_GROUPS, getUserGroups} from "../../actions/Groups";
import {PUT_JUMP, putJump} from "../../actions/Jumps";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	button: {
		// margin: theme.spacing.unit,
	},
	grow: {flexGrow: 1}
});

class JumpDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: {
				value: '',
				error: '',
				regex: new RegExp('^[a-zA-Z0-9_.-]*$')
			},
			location: {
				value: '',
				error: '',
				regex: new RegExp('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)')
			},
			type: '',
			groupId: '',
			isAdmin: props.isAdmin,
			uid: props.uid,
			userGroups: props.userGroups,
			headers: props.headers,
			submitted: false,
			exiting: false
		};
		this.handleTypeChange = this.handleTypeChange.bind(this);
		this.handleGroupChange = this.handleGroupChange.bind(this);
		this.handleDialogOpen = this.handleDialogOpen.bind(this);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
		if(nextProps.loadingSubmit === false && this.state.submitted === true && nextProps.submitError == null && this.state.exiting === false) {
			this.setState({exiting: true});
			this.props.onExited();
		}
	}

	handleDialogOpen() {
		this.props.getUserGroups(this.state.headers, this.state.uid);
		const name = {
			value: '',
			error: '',
			regex: new RegExp('^[a-zA-Z0-9_.-]*$')
		};
		const location = {
			value: '',
			error: '',
			regex: new RegExp('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)')
		};
		this.setState({
			type: '',
			groupId: '',
			name: name,
			location: location,
			submitted: false,
			exiting: false
		});
	}

	handleNameChange(e) {
		let val = e.target.value;
		const {name} = this.state;
		name.value = val;
		if(name.regex.test(val) === false)
			name.error = 'Invalid name';
		else
			name.error = '';
		this.setState({name});
	}
	handleUrlChange(e) {
		let val = e.target.value;
		const {location} = this.state;
		location.value = val;
		if(location.regex.test(val) === false)
			location.error = 'Invalid url';
		else
			location.error = '';
		this.setState({location});
	}

	handleTypeChange(e) {
		this.setState({type: e.target.value});
	}
	handleGroupChange(e) {
		this.setState({groupId: e.target.value});
	}

	handleSubmit() {
		let gid = this.state.type === 2 ? `?gid=${this.state.groupId}` : '';
		this.props.putJump(this.state.headers, JSON.stringify({
			name: this.state.name.value,
			location: this.state.location.value,
			personal: this.state.type,
			alias: []
		}), gid);
		this.setState({submitted: true});
		// this.props.onExited();
	}

	render() {
		const {classes} = this.props;
		const userGroups = [];
		this.state.userGroups.forEach(g => {
			userGroups.push(<MenuItem value={g.id} key={g.id}>{g.name}</MenuItem>);
		});
		return (
			<Dialog open={this.props.open === true} aria-labelledby={"form-dialog-title"} onClose={this.props.onExited} onEnter={this.handleDialogOpen}>
				<DialogTitle id={"form-dialog-title"} className={classes.title}>New {process.env.REACT_APP_APP_NOUN}</DialogTitle>
				<DialogContent>
					<TextField required autoFocus margin={"dense"} id={"name"} label={"Name"} value={this.state.name.value} fullWidth error={this.state.name.error.length !== 0} helperText={this.state.name.error} onChange={this.handleNameChange.bind(this)}/>
					<TextField required margin={"dense"} id={"location"} label={"Location"} value={this.state.location.value} autoComplete={"url"} fullWidth error={this.state.location.error.length !== 0} helperText={this.state.location.error} onChange={this.handleUrlChange.bind(this)}/>
					<FormControl fullWidth>
						<InputLabel htmlFor={"type"}>Type</InputLabel>
						<Select value={this.state.type} inputProps={{name: 'type', id: 'type'}} onChange={this.handleTypeChange}>
							<MenuItem value={0} disabled={this.state.isAdmin !== true}>Global</MenuItem>
							<MenuItem value={1}>Personal</MenuItem>
							<MenuItem value={2} disabled={this.state.userGroups.length === 0}>Group</MenuItem>
						</Select>
					</FormControl>
					{this.state.loadingGroups === true ? <CircularProgress/> : ""}
					{this.state.type === 2 && this.state.userGroups.length > 0 ?
						<FormControl fullWidth>
							<InputLabel htmlFor={"group"}>Group</InputLabel>
							<Select value={this.state.groupId} inputProps={{name: 'group', id: 'group'}} onChange={this.handleGroupChange}>
								{userGroups}
							</Select>
						</FormControl>
						:
						""
					}
					<Typography style={{fontWeight: "bold"}} variant={"caption"} color={"error"}>{this.state.submitError}</Typography>				</DialogContent>
				<DialogActions>
					<Button color={"secondary"} onClick={this.props.onExited}>Cancel</Button>
					<Button color={"primary"} onClick={this.handleSubmit.bind(this)} disabled={(this.state.type === 2 && this.state.groupId === '') || this.state.type === '' || this.state.name.error !== '' || this.state.location.error !== '' || this.state.loadingSubmit === true || this.state.loadingGroups === true || this.state.name.value.length === 0 || this.state.location.value.length === 0}>Create</Button>
				</DialogActions>
			</Dialog>
		);
	}
}
const mapStateToProps = state => ({
	isAdmin: state.auth.isAdmin,
	uid: state.auth.userProfile && state.auth.userProfile.id,
	userGroups: state.groups.userGroups,
	loadingGroups: state.loading[GET_USER_GROUPS],
	headers: state.auth.headers,
	loadingSubmit: state.loading[PUT_JUMP],
	submitError: state.errors[PUT_JUMP]
});
const mapDispatchToProps= ({
	getUserGroups,
	putJump
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(JumpDialog)));