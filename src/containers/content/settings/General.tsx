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
import {ListSubheader, makeStyles} from "@material-ui/core";
import InfoItem from "../../../components/content/settings/InfoItem";
import {LS_DARK} from "../../../constants";
import Icon from "@mdi/react";
import {mdiSettingsOutline, mdiShieldAccountOutline} from "@mdi/js";
import {useTheme} from "@material-ui/core/styles";
import Theme from "./general/Theme";
import Security from "./general/Security";
import {useSelector} from "react-redux";
import {TState} from "../../../store/reducers";
import {AuthState} from "../../../store/reducers/auth";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	icon: {
		paddingRight: 8
	}
}));

const General: React.FC = () => {
	const {isLoggedIn} = useSelector<TState, AuthState>(state => state.auth);
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
	return (
		<div>
			<ListSubheader className={classes.title} inset component="div">General</ListSubheader>
			<InfoItem title={<span>Visuals &amp; theme</span>}
			          content={<Theme dark={dark} onSetDark={onSetDark} onSave={onSave}/>} icon={
				<Icon className={classes.icon} path={mdiSettingsOutline} size={1} color={theme.palette.primary.main}/>
			} error={null} open={false}/>
			{isLoggedIn && <InfoItem title={<span>Security</span>} content={<Security/>} icon={
				<Icon className={classes.icon} path={mdiShieldAccountOutline} size={1}
				      color={theme.palette.success.main}/>
			} error={null} open={false}/>}
		</div>
	)
};
export default General;
