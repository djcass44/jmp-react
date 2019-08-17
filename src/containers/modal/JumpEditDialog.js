import React, {useEffect, useState} from 'react';
import {makeStyles, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {connect} from "react-redux";
import {PATCH_JUMP, patchJump} from "../../actions/Jumps";
import {APP_NOUN} from "../../constants";

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

const JumpEditDialog = ({headers, jump, open, loadingSubmit, submitError, onExited, patchJump}) => {
	const [name, setName] = useState(initialName);
	const [url, setUrl] = useState(initialUrl);
	const [alias, setAlias] = useState(initialAlias);
	const [submit, setSubmit] = useState(false);

	useEffect(() => {
		if(loadingSubmit === false && submit === true && submitError == null)
			onExited();
	}, [loadingSubmit, submitError]);

	const onOpen = () => {
		setName({...initialName, value: jump.name});
		setUrl({...initialUrl, value: jump.location});

		let aliases = [];
		jump.alias.forEach(i => {
			aliases.push(i.name);
		});

		setAlias({...initialAlias, value: aliases.join(",")});
	};

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
	const onAliasChange = (e) => {
		const {value} = e.target;
		const error = alias.regex.test(value) === true ? "" : "Aliases must be letters or digits separated by commas.";
		setAlias({...alias, value, error});
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
				}
				else {
					aliases.push({
						id: 0,
						name: item
					});
				}
			});
		}
		patchJump(headers, JSON.stringify({
			id: jump.id,
			name: name.value,
			location: url.value,
			alias: aliases
		}));
		setSubmit(true);
	};

	const classes = useStyles();
	return (
		<Dialog open={open === true} aria-labelledby={"form-dialog-title"} onClose={() => onExited()} onEnter={() => onOpen()}>
			<DialogTitle id={"form-dialog-title"}>
				<Typography className={classes.title}>Edit {APP_NOUN}</Typography>
			</DialogTitle>
			<DialogContent>
				<TextField required autoFocus margin={"dense"} id={"name"} label={"Name"} value={name.value} fullWidth
				           error={name.error.length !== 0} helperText={name.error} onChange={(e) => onNameChange(e)}/>
				<TextField required margin={"dense"} id={"location"} label={"Location"} value={url.value} autoComplete={"url"} fullWidth
				           error={url.error.length !== 0} helperText={url.error} onChange={(e) => onUrlChange(e)}/>
				<TextField margin={"dense"} id={"alias"} label={"Aliases (comma separated)"} value={alias.value} fullWidth
				           error={alias.error.length !== 0} helperText={alias.error} onChange={(e) => onAliasChange(e)}/>
				<Typography variant={"caption"} color={"error"}>{submitError}</Typography>
			</DialogContent>
			<DialogActions>
				<Button className={classes.button} color={"secondary"} onClick={() => onExited()}>Cancel</Button>
				<Button className={classes.button} color={"primary"} onClick={() => onSubmit()}
				        disabled={name.error !== '' || url.error !== '' || alias.error !== '' ||
				        loadingSubmit === true || name.value.length === 0 || url.value.length === 0}>
					Update
				</Button>
			</DialogActions>
		</Dialog>
	);
};
const mapStateToProps = state => ({
	headers: state.auth.headers,
	loadingSubmit: state.loading[PATCH_JUMP],
	submitError: state.errors[PATCH_JUMP]
});
const mapDispatchToProps= ({
	patchJump
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(JumpEditDialog);
