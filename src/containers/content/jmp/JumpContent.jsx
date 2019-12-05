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
import {DELETABLE_JUMP, MODAL_JUMP_EDIT, setDelete2, setDialog} from "../../../actions/Modal";
import {mdiContentCopy, mdiDeleteOutline, mdiPencilOutline} from "@mdi/js";
import React, {useEffect, useState} from "react";
import {makeStyles, useTheme} from "@material-ui/styles";
import getHelpCardColour from "../../../selectors/getHelpCardColour";
import PropTypes from "prop-types";
import {CardActions, Link, Popover, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";
import Moment from "react-moment";
import getAvatarFromPalette from "../../../selectors/getAvatarFromPalette";
import getColourFromHex from "../../../style/getColourFromHex";
import getSafeTextColour from "../../../selectors/getSafeTextColour";
import UserPopover from "../../../components/widget/UserPopover";

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

const JumpContent = ({jump, focusProps, palette, loading, error}) => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const theme = useTheme();

	const {isLoggedIn, isAdmin} = useSelector(state => state.auth);

	// state
	const [data, setData] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const [anchorUser, setAnchorUser] = useState(null);

	const hasOwnership = isAdmin || jump.public === false;
	// set the appropriate colours for the card-content
	const avatarPalette = getAvatarFromPalette(theme, "", palette);
	const bg = loading === false && error == null ? getColourFromHex(avatarPalette.bg, 0.2) : getHelpCardColour(theme);
	const card = {
		backgroundColor: bg
	};
	const textStyle = {
		color: getSafeTextColour(theme, bg)
	};

	useEffect(() => {
		const {meta} = jump;
		const metaData = [
			{
				key: "Used",
				value: jump.usage
			},
			{
				key: "Created",
				value: <Moment fromNow>{(meta && meta.created) || jump.metaCreation}</Moment>
			},
			{
				key: "Created by",
				value: <Link onClick={e => {
					setAnchorEl(e.currentTarget);
					setAnchorUser(meta.createdBy);
				}}>
					{meta && meta.createdBy && meta.createdBy}
				</Link>
			}
		];
		// add edited only if the jump has actually been edited
		if (meta.created !== meta.edited) {
			metaData.push({
					key: "Edited",
					value: <Moment fromNow>{(meta && meta.edited) || jump.metaUpdate}</Moment>
				},
				{
					key: "Edited by",
					value: <Link onClick={e => {
						setAnchorEl(e.currentTarget);
						setAnchorUser(meta.editedBy);
					}}>
						{meta && meta.editedBy}
					</Link>
				}
			);
		}
		setData(metaData);
	}, [jump, jump.meta, jump.usage]);

	return (
		<div className={classes.collapse} style={card}>
			<div className={classes.content}>
				<Typography className={classes.title} noWrap variant="subtitle1" style={textStyle}>
					{jump.title || jump.name}
				</Typography>
				<Popover
					open={Boolean(anchorEl)}
					anchorEl={anchorEl}
					onClose={() => setAnchorEl(null)}
					onExited={() => setAnchorUser(null)}
					anchorOrigin={{
						vertical: "top",
						horizontal: "center"
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "center"
					}}>
					<UserPopover user={anchorUser}/>
				</Popover>
				<Table>
					<TableBody>
						{data.map(row => (
							<TableRow key={row.key}>
								<TableCell variant="head">
									{row.key}
								</TableCell>
								<TableCell variant="body">
									{row.value}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
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
						}}
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
						}}
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
								DELETABLE_JUMP,
								jump.public === true,
								jump
							),
							style: {color: theme.palette.error.main}
						}}
						iconProps={{
							path: mdiDeleteOutline,
							color: theme.palette.error.main
						}}
						{...focusProps}
					/>
				</div>}
			</CardActions>
		</div>
	);
};
JumpContent.propTypes = {
	jump: PropTypes.object.isRequired,
	focusProps: PropTypes.object.isRequired,
	palette: PropTypes.object.isRequired
};
export default JumpContent;
