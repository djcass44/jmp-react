/*
 *    Copyright 2020 Django Cass
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
 *
 */

import React from "react";
import {Chip, ListItem, ListItemText, Typography, useTheme} from "@material-ui/core";
import Icon from "@mdi/react";
import {mdiCallMerge} from "@mdi/js";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {usePalette} from "react-palette";
import {Jump} from "../../../types";
import JumpAvatar from "./JumpAvatar";

const useStyles = makeStyles(() => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	}
}));

interface TopPickProps {
	jump: Jump;
}

const TopPick: React.FC<TopPickProps> = ({jump}): JSX.Element => {
	// hooks
	const classes = useStyles();
	const theme = useTheme();
	const {data, loading, error} = usePalette(jump.image || "");

	const secondary = <span>
		{jump.title}
		<br/>
		<Chip
			style={{marginTop: theme.spacing(2)}}
			icon={<Icon path={mdiCallMerge} color={theme.palette.primary.main} size={0.85}/>}
			component={Link}
			to={`/jmp?query=${jump.name}`}
			variant="outlined"
			label={
				<Typography
					className={classes.title}
					style={{fontSize: 12, fontWeight: "bold"}}
					color="textSecondary">
					Open
				</Typography>
			}
			clickable
		/>
	</span>;

	return (
		<ListItem>
			<JumpAvatar
				jump={jump}
				palette={data}
				loading={loading}
				error={error || null}
				iconSize={1.5}
				size={60}
			/>
			<ListItemText primary={jump.name} secondary={secondary}/>
		</ListItem>
	);
};
export default TopPick;
