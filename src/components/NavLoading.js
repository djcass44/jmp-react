import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {IconButton, makeStyles} from "@material-ui/core";
import Icon from "@mdi/react";
import {mdiHelpCircleOutline} from "@mdi/js";
import {Avatar} from "evergreen-ui";
import LinearProgress from "@material-ui/core/LinearProgress";
import React from "react";

const useStyles = makeStyles(theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
	grow: {flexGrow: 1},
}));

export const NavLoading = () => {
	const classes = useStyles();
	return (
		<div>
			<AppBar position={"static"} color={"default"}>
				<Toolbar>
					<Typography className={classes.title} variant={"h6"} color={"inherit"}>
						{process.env.REACT_APP_APP_NAME}
					</Typography>
					<Typography className={classes.title} style={{fontWeight: 300}} variant={"h6"} color={"inherit"}>
						{process.env.REACT_APP_APP_MSG}
					</Typography>
					<div className={classes.grow}/>
					<div className={classes.sectionDesktop}>
						<IconButton centerRipple={false} color={"inherit"}><Icon path={mdiHelpCircleOutline} size={1}/></IconButton>
						<Avatar size={40} style={{marginTop: 4}} />
					</div>
				</Toolbar>
			</AppBar>
			<LinearProgress style={{flex: 1}}/>
		</div>
	);
};
export default NavLoading;