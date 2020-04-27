import React from "react";
import {Card, makeStyles, Theme} from "@material-ui/core";
import Status from "../containers/content/settings/Status";
import useAuth from "../hooks/useAuth";

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
	const {isAdmin} = useAuth();
	const classes = useStyles();

	if (!isAdmin) return null;
	return (
		<div className={classes.root}>
			<Card className={classes.card}>
				<Status/>
			</Card>
		</div>
	);
};

export default AdminPanel;
