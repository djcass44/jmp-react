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
import {Chip, CircularProgress, makeStyles, Theme, Typography, useTheme} from "@material-ui/core";
import React, {ReactNode, useEffect, useMemo} from "react";
import Center from "react-center";
import Icon from "@mdi/react";
import {mdiArrowRight, mdiMagnify} from "@mdi/js";
import {Link} from "react-router-dom";
import getErrorMessage from "../../../selectors/getErrorMessage";
import {APP_NAME} from "../../../constants";
import {GET_SIMILAR, getSimilar} from "../../../store/actions/jumps/GetSimilar";
import {TState} from "../../../store/reducers";
import {JumpsState} from "../../../store/reducers/jumps";
import {getSimilarFail} from "../../../store/actions/jumps";
import JumpChip from "../../../components/content/jmp/JumpChip";
import useAuth from "../../../hooks/useAuth";
import useLoading from "../../../hooks/useLoading";
import {ErrorState} from "../../../config/types/Feedback";

const useStyles = makeStyles((theme: Theme) => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	overlay: {
		position: "fixed",
		width: "100%",
		height: "100%",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "transparent",
		pointerEvents: "none"
	},
	content: {
		pointerEvents: "initial"
	},
	searchIcon: {
		backgroundColor: theme.palette.text.hint,
		borderRadius: "50%",
		padding: theme.spacing(3),
		margin: theme.spacing(3)
	},
	searchText: {
		color: theme.palette.text.secondary,
		marginBottom: theme.spacing(3)
	}
}));

const Similar: React.FC = (): JSX.Element => {
	// hooks
	const classes = useStyles();
	const dispatch = useDispatch();
	const theme = useTheme();

	// global state
	const {headers} = useAuth();
	const loading = useLoading([GET_SIMILAR]);
	const error = useSelector<TState, ErrorState | null>(state => state.errors[GET_SIMILAR]);
	const {similar} = useSelector<TState, JumpsState>(state => state.jumps);

	// local state
	const items: Array<ReactNode> = useMemo(() => {
		return similar.map(j => <JumpChip key={j.id} jump={j}/>);
	}, [similar]);

	const status: string = useMemo(() => {
		switch (similar.length) {
			case 0:
				return "We couldn't find any matches";
			case 1:
				return "We found 1 match";
			default:
				return `We found ${similar.length} matches`;
		}
	}, [similar]);

	const getMatches = (): void => {
		const url = new URL(window.location.href);
		const query = url.searchParams.get("query");
		if (query != null && query !== "")
			dispatch(getSimilar(headers, query));
		else
			dispatch(getSimilarFail("You must specify a query!"));
	};

	useEffect(() => {
		window.document.title = `Similar - ${APP_NAME}`;
		getMatches();
	}, []);

	return (<Center className={classes.overlay}>
		<div className={classes.content}>
			{!loading && <>
				<Center>
					<Icon
						className={classes.searchIcon}
						path={mdiMagnify}
						size={1.5}
						color={theme.palette.background.default}
					/>
				</Center>
				<Center>
					<Typography
						className={`${classes.title} ${classes.searchText}`}
						variant="h6">
						{error == null ? status : getErrorMessage(error)}
					</Typography>
				</Center>
				<Center>
					<Chip
						icon={<Icon path={mdiArrowRight} color={theme.palette.primary.main} size={0.85}/>}
						component={Link}
						to="/"
						variant="outlined"
						label={
							<Typography
								className={classes.title}
								style={{fontSize: 12, fontWeight: "bold"}}
								color="textSecondary">
								Explore jumps
							</Typography>
						}
						clickable
					/>
				</Center>
			</>}
			{loading && <Center>
				<CircularProgress/>
			</Center>}
			<Center style={{padding: 16}}>
				{items}
			</Center>
		</div>
	</Center>);
};

export default Similar;
