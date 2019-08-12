import ListItem from "@material-ui/core/ListItem";
import ReactImageFallback from "react-image-fallback";
import Icon from "@mdi/react";
import Tooltip from "@material-ui/core/Tooltip";
import {ListItemSecondaryAction, makeStyles, withTheme} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {mdiAccountCircleOutline, mdiAccountGroupOutline, mdiChevronDown, mdiChevronUp, mdiEarth} from "@mdi/js";
import JumpContent from "../../../components/content/jmp/JumpContent";
import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import SchemeHighlight from "../../../components/widget/SchemeHighlight";
import PropTypes from "prop-types";
import {setJumpDelete, setJumpEdit, setJumpNew} from "../../../actions/Modal";
import {deleteJump, setJumpExpand} from "../../../actions/Jumps";
import {connect} from "react-redux";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles(() => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
}));

const JumpItem = ({jump, ...props}) => {
	const classes = useStyles();
	const {palette} = props.theme;
	const avatar = {
		icon: jump['personal'] === 0 ? mdiEarth : jump['personal'] === 1 ? mdiAccountCircleOutline : mdiAccountGroupOutline,
		bg: jump['personal'] === 0 ? palette.primary.light : jump['personal'] === 1 ? palette.success.light : palette.info.light,
		fg: jump['personal'] === 0 ? palette.primary.dark : jump['personal'] === 1 ? palette.success.dark : palette.info.dark
	};
	// Generate the secondary text and add the owner (if it exists)
	let secondary = (
		<span>
			<SchemeHighlight text={jump.location}/>{jump['owner'] != null ? <span>&nbsp;&bull;&nbsp;{jump['owner']}</span> : ""}
		</span>
	);

	const getAliases = () => {
		if(jump.alias.length === 0) return "";
		let items = [];
		jump.alias.forEach((i) => {
			items.push(i.name);
		});
		let alias = items.join(', ');
		return `AKA ${alias}`;
	};
	
	return (
		<div>
			<ListItem button disableRipple value={jump.id} onClick={() => props.setJumpExpand(jump.id)}>
				<Avatar component={'div'} style={{backgroundColor: avatar.bg, color: avatar.fg, marginRight: 12}}>
					<ReactImageFallback style={{borderRadius: 64}} src={jump.image} fallbackImage={<Icon path={avatar.icon} color={avatar.fg} size={1}/>} initialImage={<Icon path={avatar.icon} color={avatar.fg} size={1}/>}/>
				</Avatar>
				<Tooltip disableFocusListener title={getAliases()} placement={"left"} interactive>
					<ListItemText primary={<span className={classes.title}>{jump.name}</span>} secondary={secondary}/>
				</Tooltip>
				<ListItemSecondaryAction>
					<IconButton centerRipple={false} onClick={() => props.setJumpExpand(jump.id)}>
						<Icon path={jump.id === props.expanded ? mdiChevronUp : mdiChevronDown} size={1} color={palette.primary.main}/>
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
			<JumpContent jump={jump} onEdit={() => props.setJumpEdit(true, jump)} onDelete={() => {props.setJumpDelete(true, jump)}}/>
		</div>
	)
};
JumpItem.propTypes = {
	jump: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
	expanded: state.jumps.expanded,
});
const mapDispatchToProps = ({
	setJumpNew,
	setJumpEdit,
	setJumpDelete,
	setJumpExpand,
	deleteJump
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTheme(JumpItem));