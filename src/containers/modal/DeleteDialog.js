import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Typography, withStyles, withTheme} from "@material-ui/core";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
});

class DeleteDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			defaultTitle: "Delete",
			defaultBody: "Are you sure? This action is immediate and cannot be undone. If you are an admin, be aware that this change may impact functionality for users."
		};
	}

	handleSubmit(e) {
		if(typeof(this.props.onSubmit) === 'function')
			this.props.onSubmit(e);
		if(typeof(this.props.onExited) === 'function')
			this.props.onExited(e);
	}

	render() {
		const {classes, theme} = this.props;
		return (
			<Dialog open={this.props.open === true} aria-labelledby={"form-dialog-title"} onClose={this.props.onExited}>
				<DialogTitle id={"form-dialog-title"} className={classes.title}>{this.props.title != null ? this.props.title : this.state.defaultTitle}</DialogTitle>
				<DialogContent>
					<Typography variant={"body1"}>
						{this.props.body != null ? this.props.body : this.state.defaultBody}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button color={"secondary"} onClick={this.props.onExited}>Cancel</Button>
					<Button style={{color: theme.palette.error.main}} onClick={this.handleSubmit.bind(this)} >Delete</Button>
				</DialogActions>
			</Dialog>
		);
	}
}
export default withStyles(styles)(withTheme(DeleteDialog));
