import React from "react";
import Status from "../containers/content/settings/Status";
import {connect} from "react-redux";
import {Card, withStyles} from "@material-ui/core";

const styles = theme => ({
	root: {
		position: 'absolute',
		bottom: theme.spacing(2),
		right: theme.spacing(3)
	},
	card: {
		padding: 8
	}
});

export const AdminPanel = props => {
	const {classes} = props;

	if(props.isAdmin === false) return "";
	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<Status/>
			</Card>
		</div>
	)
};
const mapStateToProps = state => ({
	isAdmin: state.auth.isAdmin,
	headers: state.auth.headers,
});
export default connect(
	mapStateToProps,
	null
)(withStyles(styles)(AdminPanel));