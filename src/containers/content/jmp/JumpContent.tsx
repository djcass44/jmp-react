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

import {useDispatch} from "react-redux";
import React from "react";
import {Card, CardContent, makeStyles, MenuItem, Theme, Typography, useTheme} from "@material-ui/core";
import Moment from "react-moment";
import {PaletteColors} from "react-palette";
import {MODAL_JUMP_EDIT, setDelete, setDialog} from "../../../store/actions/Modal";
import {Jump} from "../../../types";
import {APP_NOUN} from "../../../constants";
import useAuth from "../../../hooks/useAuth";
import JumpAvatar from "../../../components/content/jmp/JumpAvatar";

const useStyles = makeStyles((theme: Theme) => ({
	titleContainer: {
		display: "flex",
		alignItems: "center"
	},
	title: {
		fontFamily: "Manrope",
		fontWeight: 400
	},
	subtitle: {
		fontFamily: "Manrope",
		fontWeight: 500,
		fontSize: 12,
		color: theme.palette.text.primary
	},
	deleteItem: {
		color: theme.palette.error.main
	}
}));

interface JumpContentProps {
	jump: Jump;
	focusProps: object;
	palette: PaletteColors;
	loading?: boolean;
	error?: any | null;
}

const JumpContent: React.FC<JumpContentProps> = ({jump, palette, loading = false, error = null}) => {
	// hooks
	const dispatch = useDispatch();
	const classes = useStyles();
	const theme = useTheme<Theme>();

	const {isLoggedIn, isAdmin} = useAuth();

	const hasOwnership = isAdmin || !jump.public;
	const canCopy = document.queryCommandSupported("copy");

	return (
		<div>
			<Card
				variant="outlined">
				<CardContent>
					<Typography
						className={classes.subtitle}>
						Created <Moment fromNow>{jump.meta.created}</Moment>
					</Typography>
					{jump.meta.edited !== jump.meta.created && <Typography
						className={classes.subtitle}>
						Last modified <Moment fromNow>{jump.meta.edited}</Moment>
					</Typography>}
					<div
						className={classes.titleContainer}>
						<JumpAvatar jump={jump} palette={palette} loading={loading} error={error}/>
						<Typography
							className={classes.title}
							style={{color: palette.vibrant || theme.palette.text.primary}}
							variant="h5"
							component="h2">
							{jump.name}
						</Typography>
					</div>
					<Typography color="textSecondary">
						{jump.title}
					</Typography>
				</CardContent>
			</Card>
			<MenuItem
				disabled={!canCopy}
				onClick={() => navigator.clipboard.writeText(jump.location).then()}>
				Copy URL{!canCopy && " - Unsupported"}
			</MenuItem>
			{(isLoggedIn && hasOwnership) && <MenuItem
				onClick={() => dispatch(setDialog(
					MODAL_JUMP_EDIT,
					true,
					{jump}
				))}>
				Edit
			</MenuItem>}
			{(isLoggedIn && hasOwnership) && <MenuItem
				className={classes.deleteItem}
				onClick={() => dispatch(setDelete(
					true,
					{
						deletable: true,
						item: jump,
						requireApproval: jump.public,
						itemClass: APP_NOUN,
						effects: [
							`The ${APP_NOUN.toLocaleLowerCase()} is removed and cannot be restored`,
							"If it was shared to a group or made public, it is now inaccessible to all users"
						]
					}))}>
				Delete
			</MenuItem>}
		</div>
	);
};
export default JumpContent;
