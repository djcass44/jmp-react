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

import {Avatar, IconButton, LinearProgress, makeStyles, Paper, Tooltip, Typography} from "@material-ui/core";
import {defaultSorts, sortItems} from "../../misc/Sort";
import React, {useEffect, useState} from "react";
import {APP_NAME, pageSize} from "../../constants";
import {JUMP_LOAD, listJumpsDispatch} from "../../actions/Jumps";
import {useDispatch, useSelector} from "react-redux";
import Center from "react-center";
import List from "@material-ui/core/List";
import Pagination from "material-ui-flat-pagination/lib/Pagination";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import {fade} from "@material-ui/core/styles";
import JumpItem from "./jmp/JumpItem";
import SortButton from "../../components/widget/SortButton";
import {dispatchSort} from "../../actions/Generic";
import AddIcon from "@material-ui/icons/Add";
import {MODAL_JUMP_NEW, setDialog} from "../../actions/Modal";
import {createIndex} from "../../misc/Search";

const bgTransition = time => `background-color ${time}ms linear`;
const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	progress: {
		backgroundColor: "transparent",
		flexGrow: 1
	},
	name: {
		fontFamily: "Manrope",
		fontWeight: 500,
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
		backgroundColor: fade(theme.palette.search, 0.35),
		"&:hover": {
			backgroundColor: fade(theme.palette.search, 0.65),
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
	}
}));

const searchFields = [
	{
		name: "name",
		weight: 0.5
	},
	{
		name: "location",
		weight: 0.3
	},
	{
		name: "title",
		weight: 0.2
	}
];

export default () => {
	// hooks
	const classes = useStyles();
	const dispatch = useDispatch();
	const {jumps} = useSelector(state => state.jumps);
	const {sort} = useSelector(state => state.generic);
	const {headers} = useSelector(state => state.auth);
	const loading = useSelector(state => state.loading[JUMP_LOAD]);


	const sorts = [...defaultSorts, {id: "usage", value: "Usage"}];
	const [offset, setOffset] = useState(0);
	const [search, setSearch] = useState("");
	const [idx, setIdx] = useState(null);

	useEffect(() => {
		window.document.title = `${APP_NAME}`;
		listJumpsDispatch(dispatch, headers);
	}, [headers]);

	// hook to rebuild the index when jumps change
	useEffect(() => {
		setIdx(createIndex(searchFields, jumps));
	}, [jumps]);

	const filterJump = items => {
		if (search == null || search === "")
			return items;
		console.dir(idx.search(search));
		return idx.search(search);
	};

	let listItems = [];
	// Tell the loop what our pagination limits are
	let max = (offset + pageSize);
	if (max > jumps.length) max = jumps.length;
	// Loop-d-loop
	sortItems(jumps, sort);
	const sortedJumps = filterJump(jumps);
	sortedJumps.forEach((i, index) => {
		if (index < offset || index > max) return;
		listItems.push(<JumpItem jump={i} key={i.id} id={i.id}/>);
	});


	return (
		<React.Fragment>
			<Center>
				<Avatar className={classes.avatar} component={Paper} src={`${process.env.PUBLIC_URL}/jmp.png`}
				        alt={APP_NAME}/>
			</Center>
			<Center>
				<Typography variant="h4" className={classes.name}>Where do you want to go?</Typography>
			</Center>
			<Center>
				<SortButton selectedSort={sort} sorts={sorts} onSubmit={e => dispatchSort(dispatch, e)}/>
				<Tooltip title="Add">
					<IconButton centerRipple={false} aria-label="Add" onClick={
						() => setDialog(dispatch,
							MODAL_JUMP_NEW,
							true
						)
					}>
						<AddIcon fontSize="small"/>
					</IconButton>
				</Tooltip>
			</Center>
			<div className={classes.search}>
				<div className={classes.searchIcon}>
					<SearchIcon/>
				</div>
				<InputBase
					placeholder="Search..."
					autoFocus
					classes={{root: classes.inputRoot, input: classes.inputInput}}
					onChange={(e) => setSearch(e.target.value)}
					value={search}
				/>
			</div>
			<div>
				{loading === true && <LinearProgress className={classes.progress} color="primary"/>}
				<div key="root" style={{borderRadius: 12, marginBottom: 8}}>
					<List component="ul">
						{listItems.length > 0 ?
							listItems
							:
							<Typography className={`${classes.title} ${classes.nothing}`} color="primary">
								Nothing could be found
							</Typography>
						}
					</List>
				</div>
				{listItems.length > pageSize || offset > 0 ?
					<Center>
						<Pagination limit={pageSize} offset={offset} total={sortedJumps.length}
						            nextPageLabel={"▶"} previousPageLabel={"◀"} onClick={(e, off) => setOffset(off)}/>
					</Center>
					:
					<div/>
				}
			</div>
		</React.Fragment>
	);
};