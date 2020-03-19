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

import React, {useState} from "react";
import {Card, ListItem, ListItemText, ListSubheader, Switch} from "@material-ui/core";
import {LS_DARK} from "../../../constants";
import {setThemeMode} from "../../../store/actions/Generic";
import {useDispatch, useSelector} from "react-redux";
import {TState} from "../../../store/reducers";
import {GenericState} from "../../../store/reducers/generic";

const General: React.FC = () => {
	// hooks
	const dispatch = useDispatch();

	//global state
	const {themeMode} = useSelector<TState, GenericState>(state => state.generic);

	// local state
	const [dark, setDark] = useState<boolean>(themeMode === "dark");

	const onSetDark = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {checked} = e.target;
		setDark(checked);

		const theme = checked ? "dark" : "light";
		localStorage.setItem(LS_DARK, theme);
		setThemeMode(dispatch, theme);
	};

	return (
		<div>
			<ListSubheader>
				Appearance
			</ListSubheader>
			<Card>
				<ListItem>
					<ListItemText primary="Theme" secondary={`${dark ? "Dark" : "Light"} theme`}/>
					<Switch checked={dark} onChange={e => onSetDark(e)}/>
				</ListItem>
			</Card>
		</div>
	)
};
export default General;
