import React from "react";
import {Collapse, IconButton, Tooltip, Typography, withStyles, withTheme} from "@material-ui/core";
import Icon from "@mdi/react";
import Moment from "react-moment";
import LockIcon from "@material-ui/icons/LockOutlined";
import LockOpenIcon from "@material-ui/icons/LockOpenOutlined";
import {
	mdiContentCopy,
	mdiDeleteForeverOutline,
	mdiFire,
	mdiOpenInNew,
	mdiPencilOutline
} from "@mdi/js";

const styles = theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	main: {
		padding: 16,
		backgroundColor: "#F5F5F5"
	}
});

class JumpContent extends React.Component {
	// This is a recent API
	// There WILL be compatability issues with its usage
	handleCopy(e, text) {
		navigator.clipboard.writeText(text);
	}
	render() {
		const {jump, classes, theme} = this.props;
		const secureStatus = jump.location.startsWith("https://") ? {
			title: "This site is encrypted.",
			icon: <LockIcon style={{color: theme.palette.success.main}}/>
		} : {
			title: "This site is insecure",
			icon: <LockOpenIcon color={"error"}/>
		};
		return (
			<Collapse className={classes.main} in={this.props.open} unmountOnExit timeout={"auto"}>
				<Typography variant={"subtitle1"} className={classes.title}>
					{jump.title}
				</Typography>
				<Tooltip disableFocusListener title={secureStatus.title} placement={"bottom"} interactive>
					{secureStatus.icon}
				</Tooltip>
				<small className={classes.title}><Icon path={mdiFire} size={1} color={theme.palette.warning.main}/>x{jump.metaUsage}</small>
				<p>Created <Moment fromNow>{jump.metaCreation}</Moment></p>
				{jump.metaUpdate !== jump.metaCreation ? <p>Edited <Moment fromNow>{jump.metaUpdate}</Moment></p>: ""}
				{document.queryCommandSupported("copy") &&
					<Tooltip title={"Copy URL"}>
						<IconButton centerRipple={false} onClick={(e) => this.handleCopy(e, jump.location)}><Icon path={mdiContentCopy} size={1} color={theme.palette.primary.main}/></IconButton>
					</Tooltip>
				}
				<Tooltip title={"Edit"}>
					<IconButton centerRipple={false} onClick={(e) => {this.props.onEdit(e, jump)}}><Icon path={mdiPencilOutline} size={1} color={theme.palette.secondary.main}/></IconButton>
				</Tooltip>
				<Tooltip title={"Open"}>
					<IconButton centerRipple={false} target={"_blank"} rel={"noopener noreferrer"} href={`/jmp?query=${jump.name}`}><Icon path={mdiOpenInNew} size={1} color={theme.palette.success.main}/></IconButton>
				</Tooltip>
				<Tooltip title={"Delete"}>
					<IconButton centerRipple={false} onClick={(e) => {this.props.onDelete(e, jump.id )}}><Icon path={mdiDeleteForeverOutline} size={1} color={theme.palette.error.main}/></IconButton>
				</Tooltip>
			</Collapse>
		);
	}
}
export default withStyles(styles)(withTheme(JumpContent));