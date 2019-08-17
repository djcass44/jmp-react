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

import React, {useEffect} from "react";
import {Typography, makeStyles} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
// @ts-ignore
import Center from "react-center";
import {IconButton} from "@material-ui/core";
import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {mdiArrowLeft, mdiHomeOutline} from "@mdi/js";
import {APP_NAME} from "../../constants";

const useStyles = makeStyles(theme => ({
	title: {
		fontSize: 148,
		fontWeight: 200,
		color: theme.palette.text.primary
	},
	subtitle: {
		textAlign: 'center',
		fontFamily: "Manrope",
		fontWeight: 500,
		color: theme.palette.text.secondary
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: '80vh'
	}
}));

const NotFound = () => {
	useEffect(() => {
		window.document.title = `404 - ${APP_NAME}`;
	}, []);

	const classes = useStyles();
	const theme = useTheme();
	return (
		<div className={classes.container}>
			<div style={{justifyContent: 'center', alignItems: 'center'}}>
				<Center><Typography className={classes.title} variant={"h1"}>404</Typography></Center>
				<Center><Typography className={classes.subtitle} variant={"subtitle1"}>The page you're looking for doesn't exist or the server refused to disclose it.</Typography></Center>
				<Center>
					<IconButton color={"secondary"} href={"javascript:window.history.back()"} centerRipple={false} aria-label={"Go back"}>
						<Icon path={mdiArrowLeft} size={1} color={theme.palette.secondary.main}/>
					</IconButton>
					<IconButton component={Link} to={"/"} color={"primary"} centerRipple={false} aria-label={"Return to home"}>
						<Icon path={mdiHomeOutline} size={1} color={theme.palette.primary.main}/>
					</IconButton>
				</Center>
			</div>
		</div>
	);
};
export default NotFound;