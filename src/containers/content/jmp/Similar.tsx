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
import {Avatar, Chip, CircularProgress, Grid, makeStyles, Theme, Tooltip, Typography} from "@material-ui/core";
import React, {ReactNode, useEffect, useState} from "react";
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
import {TState} from "../../../store/reducers";
import {AuthState} from "../../../store/reducers/auth";
import {JumpsState} from "../../../store/reducers/jumps";
import {Jump} from "../../../types";
import {Skeleton} from "@material-ui/lab";
import {getSimilarFail} from "../../../store/actions/jumps";

const useStyles = makeStyles((theme: Theme) => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
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
	const classes = useStyles();
	const theme = useTheme();
	const dispatch = useDispatch();

	// global state
	const {headers} = useSelector<TState, AuthState>(state => state.auth);
	const loading = useSelector<TState, boolean>(state => state.loading.get(GET_SIMILAR) ?? false);
	const error = useSelector<TState, any | null>(state => state.errors.get(GET_SIMILAR));
	const {similar} = useSelector<TState, JumpsState>(state => state.jumps);

	// local state
	const [items, setItems] = useState<Array<ReactNode>>([]);

	const getMatches = () => {
		const url = new URL(window.location.href);
		const query = url.searchParams.get("query");
		if (query != null && query !== '')
			getSimilar(dispatch, headers, query);
		else
			getSimilarFail(dispatch, "You must specify a query!");
	};
	useEffect(() => {
		window.document.title = `Similar - ${APP_NAME}`;
		getMatches();
	}, []);

	useEffect(() => {
		setItems(similar.map((jump: Jump) => {
			const personal = jump.public ? 0 : jump.owner != null ? 1 : 2;
			const scheme = getAvatarScheme(theme, personal);
			const textColour = theme.palette.getContrastText(scheme[0]);
			const avatar = {
				icon: personal === 0 ? mdiEarth : personal === 1 ? mdiAccountCircleOutline : mdiAccountGroupOutline,
				bg: scheme[0],
				fg: scheme[1]
			};
			return (
				<Tooltip disableFocusListener title={jump.location} placement="bottom" interactive
				         key={`${jump.id}${jump.name}`}>
					<Chip
						avatar={<Avatar style={{backgroundColor: avatar.bg, color: avatar.fg}}>
							{/* Website icon or MDI icon fallback */}
							<Img
								src={jump.image}
								loader={<Skeleton animation="wave" variant="circle" width={32} height={32}/>}
								unloader={<Icon path={avatar.icon} color={avatar.fg} size={1}/>}
							/>
						</Avatar>}
						label={<span style={{color: textColour}}>{jump.name}</span>}
						clickable
						component={Link}
						to={`/jmp?query=${jump.name}&id=${jump.id}`}
						style={{backgroundColor: avatar.bg, color: avatar.fg}}
						className={classes.chip}/>
				</Tooltip>
			)
		}));
	}, [similar]);

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
	return (<Grid container spacing={5} className={classes.container}>
		<Grid item sm={3}/>
		<Grid item sm={6}>
			{!loading && <Center>
				<Typography
					className={classes.title}
					color="textPrimary"
					variant={"h1"}>
					{similar.length > 0 ? "Woah" : "Oh no"}
				</Typography>
			</Center>}
			{error == null && similar.length > 0 && <Center>
				<Typography
					color="textSecondary"
					variant="subtitle1">Before you go&nbsp;
					<span role={"img"} aria-label={"Rocket"}/>
				</Typography>
			</Center>}
			{!loading && <Center>
				<Typography
					variant="subtitle1"
					className={classes.title}>
					{error == null ? status : getErrorMessage(error)}
				</Typography>
			</Center>}
			{loading && <Center>
				<CircularProgress/>
			</Center>}
			<Center style={{padding: 16}}>
				{items}
			</Center>
		</Grid>
		<Grid item sm={3}/>
	</Grid>);
};
