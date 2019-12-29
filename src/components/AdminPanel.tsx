import React from "react";
import Status from "../containers/content/settings/Status";
import {useSelector} from "react-redux";
import {Card, makeStyles, Theme} from "@material-ui/core";
import {TState} from "../store/reducers";

const useStyles = makeStyles((theme: Theme) => ({
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

const AdminPanel: React.FC = () => {
	// @ts-ignore
	const {isAdmin} = useSelector<TState, boolean>(state => state.auth);
	const classes = useStyles();

	if (!isAdmin) return <div/>;
	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<Status/>
			</Card>
		</div>
	);
};

export default AdminPanel;
