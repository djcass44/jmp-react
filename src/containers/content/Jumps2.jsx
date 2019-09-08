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

import {Avatar, LinearProgress, makeStyles, Paper, Typography} from "@material-ui/core";
import {defaultSorts, sortItems} from "../../misc/Sort";
import React, {useEffect, useState} from "react";
import {APP_NAME, APP_NOUN, pageSize} from "../../constants";
import {JUMP_LOAD, listJumpsDispatch} from "../../actions/Jumps";
import {useDispatch, useSelector} from "react-redux";
import Center from "react-center";
import SortedSubheader from "../../components/content/SortedSubheader";
import posed from "react-pose";
import List from "@material-ui/core/List";
import Pagination from "material-ui-flat-pagination/lib/Pagination";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import {fade} from "@material-ui/core/styles";
import JumpItem2 from "./jmp/JumpItem2";

const Item = posed.div({
	enter: {
		opacity: 1,
		transition: {
			ease: "easeInOut"
		}
	},
	exit: {
		opacity: 0,
		transition: {
			ease: "easeInOut"
		}
	}
});
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
		backgroundColor: fade(theme.palette.primary.light, 0.35),
		"&:hover": {
			backgroundColor: fade(theme.palette.primary.light, 0.65),
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

const Jumps = () => {
	// hooks
	const classes = useStyles();
	const dispatch = useDispatch();
	const {jumps} = useSelector(state => state.jumps);
	const {sort} = useSelector(state => state.generic);
	const {headers, isLoggedIn} = useSelector(state => state.auth);
	const loading = useSelector(state => state.loading[JUMP_LOAD]);


	const sorts = [...defaultSorts, {id: "usage", value: "Usage"}];
	const [offset, setOffset] = useState(0);
	const [search, setSearch] = useState("");
	useEffect(() => {
		window.document.title = `${APP_NAME}`;
		listJumpsDispatch(dispatch, headers);
	}, [headers]);

	const filterJump = jump => {
		return jump.name.includes(search) || jump.location.includes(search);
	};

	let listItems = [];
	// Tell the loop what our pagination limits are
	let max = (offset + pageSize);
	if (max > jumps.length) max = jumps.length;
	// Loop-d-loop
	let sortedJumps = sortItems(jumps, sort);
	sortedJumps.filter(filterJump).forEach((i, index) => {
		if (index < offset || index > max) return;
		listItems.push(<JumpItem2 jump={i} key={i.id} id={i.id}/>);
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
			<div className={classes.search}>
				<div className={classes.searchIcon}>
					<SearchIcon/>
				</div>
				<InputBase
					placeholder={"Search..."}
					autoFocus
					classes={{root: classes.inputRoot, input: classes.inputInput}}
					onChange={(e) => setSearch(e.target.value)}
					value={search}
				/>
			</div>
			<div>
				<SortedSubheader title={`${APP_NOUN}s`} size={listItems.length} sorts={sorts}/>
				{loading === true && <LinearProgress className={classes.progress} color={"primary"}/>}
				<div key={"root"} style={{borderRadius: 12, marginBottom: 8}}>
					<List component={"ul"}>
						{listItems.length > 0 ?
							listItems
							:
							<Typography className={`${classes.title} ${classes.nothing}`}>Nothing could be
								found</Typography>
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
export default Jumps;