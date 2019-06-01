import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {withStyles, withTheme} from "@material-ui/core";
import {connect} from "react-redux";
import {getUserGroups} from "../../actions/Groups";
import {PATCH_JUMP, patchJump} from "../../actions/Jumps";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
});

class JumpEditDialog extends React.Component {
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
			alias: {
				value: '',
				error: '',
				regex: new RegExp('(^([0-9a-zA-Z]+,)*[0-9a-zA-Z]+$|^$)')
			},
			isAdmin: props.isAdmin,
			headers: props.headers,
		};
		this.handleDialogOpen = this.handleDialogOpen.bind(this);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}

	handleDialogOpen() {
		this.props.getUserGroups(this.state.headers, this.state.uid);
		const name = {
			value: this.props.jump.name,
			error: '',
			regex: new RegExp('^[a-zA-Z0-9_.-]*$')
		};
		const location = {
			value: this.props.jump.location,
			error: '',
			regex: new RegExp('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)')
		};
		let aliases = [];
		this.props.jump.alias.forEach(i => {
			aliases.push(i.name);
		});
		const alias = {
			value: aliases.join(","),
			error: '',
			regex: new RegExp('(^([0-9a-zA-Z]+,)*[0-9a-zA-Z]+$|^$)')
		};
		this.setState({
			name: name,
			location: location,
			alias: alias
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
	handleAliasChange(e) {
		let val = e.target.value;
		const {alias} = this.state;
		alias.value = val;
		if(alias.regex.test(val) === false)
			alias.error = 'Aliases must be letters or digits seperated by commas.';
		else
			alias.error = '';
		this.setState({alias});
	}

	handleSubmit() {
		let aliases = [];
		let {jump} = this.props;
		if(this.state.alias.value.length > 0) {
			let a = this.state.alias.value.split(",");
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
		this.props.patchJump(this.state.headers, JSON.stringify({
			id: this.props.jump.id,
			name: this.state.name.value,
			location: this.state.location.value,
			alias: aliases
		}));
		this.props.onExited();
	}

	render() {
		const {classes} = this.props;
		return (
			<Dialog open={this.props.open === true} aria-labelledby={"form-dialog-title"} onClose={this.props.onExited} onEnter={this.handleDialogOpen}>
				<DialogTitle id={"form-dialog-title"} className={classes.title}>Edit {process.env.REACT_APP_APP_NOUN}</DialogTitle>
				<DialogContent>
					<TextField required autoFocus margin={"dense"} id={"name"} label={"Name"} value={this.state.name.value} fullWidth error={this.state.name.error.length !== 0} helperText={this.state.name.error} onChange={this.handleNameChange.bind(this)}/>
					<TextField required margin={"dense"} id={"location"} label={"Location"} value={this.state.location.value} autoComplete={"url"} fullWidth error={this.state.location.error.length !== 0} helperText={this.state.location.error} onChange={this.handleUrlChange.bind(this)}/>
					<TextField margin={"dense"} id={"alias"} label={"Aliases (comma separated)"} value={this.state.alias.value} fullWidth error={this.state.alias.error.length !== 0} helperText={this.state.alias.error} onChange={this.handleAliasChange.bind(this)}/>
				</DialogContent>
				<DialogActions>
					<Button color={"secondary"} onClick={this.props.onExited}>Cancel</Button>
					<Button color={"primary"} onClick={this.handleSubmit.bind(this)} disabled={this.state.name.error !== '' || this.state.location.error !== '' || this.state.alias.error !== '' || this.state.loadingSubmit === true || this.state.name.value.length === 0 || this.state.location.value.length === 0}>Update</Button>
				</DialogActions>
			</Dialog>
		);
	}
}
const mapStateToProps = state => ({
	isAdmin: state.auth.isAdmin,
	headers: state.auth.headers,
	loadingSubmit: state.loading[PATCH_JUMP]
});
const mapDispatchToProps= ({
	getUserGroups,
	patchJump
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(JumpEditDialog)));