/*
 *    Copyright 2019 Django Cass
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import {useDispatch, useSelector} from "react-redux";
import JumpButton from "../../../components/content/jmp/JumpButton";
import {MODAL_JUMP_EDIT, setDelete2, setDialog} from "../../../actions/Modal";
import {deleteJumpDispatch} from "../../../actions/Jumps";
import {mdiContentCopy, mdiDeleteOutline, mdiPencilOutline} from "@mdi/js";
import React from "react";
import {makeStyles, useTheme} from "@material-ui/styles";
import getHelpCardColour from "../../../selectors/getHelpCardColour";
import PropTypes from "prop-types";
import {CardActions, Typography} from "@material-ui/core";
import Moment from "react-moment";
import getAvatarFromPalette from "../../../selectors/getAvatarFromPalette";
import getColourFromHex from "../../../style/getColourFromHex";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
	},
	collapse: {
		padding: theme.spacing(2),
		borderRadius: 12,
		color: theme.palette.text.secondary,
		minHeight: 48
	},
	action: {},
	content: {
		padding: theme.spacing(2)
	}
}));

const JumpContent2 = ({jump, focusProps, palette, loading, error}) => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const theme = useTheme();

	const {isLoggedIn, isAdmin} = useSelector(state => state.auth);

	const hasOwnership = isAdmin || jump.personal > 0;
	// set the appropriate colours for the card-content
	const avatarPalette = getAvatarFromPalette(theme, "", palette);
	const bg = loading === false && error == null ? getColourFromHex(avatarPalette.bg, 0.2) : getHelpCardColour(theme);
	const card = {
		backgroundColor: bg
	};
	const primary = {
		color: avatarPalette.fg
	};

	return (
		<div className={classes.collapse} style={card}>
			<div className={classes.content}>
				<Typography className={classes.title} noWrap variant="subtitle1"
				            style={primary}>{jump.title || jump.name}</Typography>
				<Typography style={primary} variant="caption">
					Used&nbsp;{jump.metaUsage}&nbsp;times
				</Typography>
				<br/>
				<Typography color="secondary" variant="caption">
					Created&nbsp;
					<Moment fromNow>{jump.metaCreation}</Moment>
				</Typography>
				<br/>
				{jump.metaUpdate !== jump.metaCreation && <Typography color="secondary" variant="caption">
					Edited&nbsp;
					<Moment fromNow>{jump.metaUpdate}</Moment>
				</Typography>}
			</div>
			<CardActions>
				{document.queryCommandSupported("copy") &&
				<div className={classes.action}>
					<JumpButton
						title="Copy"
						buttonProps={{
							onClick: () => navigator.clipboard.writeText(jump.location).then(),
							style: {color: theme.palette.secondary.main}
						}}
						iconProps={{
							path: mdiContentCopy,
							color: theme.palette.secondary.main
						}
						}
						{...focusProps}
					/>
				</div>}
				{(isLoggedIn && hasOwnership) &&
				<div className={classes.action}>
					<JumpButton
						title="Edit"
						buttonProps={{
							onClick: () => setDialog(dispatch,
								MODAL_JUMP_EDIT,
								true,
								{jump}
							),
							style: {color: theme.palette.secondary.main}
						}}
						iconProps={{
							path: mdiPencilOutline,
							color: theme.palette.secondary.main
						}
						}
						{...focusProps}
					/>
				</div>}
				{(isLoggedIn && hasOwnership) &&
				<div className={classes.action}>
					<JumpButton
						title="Delete"
						buttonProps={{
							onClick: () => setDelete2(dispatch,
								true,
								deleteJumpDispatch,
								jump.personal === 0,
								jump
							),
							style: {color: theme.palette.error.main}
						}}
						iconProps={{
							path: mdiDeleteOutline,
							color: theme.palette.error.main
						}
						}
						{...focusProps}
					/>
				</div>}
			</CardActions>
		</div>
	);
};
JumpContent2.propTypes = {
	jump: PropTypes.object.isRequired,
	focusProps: PropTypes.object.isRequired,
	palette: PropTypes.object.isRequired
};
export default JumpContent2;
