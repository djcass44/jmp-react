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

import {
	Avatar,
	Fade,
	IconButton,
	LinearProgress,
	makeStyles,
	Paper,
	Tooltip,
	Typography,
	Zoom
} from "@material-ui/core";
import {defaultSorts, sortItems} from "../../misc/Sort";
import React, {useEffect, useState} from "react";
import {APP_NAME} from "../../constants";
import {useDispatch, useSelector} from "react-redux";
import Center from "react-center";
import List from "@material-ui/core/List";
import Pagination from "material-ui-flat-pagination/lib/Pagination";
import SearchIcon from "@material-ui/icons/Search";
import {fade} from "@material-ui/core/styles";
import JumpItem from "./jmp/JumpItem";
import SortButton from "../../components/widget/SortButton";
import {dispatchSort} from "../../actions/Generic";
import AddIcon from "@material-ui/icons/Add";
import {MODAL_JUMP_NEW, setDialog} from "../../actions/Modal";
import {GET_JUMP, getJumps} from "../../store/actions/jumps/GetJumps";
import {setJumpExpand} from "../../store/actions/jumps";
import DwellInputBase from "../../components/widget/DwellInputBase";

const bgTransition = time => `background-color ${time}ms linear`;
const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	progress: {
		position: "fixed",
		width: "100%",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "transparent",
		pointerEvents: "none"
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

export default () => {
	// hooks
	const classes = useStyles();
	const dispatch = useDispatch();
	const pagedJumps = useSelector(state => state.jumps.jumps);
	const {sort} = useSelector(state => state.generic);
	const {headers} = useSelector(state => state.auth);
	const loading = useSelector(state => state.loading[GET_JUMP] ?? false);

	const sorts = [...defaultSorts, {id: "usage", value: "Usage"}];
	const [offset, setOffset] = useState(0);
	const [search, setSearch] = useState("");

	const [data, setData] = useState([]);

	const onSearch = () => {
		getJumps(dispatch, headers, search, Number(offset / 8) || 0, 8);
	};

	useEffect(() => {
		window.document.title = `${APP_NAME}`;
		onSearch();
	}, [headers]);

	useEffect(() => {
		const {content} = pagedJumps;
		setOffset(pagedJumps.number * 8);
		// Loop-d-loop
		sortItems(content, sort);
		setData(content.map(i => (<JumpItem jump={i} key={i.id} id={i.id}/>)));
	}, [pagedJumps, sort]);

	const onPageChange = (off) => {
		setOffset(off);
		onSearch();
		setJumpExpand(dispatch, null);
	};


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
				<DwellInputBase
					inputProps={{
						placeholder: "Search...",
						autoFocus: true,
						classes: {root: classes.inputRoot, input: classes.inputInput},
						onChange: (e) => setSearch(e.target.value),
						value: search,
					}}
					onDwell={() => onSearch()}
				/>
			</div>
			<div>
				<Fade in={loading === true}>
					<LinearProgress className={classes.progress} color="primary"/>
				</Fade>
				<div key="root" style={{borderRadius: 12, marginBottom: 8}}>
					<List component="ul">
						{data}
						<Zoom in={data.length === 0}>
							<Typography className={`${classes.title} ${classes.nothing}`} color="primary">
								Nothing could be found
							</Typography>
						</Zoom>
					</List>
				</div>
				<Zoom in={pagedJumps.totalElements > pagedJumps.size}>
					<Center>
						<Pagination limit={pagedJumps.size} offset={offset} total={pagedJumps.totalElements}
						            nextPageLabel={"▶"} previousPageLabel={"◀"}
						            onClick={(e, off) => onPageChange(off)}/>
					</Center>
				</Zoom>
			</div>
		</React.Fragment>
	);
};