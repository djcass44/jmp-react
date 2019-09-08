import Icon from "@mdi/react";
import {IconButton, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Tooltip} from "@material-ui/core";
import {mdiChevronDown, mdiChevronUp} from "@mdi/js";
import JumpContent from "../../../components/content/jmp/JumpContent";
import React from "react";
import PropTypes from "prop-types";
import {setDelete, setJumpEdit, setJumpNew} from "../../../actions/Modal";
import {deleteJump, setJumpExpand} from "../../../actions/Jumps";
import {connect, useSelector} from "react-redux";
import Domain from "../../../components/widget/Domain";
import {useTheme} from "@material-ui/core/styles";
import JumpAvatar from "../../../components/content/jmp/JumpAvatar";

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
				<JumpAvatar jump={jump}/>
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
