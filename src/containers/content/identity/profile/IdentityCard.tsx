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

import React, {ReactNode} from "react";
import {Card, CardActions, CardContent, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		display: 'flex',
		borderRadius: 12
	},
	details: {
		display: 'flex',
		flexDirection: 'column',
	},
	content: {
		flex: '1 0 auto',
	},
	actions: {
		float: "right",
		flexGrow: 1,
		marginRight: theme.spacing(1.5)
	}
}));

interface UserCardProps {
	avatar: ReactNode;
	content: ReactNode;
	actions: ReactNode;
}

const IdentityCard: React.FC<UserCardProps> = ({avatar, content, actions}) => {
	// hooks
	const classes = useStyles();

	return (
		<div>
			<Card
				className={classes.root}
				elevation={0}>
				{avatar}
				<div className={classes.details}>
					<CardContent className={classes.content}>
						{content}
					</CardContent>
				</div>
				<CardActions className={classes.actions}>
					<div style={{width: "100%"}}/>
					{actions}
				</CardActions>
			</Card>
		</div>
	);
};
export default IdentityCard;