import React from "react";
import Status from "../containers/content/settings/Status";
import {useSelector} from "react-redux";
import {Card, makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
	root: {
		position: "fixed",
		bottom: theme.spacing(2),
		right: theme.spacing(3),
		backgroundColor: "transparent",
		display: "none",
		[theme.breakpoints.up("sm")]: {
			display: "block"
		}
	},
	card: {
		padding: 8
	}
}));

export default () => {
	const {isAdmin} = useSelector(state => state.auth);
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
