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
import {CircularProgress, makeStyles, Typography} from "@material-ui/core";
import React, {ReactNode, useEffect, useState} from "react";
import Center from "react-center";
import getErrorMessage from "../../../selectors/getErrorMessage";
import {APP_NAME} from "../../../constants";
import {GET_SIMILAR, getSimilar} from "../../../store/actions/jumps/GetSimilar";
import {TState} from "../../../store/reducers";
import {JumpsState} from "../../../store/reducers/jumps";
import {Jump} from "../../../types";
import {getSimilarFail} from "../../../store/actions/jumps";
import JumpChip from "../../../components/content/jmp/JumpChip";
import useAuth from "../../../hooks/useAuth";

const useStyles = makeStyles(() => ({
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
	}
}));

export default () => {
	// hooks
	const classes = useStyles();
	const dispatch = useDispatch();

	// global state
	const {headers} = useAuth();
	const loading = useSelector<TState, boolean>(state => state.loading[GET_SIMILAR] ?? false);
	const error = useSelector<TState, any | null>(state => state.errors[GET_SIMILAR]);
	const {similar} = useSelector<TState, JumpsState>(state => state.jumps);

	// local state
	const [items, setItems] = useState<Array<ReactNode>>([]);

	const getMatches = () => {
		const url = new URL(window.location.href);
		const query = url.searchParams.get("query");
		if (query != null && query !== "")
			getSimilar(dispatch, headers, query);
		else
			getSimilarFail(dispatch, "You must specify a query!");
	};
	useEffect(() => {
		window.document.title = `Similar - ${APP_NAME}`;
		getMatches();
	}, []);

	useEffect(() => {
		setItems(similar.map((jump: Jump) => <JumpChip key={jump.id} jump={jump}/>));
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
	return (<Center className={classes.overlay}>
		<div className={classes.content}>
			{!loading && <Center>
				<img
					height={256}
					src={`${process.env.PUBLIC_URL}/draw/undraw_${similar.length === 0 ? "empty_xct9.svg" : similar.length > 0 ? "road_sign_mfpo.svg" : "warning_cyit.svg"}`}
					alt=""
				/>
			</Center>}
			{!loading && <Center>
				<Typography
					className={classes.title}
					color="textPrimary"
					variant="subtitle1">
					{error == null ? status : getErrorMessage(error)}
				</Typography>
			</Center>}
			{loading && <Center>
				<CircularProgress/>
			</Center>}
			<Center style={{padding: 16}}>
				{items}
			</Center>
		</div>
	</Center>);
};
