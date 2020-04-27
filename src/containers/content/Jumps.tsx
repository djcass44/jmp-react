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

import {Avatar, Button, makeStyles, Paper, Theme, Typography, useTheme, Zoom} from "@material-ui/core";
import React, {ReactNode, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Center from "react-center";
import List from "@material-ui/core/List";
import Pagination from "material-ui-flat-pagination/lib/Pagination";
import {fade} from "@material-ui/core/styles";
import Icon from "@mdi/react";
import {mdiAccountAlertOutline, mdiMagnify} from "@mdi/js";
import {DwellInputBase, ImageMessage, ThemedTooltip} from "jmp-coreui";
import {MODAL_JUMP_NEW, setDialog} from "../../store/actions/Modal";
import {GET_JUMP, getJumps} from "../../store/actions/jumps/GetJumps";
import {setJumpExpand, setJumpOffset, setJumpSearch} from "../../store/actions/jumps";
import {TState} from "../../store/reducers";
import {Jump, Page} from "../../types";
import {JumpsState} from "../../store/reducers/jumps";
import {APP_NAME, APP_NOUN, pageSize} from "../../constants";
import JumpItemSkeleton from "../../components/content/jmp/JumpItemSkeleton";
import useAuth from "../../hooks/useAuth";
import JumpItem from "./jmp/JumpItem";

const bgTransition = (time: string | number) => `background-color ${time}ms linear`;
const useStyles = makeStyles((theme: Theme) => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	name: {
		fontFamily: "Manrope",
		fontWeight: 400,
		textAlign: "center",
		color: theme.palette.primary.main
	},
	avatar: {
		width: 56,
		height: 56,
		borderRadius: 100,
		margin: 24,
		padding: 6,
		backgroundColor: theme.palette.background.default
	},
	search: {
		position: "relative",
		borderRadius: 24,
		color: theme.palette.text.primary,
		backgroundColor: fade(theme.palette.action.hover, 0.05),
		"&:hover": {
			backgroundColor: fade(theme.palette.action.hover, 0.15),
			transition: bgTransition(250),
			webkitTransition: bgTransition(250),
			msTransition: bgTransition(250)
		},
		transition: bgTransition(150),
		webkitTransition: bgTransition(150),
		msTransition: bgTransition(150),

		margin: theme.spacing(2),
		marginRight: theme.spacing(3),
		marginLeft: theme.spacing(3),
		width: "auto"
	},
	searchIcon: {
		width: theme.spacing(9),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	inputRoot: {
		color: "inherit",
		width: "100%"
	},
	inputInput: {
		paddingTop: theme.spacing(1),
		paddingRight: theme.spacing(1),
		paddingBottom: theme.spacing(1),
		paddingLeft: theme.spacing(10),
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: 200
		}
	},
	nothing: {
		textAlign: "center",
		padding: theme.spacing(2)
	},
	addButton: {
		borderRadius: theme.spacing(3),
		margin: theme.spacing(2),
		textTransform: "none",
		color: theme.palette.success.main
	},
	skeleton: {
		marginLeft: theme.spacing(2)
	}
}));

const emptyImages = [
	"/draw/undraw_no_data_qbuo.svg",
	"/draw/undraw_lost_bqr2.svg",
	"/draw/undraw_empty_xct9.svg"
];

export default () => {
	// hooks
	const classes = useStyles();
	const dispatch = useDispatch();
	const {palette} = useTheme();

	// global state
	const pagedJumps = useSelector<TState, Page<Jump>>(state => state.jumps.jumps);
	const {offset, search} = useSelector<TState, JumpsState>(state => state.jumps);
	const {headers, isLoggedIn} = useAuth();
	const loading = useSelector<TState, boolean>(state => state.loading[GET_JUMP]);

	// local state
	const [data, setData] = useState<Array<ReactNode>>([]);
	const [lData, setLData] = useState<Array<ReactNode>>([]);

	const onSearch = (o = offset) => {
		getJumps(dispatch, headers, search, Number(o / pageSize) || 0, pageSize);
	};

	useEffect(() => {
		window.document.title = APP_NAME;
		onSearch();
	}, [headers.Authorization]);

	useEffect(() => {
		const {content} = pagedJumps;
		setJumpOffset(dispatch, pagedJumps.number * pageSize);
		// Loop-d-loop
		setData(content.map(i => (<JumpItem jump={i} key={i.id}/>)));
	}, [pagedJumps, offset]);

	useEffect(() => {
		if (!loading)
			setLData([]);
		const l = [];
		const size = pagedJumps.numberOfElements || pageSize;
		for (let i = 0; i < size; i++) {
			l.push(<JumpItemSkeleton key={i}/>);
		}
		setLData(l);
	}, [loading]);

	const onPageChange = (off: number) => {
		setJumpOffset(dispatch, off);
		onSearch(off);
		setJumpExpand(dispatch, null);
	};


	return (
		<React.Fragment>
			<Center>
				<Avatar
					className={classes.avatar}
					component={Paper}
					src={`${process.env.PUBLIC_URL}/jmp2.png`}
					alt={APP_NAME}
				/>
			</Center>
			<Center>
				<Typography
					className={classes.name}
					variant="h4">
					Where to?
				</Typography>
			</Center>
			<Center>
				<Button
					className={classes.addButton}
					disabled={!isLoggedIn}
					variant="outlined"
					aria-label="Add"
					onClick={
						() => setDialog(dispatch,
							MODAL_JUMP_NEW,
							true,
							null
						)
					}>
					Add
				</Button>
				{!isLoggedIn && <ThemedTooltip translate title={`You must be logged in to create ${APP_NOUN}s`}>
					<Icon path={mdiAccountAlertOutline} color={palette.error.dark} size={1}/>
				</ThemedTooltip>}
			</Center>
			<div className={classes.search}>
				<div className={classes.searchIcon}>
					<Icon path={mdiMagnify} color={palette.text.secondary} size={1}/>
				</div>
				<DwellInputBase
					inputProps={{
						placeholder: "Search...",
						autoFocus: true,
						classes: {root: classes.inputRoot, input: classes.inputInput},
						onChange: (e: any) => setJumpSearch(dispatch, e.target.value),
						value: search,
					}}
					onDwell={() => onSearch()}
				/>
			</div>
			<div>
				<div key="root" style={{borderRadius: 12, marginBottom: 8}}>
					<List>
						{!loading && data}
						{loading && <>
							{lData}
						</>}
						{data.length === 0 && !loading &&
						<ImageMessage src={emptyImages} message="Nothing could be found"/>}
					</List>
				</div>
				<Zoom in={pagedJumps.totalElements > pagedJumps.size}>
					<Center>
						<Pagination limit={pagedJumps.size} offset={offset} total={pagedJumps.totalElements}
						            nextPageLabel="▶" previousPageLabel="◀"
						            onClick={(e, off) => onPageChange(off)}/>
					</Center>
				</Zoom>
			</div>
		</React.Fragment>
	);
};