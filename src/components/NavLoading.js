import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {IconButton, makeStyles, withTheme} from "@material-ui/core";
import Icon from "@mdi/react";
import {mdiHelpCircleOutline} from "@mdi/js";
import {Avatar} from "evergreen-ui";
import LinearProgress from "@material-ui/core/LinearProgress";
import React from "react";
import getIconColour from "../style/getIconColour";
import {APP_NAME} from "../constants";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
	grow: {
		flexGrow: 1
	},
	progress: {
		flex: 1,
		backgroundColor: theme.palette.background.default
	},
	avatar: {
		marginTop: 4
	}
}));

export const NavLoading = ({theme}) => {
	const classes = useStyles();
	return (
		<div>
			<AppBar position={"static"} color={"default"}>
				<Toolbar>
					<Typography className={classes.title} variant={"h6"} color={"inherit"}>
						{APP_NAME}
					</Typography>
					<Typography className={classes.title} style={{fontWeight: 300}} variant={"h6"} color={"inherit"}>
						{process.env.REACT_APP_APP_MSG}
					</Typography>
					<div className={classes.grow}/>
					<div className={classes.sectionDesktop}>
						<IconButton centerRipple={false} color={"inherit"}>
							<Icon path={mdiHelpCircleOutline} size={1} color={getIconColour(theme)}/>
						</IconButton>
					</div>
					<Avatar size={40} className={classes.avatar} />
				</Toolbar>
			</AppBar>
			<LinearProgress className={classes.progress}/>
		</div>
	);
};
export default withTheme(NavLoading);