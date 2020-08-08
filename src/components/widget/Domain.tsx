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

import {makeStyles, Theme} from "@material-ui/core";
import React, {ReactNode} from "react";

const useStyles = makeStyles((theme: Theme) => ({
	https: {
		color: theme.palette.success.main
	},
	http: {
		color: theme.palette.error.main,
		textDecorationLine: "line-through"
	},
	secondaryText: {
		color: theme.palette.text.secondary
	}
}));

interface DomainProps {
	text: string;
}

const Domain: React.FC<DomainProps> = ({text}): JSX.Element => {
	const classes = useStyles();

	const highlighted = (url: string): ReactNode => {
		const split = url.split("://");
		const scheme = split[0];
		const domain = split[1];
		let c = classes.http;
		if (scheme === "https")
			c = classes.https;
		return (<span className={c}>
			{scheme}://
			<span
				className={classes.secondaryText}>
				{domain}
			</span>
		</span>);
	};
	return (<span>{highlighted(text)}</span>);
};

export default Domain;
