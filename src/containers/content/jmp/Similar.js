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

import {useDispatch, useSelector} from "react-redux";
import {Avatar, Chip, CircularProgress, Grid, makeStyles, Tooltip, Typography} from "@material-ui/core";
import React, {useEffect} from "react";
import {getSimilarFail} from "../../../actions/Jumps";
import Center from "react-center";
import Icon from "@mdi/react";
import {mdiAccountCircleOutline, mdiAccountGroupOutline, mdiEarth} from "@mdi/js";
import {Link} from "react-router-dom";
import Img from "react-image";
import getAvatarScheme from "../../../style/getAvatarScheme";
import useTheme from "@material-ui/core/styles/useTheme";
import getErrorMessage from "../../../selectors/getErrorMessage";
import {APP_NAME} from "../../../constants";
import {GET_SIMILAR, getSimilar} from "../../../store/actions/jumps/GetSimilar";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		color: theme.palette.text.primary
	},
	subtitle: {
		color: theme.palette.text.secondary
	},
	chip: {
		margin: theme.spacing(0.5),
		fontFamily: "Manrope",
		fontWeight: 500
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: '80vh'
	}
}));

export default () => {
	// hooks
	const dispatch = useDispatch();
	const {headers} = useSelector(state => state.auth);
	const loading = useSelector(state => state.loading[GET_SIMILAR]);
	const error = useSelector(state => state.errors[GET_SIMILAR]);
	const {similar} = useSelector(state => state.jumps);

	const classes = useStyles();
	const theme = useTheme();

	const getMatches = () => {
		let url = new URL(window.location.href);
		let query = url.searchParams.get("query");
		if (query != null && query !== '')
			getSimilar(dispatch, headers, query);
		else
			getSimilarFail(dispatch, "You must specify a query!");
	};
	useEffect(() => {
		window.document.title = `Similar - ${APP_NAME}`;
		getMatches();
	}, []);

	let status;
	switch (similar.length) {
		case 0:
			status = "We couldn't find any matches";
			break;
		case 1:
			status = "We found 1 match";
			break;
		default:
			status = `We found ${similar.length} matches`;
			break;
	}
	const chips = similar.map(i => {
		const scheme = getAvatarScheme(theme, i.personal);
		const textColour = theme.palette.getContrastText(scheme[0]);
		let avatar = {
			icon: i.personal === 0 ? mdiEarth : i.personal === 1 ? mdiAccountCircleOutline : mdiAccountGroupOutline,
			bg: scheme[0],
			fg: scheme[1]
		};
		return (
			<Tooltip disableFocusListener title={i.location} placement={"bottom"} interactive key={`${i.id}${i.name}`}>
				<Chip
					avatar={<Avatar style={{backgroundColor: avatar.bg, color: avatar.fg}}>
						{/* Website icon or MDI icon fallback */}
						<Img
							src={i.image}
							loader={<CircularProgress size={20}/>}
							unloader={<Icon path={avatar.icon} color={avatar.fg} size={1}/>}
						/>
					</Avatar>}
					label={<span style={{color: textColour}}>{i.name}</span>}
					clickable
					component={Link}
					to={`/jmp?query=${i.name}&id=${i.id}`}
					style={{backgroundColor: avatar.bg, color: avatar.fg}}
					className={classes.chip}/>
			</Tooltip>
		)
	});
	return <Grid container spacing={5} className={classes.container}>
		<Grid item sm={3}/>
		<Grid item sm={6}>
			<Center>
				<Typography className={classes.title}
				            variant={"h1"}>{similar.length > 0 ? "Woah" : "Oh no"}</Typography>
			</Center>
			{error == null && similar.length > 0 && <Center>
				<Typography className={classes.subtitle} variant={"subtitle1"}>Before you go&nbsp;
					<span role={"img"} aria-label={"Rocket"}>🚀</span>
				</Typography>
			</Center>}
			{loading === false && <Center>
				<Typography variant={"subtitle1"}
				            className={classes.title}>{error == null ? status : getErrorMessage(error)}</Typography>
			</Center>}
			{loading === true && <Center><CircularProgress/></Center>}
			<Center style={{padding: 16}}>{chips}</Center>
		</Grid>
		<Grid item sm={3}/>
	</Grid>;
};
