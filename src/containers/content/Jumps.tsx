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

import {Card, Divider, makeStyles, Theme, Typography, Zoom} from "@material-ui/core";
import React, {ReactNode, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Center from "react-center";
import List from "@material-ui/core/List";
import {ImageMessage} from "jmp-coreui";
import {Alert, AlertTitle, Pagination} from "@material-ui/lab";
import {GET_JUMP, getJumps} from "../../store/actions/jumps/GetJumps";
import {setJumpExpand, setJumpOffset} from "../../store/actions/jumps";
import {TState} from "../../store/reducers";
import {APP_NAME, APP_NOUN, pageSize} from "../../constants";
import JumpItemSkeleton from "../../components/content/jmp/JumpItemSkeleton";
import useAuth from "../../hooks/useAuth";
import useLoading from "../../hooks/useLoading";
import {JumpsState} from "../../store/reducers/jumps";
import {GET_TOP_PICKS, getTopPicks} from "../../store/actions/jumps/GetTopPicks";
import getErrorMessage from "../../selectors/getErrorMessage";
import {ErrorState} from "../../config/types/Feedback";
import TopPick from "../../components/content/jmp/TopPick";
import usePathVar from "../../hooks/usePathVar";
import JumpItem from "./jmp/JumpItem";

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
	nothing: {
		textAlign: "center",
		padding: theme.spacing(2)
	},
	addButton: {
		borderRadius: theme.spacing(3),
		textTransform: "none",
		color: theme.palette.primary.main
	},
	skeleton: {
		marginLeft: theme.spacing(2)
	},
	subheader: {
		fontFamily: "Manrope",
		fontWeight: 500,
		fontSize: 18,
		padding: theme.spacing(1),
		paddingLeft: theme.spacing(3)
	},
	picksCard: {
		margin: theme.spacing(3),
		borderRadius: theme.spacing(1)
	}
}));

const emptyImages = [
	`${process.env.PUBLIC_URL}/draw/undraw_no_data_qbuo.svg`,
	`${process.env.PUBLIC_URL}/draw/undraw_lost_bqr2.svg`,
	`${process.env.PUBLIC_URL}/draw/undraw_empty_xct9.svg`
];

export default (): JSX.Element => {
	// hooks
	const classes = useStyles();
	const dispatch = useDispatch();

	// global state
	const {jumps, topPicks} = useSelector<TState, JumpsState>(state => state.jumps);
	const searchFilter = usePathVar();
	const {headers, isLoggedIn} = useAuth();
	const loading = useLoading([GET_JUMP]);
	const topPicksError = useSelector<TState, ErrorState | null>(state => state.errors[GET_TOP_PICKS]);

	// local state
	const [showTopPicks, setShowTopPicks] = useState(true);
	const data: Array<ReactNode> = useMemo(() => {
		const {content} = jumps;
		dispatch(setJumpOffset(jumps.number * pageSize));
		// Loop-d-loop
		return content.map(i => (<JumpItem jump={i} key={i.id}/>));
	}, [jumps]);

	const lData: Array<ReactNode> = useMemo(() => {
		if (!loading)
			return [];
		const l = [];
		const size = jumps.numberOfElements || pageSize;
		for (let i = 0; i < size; i++) {
			l.push(<JumpItemSkeleton key={i}/>);
		}
		return l;
	}, [loading]);

	const onSearch = (page = 1) => {
		setShowTopPicks(searchFilter.length === 0);
		if (searchFilter.length === 0 && isLoggedIn) {
			dispatch(getTopPicks(headers, 2));
		}
		dispatch(getJumps(headers, searchFilter, page - 1, pageSize));
	};

	useEffect(() => {
		window.document.title = APP_NAME;
		onSearch();
	}, [headers.Authorization, isLoggedIn, searchFilter]);

	const onPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		dispatch(setJumpOffset(value));
		onSearch(value);
		dispatch(setJumpExpand(null));
	};


	return (
		<div>
			{showTopPicks && isLoggedIn && <>
				{(topPicks.numberOfElements > 0 || topPicksError != null) && <Typography
					className={classes.subheader}
					color="textPrimary">
					Top picks
				</Typography>}
				{(topPicks.numberOfElements > 0 && topPicksError == null) && <Card
					className={classes.picksCard}
					variant="outlined">
					<List>
						{topPicks.content.map((j, idx) => <>
							<TopPick key={j.id} jump={j}/>
							{idx < (topPicks.numberOfElements - 1) && <Divider/>}
						</>)}
					</List>
				</Card>}
				{topPicksError != null && <Alert
					className={classes.picksCard}
					severity="error">
					<AlertTitle>
						Something went wrong loading top picks
					</AlertTitle>
					{getErrorMessage(topPicksError)}
				</Alert>}
			</>}
			{jumps.numberOfElements > 0 && <Typography
				className={classes.subheader}
				color="textPrimary">
				{APP_NOUN}s
			</Typography>}
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
			<Zoom in={jumps.totalElements > jumps.size}>
				<Center>
					<Pagination
						count={jumps.totalPages}
						page={(jumps.pageable?.pageNumber || 0) + 1}
						onChange={onPageChange}
						color="primary"
						size="small"
					/>
				</Center>
			</Zoom>
		</div>
	);
};