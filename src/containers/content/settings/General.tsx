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
 *
 */

import React, {useEffect, useState} from "react";
import {Badge, Button, FormControlLabel, ListSubheader, makeStyles, Switch, Typography} from "@material-ui/core";
import InfoItem from "../../../components/content/settings/InfoItem";
import {LS_DARK} from "../../../constants";
import Icon from "@mdi/react";
import {mdiSettingsOutline} from "@mdi/js";
import {useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	content: {
		fontSize: 14,
		flex: 1
	},
	warningText: {
		color: theme.palette.error.main
	},
	icon: {
		paddingRight: 8
	}
}));

const General: React.FC = () => {
	const [dark, setDark] = useState<boolean>(false);

	useEffect(() => {
		setDark(localStorage.getItem(LS_DARK) === "true");
	}, []);

	const onSetDark = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {checked} = e.target;
		setDark(checked);
	};
	const onSave = () => {
		localStorage.setItem(LS_DARK, dark.toString());
		window.location.reload(); // Chad refresh
	};

	const classes = useStyles();
	const theme = useTheme();
	const visual = (
		<div>
			<Typography className={classes.warningText} variant="body1">This feature is in active development and may contain graphical issues.</Typography>
			<FormControlLabel control={
				<Switch checked={dark} onChange={(e) => onSetDark(e)}/>
			} label="Dark theme"/>
			<Button variant="contained" color="primary" onClick={() => onSave()}>Save</Button>
		</div>
	);
	return (
		<div>
			<ListSubheader className={classes.title} inset component="div">General</ListSubheader>
			<InfoItem title={<Badge color="primary" badgeContent="BETA">Visuals & theme</Badge>} content={visual} icon={
				<Icon className={classes.icon} path={mdiSettingsOutline} size={1} color={theme.palette.primary.main}/>
			} error={null} open={false}/>
		</div>
	)
};
export default General;
