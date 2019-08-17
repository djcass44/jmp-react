import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {DialogContentText, makeStyles, TextField, Typography, withTheme} from "@material-ui/core";
import PropTypes from "prop-types";
import {setGroupNew} from "../../actions/Modal";
import {connect} from "react-redux";
import {putGroup} from "../../actions/Groups";

const useStyles = makeStyles(() => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		fontSize: 20
	},
	button: {
		fontFamily: "Manrope",
		fontWeight: 'bold'
	}
}));

const CreateGroupDialog = ({open, headers, putGroup, setGroupNew}) => {
	const [name, setName] = useState("");

	const handleSubmit = () => {
		putGroup(headers, name);
		setGroupNew(false);
	};

	const classes = useStyles();
	return (
		<Dialog open={open === true} aria-labelledby={"form-dialog-title"}>
			<DialogTitle id={"form-dialog-title"}>
				<Typography className={classes.title}>Add group</Typography>
			</DialogTitle>
			<DialogContent>
				<DialogContentText>Please enter the name of the group you wish to create. This name must be unique and can be changed later.</DialogContentText>
				<TextField required autoFocus margin={"dense"} id={"name"} label={"Group name"} fullWidth onChange={(e) => setName(e.target.value)}/>
			</DialogContent>
			<DialogActions>
				<Button className={classes.button} color={"secondary"} onClick={() => setGroupNew(false)}>Cancel</Button>
				<Button className={classes.button} color={"primary"} onClick={() => handleSubmit()} disabled={!name.length}>Create</Button>
			</DialogActions>
		</Dialog>
	);
};
CreateGroupDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	headers: PropTypes.object.isRequired,
	putGroup: PropTypes.func.isRequired,
	setGroupNew: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
	open: state.modal.group.new.open,
	headers: state.auth.headers
});
const mapDispatchToProps = ({
	setGroupNew,
	putGroup
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateGroupDialog);
