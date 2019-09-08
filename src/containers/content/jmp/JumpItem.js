import ReactImageFallback from "react-image-fallback";
import Icon from "@mdi/react";
import {
	Avatar,
	IconButton,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	makeStyles,
	Tooltip
} from "@material-ui/core";
import {mdiAccountCircleOutline, mdiAccountGroupOutline, mdiChevronDown, mdiChevronUp, mdiEarth} from "@mdi/js";
import JumpContent from "../../../components/content/jmp/JumpContent";
import React from "react";
import PropTypes from "prop-types";
import {setDelete, setJumpEdit, setJumpNew} from "../../../actions/Modal";
import {deleteJump, setJumpExpand} from "../../../actions/Jumps";
import {connect, useSelector} from "react-redux";
import getAvatarScheme from "../../../style/getAvatarScheme";
import Domain from "../../../components/widget/Domain";
import {useTheme} from "@material-ui/core/styles";
import {usePalette} from "react-palette";
import getAvatarFromPalette from "../../../selectors/getAvatarFromPalette";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	subtitle: {
		color: theme.palette.text.secondary
	}
}));

const JumpItem = ({jump, ...props}) => {
	const classes = useStyles();
	const theme = useTheme();
	const {expanded} = useSelector(state => state.jumps);
	const scheme = getAvatarScheme(theme, jump['personal']);
	let icon;
	switch (jump.personal) {
		default:
			icon = mdiEarth;
			break;
		case 1:
			icon = mdiAccountCircleOutline;
			break;
		case 2:
			icon = mdiAccountGroupOutline;
			break;
	}
	const  {data, loading, error} = usePalette(jump.image);
	console.log(data, loading, error);
	const avatarPalette = getAvatarFromPalette(theme, icon, data);
	const avatar = loading === false && error == null ? {
		icon: icon,
		bg: avatarPalette.bg,
		fg: avatarPalette.fg
	} : {
		icon: icon,
		bg: scheme[0],
		fg: scheme[1]
	};
	// Generate the secondary text and add the owner (if it exists)
	let secondary = (
		<span>
			<Domain text={jump.location}/>
			{jump['owner'] != null ?
				<span>&nbsp;&bull;&nbsp;{jump['owner']}</span>
				:
				""
			}
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
			<ListItem button value={jump.id} onClick={() => props.setJumpExpand(jump.id)}>
				<Avatar component={'div'} style={{backgroundColor: avatar.bg, color: avatar.fg, marginRight: 12}}>
					<ReactImageFallback style={{borderRadius: 64}} src={jump.image} fallbackImage={
						<Icon path={avatar.icon} color={avatar.fg} size={1}/>
					} initialImage={
						<Icon path={avatar.icon} color={avatar.fg} size={1}/>
					}/>
				</Avatar>
				<Tooltip disableFocusListener title={getAliases()} placement={"left"} interactive>
					<ListItemText primary={<span className={classes.title}>{jump.name}</span>} secondary={secondary}/>
				</Tooltip>
				<ListItemSecondaryAction>
					<IconButton centerRipple={false} onClick={() => props.setJumpExpand(jump.id)}>
						<Icon path={jump.id === expanded ? mdiChevronUp : mdiChevronDown} size={1}
						      color={theme.palette.primary.main}/>
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
			<JumpContent jump={jump} onEdit={() => props.setJumpEdit(true, jump)} onDelete={() => props.setDelete(true, jump, jump.personal === 0)}/>
		</div>
	)
};
JumpItem.propTypes = {
	jump: PropTypes.object.isRequired
};
const mapDispatchToProps = ({
	setJumpNew,
	setJumpEdit,
	setDelete,
	setJumpExpand,
	deleteJump
});
export default connect(
	null,
	mapDispatchToProps
)(JumpItem);
