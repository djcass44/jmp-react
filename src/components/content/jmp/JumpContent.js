import React from "react";
import {Collapse, IconButton, makeStyles, Tooltip, Typography} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
import Icon from "@mdi/react";
import Moment from "react-moment";
import {
	mdiContentCopy,
	mdiDeleteOutline,
	mdiFire,
	mdiOpenInNew,
	mdiPencilOutline
} from "@mdi/js";
import {connect} from "react-redux";
import {Badge} from "evergreen-ui";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	main: {
		padding: 16,
		backgroundColor: theme.palette.background.default
	},
	subtext: {
		color: theme.palette.text.secondary
	}
}));

export const JumpContent = ({jump, ...props}) => {
	const classes = useStyles();
	// This is a recent API
	// There WILL be compatibility issues with its usage
	const handleCopy = text => {
		navigator.clipboard.writeText(text).then(() => { console.log("copied link") });
	};
	const theme = useTheme();
	const secureStatus = jump.location.startsWith("https://") ? {
		secure: true,
		title: "Secure",
		colour: "green"
	} : {
		secure: false,
		title: "Insecure",
		colour: "red"
	};
	const aliases = jump.alias.map(i => {return i.name}).join(", ");
	// Only show edit/delete options if the API will let the user action them
	const hasOwnership = props.isAdmin || jump['personal'] > 0;
	return (
		<Collapse className={classes.main} in={jump.id === props.expanded} unmountOnExit timeout={"auto"}>
			{/* TITLE */}
			<Typography variant={"subtitle1"} className={classes.title}>
				{jump.title}
			</Typography>
			<div style={{padding: 8}}>
				{/* USAGE COUNT */}
				<small className={classes.title}><Icon path={mdiFire} size={0.85} color={theme.palette.warning.main}/>x{jump['metaUsage']}</small>
			</div>
			<Badge color={secureStatus.colour}>{secureStatus.title}</Badge>
			{/* ALIASES */}
			{aliases.length > 0 ? <Typography variant={"body1"}>Aliases: {aliases}</Typography> : ""}
			{/* CREATION */}
			<p className={classes.subtext}>Created <Moment fromNow>{jump['metaCreation']}</Moment></p>
			{/* EDIT */}
			{jump['metaUpdate'] !== jump['metaCreation'] ? <p className={classes.subtext}>Edited <Moment fromNow>{jump['metaUpdate']}</Moment></p>: ""}
			{/* check this browser supports copy before showing the button */}
			{document.queryCommandSupported("copy") &&
				<Tooltip title={"Copy URL"}>
					<IconButton centerRipple={false} onClick={() => handleCopy(jump.location)}>
						<Icon path={mdiContentCopy} size={0.85} color={theme.palette.getContrastText(theme.palette.background.default)}/>
					</IconButton>
				</Tooltip>
			}
			{props.isLoggedIn === true && hasOwnership === true &&
				<Tooltip title={"Edit"}>
					<IconButton centerRipple={false} onClick={() => props.onEdit(jump)}>
						<Icon path={mdiPencilOutline} size={0.85} color={theme.palette.getContrastText(theme.palette.background.default)}/>
					</IconButton>
				</Tooltip>
			}
			<Tooltip title={"Open"}>
				<IconButton centerRipple={false} target={"_blank"} rel={"noopener noreferrer"} href={`/jmp?query=${jump.name}`}>
					<Icon path={mdiOpenInNew} size={0.85} color={theme.palette.getContrastText(theme.palette.background.default)}/>
				</IconButton>
			</Tooltip>
			{props.isLoggedIn === true && hasOwnership === true &&
				<Tooltip title={"Delete"}>
					<IconButton centerRipple={false} onClick={() => props.onDelete(jump.id)}>
						<Icon path={mdiDeleteOutline} size={0.85} color={theme.palette.getContrastText(theme.palette.background.default)}/>
					</IconButton>
				</Tooltip>
			}
		</Collapse>
	);
};
JumpContent.propTypes = {
	jump: PropTypes.object.isRequired,
	isAdmin: PropTypes.bool.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	onDelete: PropTypes.func.isRequired,
	onEdit: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
	isLoggedIn: state.auth.isLoggedIn,
	isAdmin: state.auth.isAdmin,
	expanded: state.jumps.expanded
});
export default connect(
	mapStateToProps,
	null
)(JumpContent);
