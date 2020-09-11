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

import React, {ReactElement, ReactNode} from "react";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {Tooltip, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
	tooltip: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9"
	},
	arrow: {
		color: theme.palette.primary.main
	},
	text: {
		fontFamily: "Manrope",
		fontWeight: 600,
		fontSize: theme.typography.pxToRem(15)
	}
}));

interface HintTooltipProps {
	className?: string;
	title: ReactNode;
	children: ReactElement;
	open?: boolean;
}

const HintTooltip: React.FC<HintTooltipProps> = ({className, title, children, open}): JSX.Element => {
	const classes = useStyles();
	return (
		<Tooltip
			className={className}
			classes={{
				tooltip: classes.tooltip,
				arrow: classes.arrow
			}}
			open={open}
			arrow
			title={
				<React.Fragment>
					<Typography
						className={classes.text}
						color="inherit">
						{title}
					</Typography>
				</React.Fragment>
			}>
			{children}
		</Tooltip>
	);
};
export default HintTooltip;