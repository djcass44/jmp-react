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
import {mdiChartDonut, mdiContentCopy, mdiDeleteOutline, mdiDelta, mdiPencilOutline, mdiPlusCircle} from "@mdi/js";
import React, {ReactNode, useEffect, useState} from "react";
import {
	CardActions,
	makeStyles,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Theme,
	Typography,
	useTheme
} from "@material-ui/core";
import Moment from "react-moment";
import Icon from "@mdi/react";
import {PaletteColors} from "react-palette";
import JumpButton from "../../../components/content/jmp/JumpButton";
import {MODAL_JUMP_EDIT, setDelete, setDialog} from "../../../store/actions/Modal";
import getHelpCardColour from "../../../selectors/getHelpCardColour";
import getAvatarFromPalette from "../../../selectors/getAvatarFromPalette";
import getColourFromHex from "../../../style/getColourFromHex";
import getSafeTextColour from "../../../selectors/getSafeTextColour";
import {Jump} from "../../../types";
import {APP_NOUN} from "../../../constants";
import useAuth from "../../../hooks/useAuth";

const useStyles = makeStyles((theme: Theme) => ({
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
	},
	icon: {
		width: 24,
		paddingRight: theme.spacing(1)
	}
}));

interface JumpContentProps {
	jump: Jump;
	focusProps: object;
	palette: PaletteColors;
	loading?: boolean;
	error?: any | null;
}

interface JumpData {
	icon: ReactNode;
	key: string;
	value: any;
}

const JumpContent: React.FC<JumpContentProps> = ({jump, focusProps, palette, loading = false, error = null}) => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const theme = useTheme<Theme>();

	const {isLoggedIn, isAdmin} = useAuth();

	// state
	const [data, setData] = useState<Array<JumpData>>([]);

	const hasOwnership = isAdmin || !jump.public;
	// set the appropriate colours for the card-content
	const avatarPalette = getAvatarFromPalette(theme, "", palette);
	let bg: string | null = getHelpCardColour(theme);
	if (loading === false && error == null) {
		try {
			bg = getColourFromHex(avatarPalette.bg, 0.2);
		} catch (e) {
			console.error(e);
		} // this will probably only be thrown by firefox, so just swallow it
	}
	const textStyle = {
		color: getSafeTextColour(theme, bg)
	};

	useEffect(() => {
		const {meta} = jump;
		const metaData = [
			{
				icon: <Icon path={mdiChartDonut} size={0.725} color={theme.palette.success.main}/>,
				key: "Used",
				value: jump.usage
			},
			{
				icon: <Icon path={mdiPlusCircle} size={0.725} color={theme.palette.primary.main}/>,
				key: "Created",
				value: <Moment fromNow>{(meta?.created)}</Moment>
			}
		];
		// add edited only if the jump has actually been edited
		if (meta.created !== meta.edited) {
			metaData.push({
				icon: <Icon path={mdiDelta} size={0.725} color={theme.palette.error.main}/>,
				key: "Edited",
				value: <Moment fromNow>{(meta?.edited)}</Moment>
			});
		}
		setData(metaData);
	}, [jump, jump.meta, jump.usage]);

	return (
		<div className={classes.collapse} style={{backgroundColor: bg || ""}}>
			<div className={classes.content}>
				<Typography className={classes.title} noWrap variant="subtitle1" style={textStyle}>
					{jump.title || jump.name}
				</Typography>
				<Table>
					<TableBody>
						{data.map(row => (
							<TableRow key={row.key}>
								<TableCell className={classes.icon}>
									{row.icon}
								</TableCell>
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
							onClick: () => setDelete(dispatch,
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
								}
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
export default JumpContent;
