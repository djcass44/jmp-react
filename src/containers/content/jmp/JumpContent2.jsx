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

const useStyles = makeStyles(theme => ({
	item: {
		borderRadius: 12
	},
	itemAction: {
		pointerEvents: "none"
	},
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		color: theme.palette.text.primary
	},
	collapse: {
		padding: theme.spacing(2),
		borderRadius: 12,
		color: theme.palette.text.secondary,
		minHeight: 48
	},
	action: {
		float: "right"
	}
}));

const JumpContent2 = ({jump, focusProps}) => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const theme = useTheme();

	const {isLoggedIn, isAdmin} = useSelector(state => state.auth);

	const hasOwnership = isAdmin || jump.personal > 0;
	// set the appropriate colours for the card-content
	const card = {
		backgroundColor: getHelpCardColour(theme)
	};

	return (
		<div className={classes.collapse} style={card}>
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
						)
					}}
					iconProps={{
						path: mdiDeleteOutline,
						color: theme.palette.error.main
					}
					}
					{...focusProps}
				/>
			</div>
			}
			{(isLoggedIn && hasOwnership) &&
			<div className={classes.action}>
				<JumpButton
					title="Edit"
					buttonProps={{
						onClick: () => setDialog(dispatch,
							MODAL_JUMP_EDIT,
							true,
							{jump}
						)
					}}
					iconProps={{
						path: mdiPencilOutline,
						color: theme.palette.secondary.main
					}
					}
					{...focusProps}
				/>
			</div>
			}
			{document.queryCommandSupported("copy") &&
			<div className={classes.action}>
				<JumpButton
					title="Copy"
					buttonProps={{
						onClick: () => navigator.clipboard.writeText(jump.location).then()
					}}
					iconProps={{
						path: mdiContentCopy,
						color: theme.palette.secondary.main
					}
					}
					{...focusProps}
				/>
			</div>
			}
		</div>
	);
};
JumpContent2.propTypes = {
	jump: PropTypes.object.isRequired,
	focusProps: PropTypes.object.isRequired
};
export default JumpContent2;
