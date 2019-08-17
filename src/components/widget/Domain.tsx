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

import {createStyles, makeStyles} from "@material-ui/core";
import * as React from "react";
import { ThemeProvider, useTheme } from "@material-ui/styles";

interface Theme {
	palette: {
		success: {
			main: string,
		},
		error: {
			main: string
		},
		text: {
			secondary: string
		}
	}
}

const useStyles = makeStyles(({palette}: Theme) => createStyles({
	https: {
		color: palette.success.main
	},
	http: {
		color: palette.error.main,
		textDecorationLine: 'line-through'
	},
	secondaryText: {
		color: palette.text.secondary
	}
}));

const Domain = ({text}: {text: string}) => {
	const theme = useTheme<Theme>();
	const classes = useStyles(theme);

	const highlighted = (url: string, classes: any) => {
		const split = url.split("://");
		const scheme = split[0];
		const domain = split[1];
		return (<span className={classes[scheme]}>{scheme}://<span className={classes.secondaryText}>{domain}</span></span>);
	};
	return (
		<ThemeProvider<Theme> theme={theme}>
			<span>
				{highlighted(text, classes)}
			</span>
		</ThemeProvider>
	)

};
export default Domain;