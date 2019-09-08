import React from "react";
import Status from "../containers/content/settings/Status";
import {connect} from "react-redux";
import {Card, makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
	root: {
		position: "fixed",
		bottom: theme.spacing(2),
		right: theme.spacing(3),
		backgroundColor: "transparent"
	},
	card: {
		padding: 8
	}
}));

export const AdminPanel = ({isAdmin}) => {
	const classes = useStyles();

	if(isAdmin === false) return <div/>;
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
)(AdminPanel);
