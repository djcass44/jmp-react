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

import React, {useEffect, useState} from "react";
import List from "@material-ui/core/List";
import {
	deleteJump,
	JUMP_LOAD,
	listJumps,
} from "../../actions/Jumps";
import {connect} from "react-redux";
import Paper from "@material-ui/core/Paper";
import Pagination from "material-ui-flat-pagination";
import Center from "react-center";
import {LinearProgress, makeStyles, withTheme} from "@material-ui/core";
import {APP_NAME, APP_NOUN, pageSize} from "../../constants";
import posed, {PoseGroup} from "react-pose";
import JumpDialog from "../modal/JumpDialog";
import DeleteDialog from "../modal/DeleteDialog";
import JumpEditDialog from "../modal/JumpEditDialog";
import {defaultSorts, sortItems} from "../../misc/Sort";
import {setSort} from "../../actions/Generic";
import {setDelete, setJumpEdit, setJumpNew} from "../../actions/Modal";
import JumpItem from "./jmp/JumpItem";
import EmptyCard from "../../components/widget/EmptyCard";
import SortedSubheader from "../../components/content/SortedSubheader";

const Item = posed.div({
	enter: {
		opacity: 1,
		transition: {
			ease: 'easeInOut'
		}
	},
	exit: {
		opacity: 0,
		transition: {
			ease: 'easeInOut'
		}
	}
});

const useStyles = makeStyles(() => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	progress: {
		backgroundColor: 'transparent',
		flexGrow: 1
	}
}));

const Jumps = ({setJumpNew, setJumpEdit, setDelete, deleteJump, searchFilter, headers, ...props}) => {
	const sorts = [...defaultSorts, {id: 'usage', value: "Usage"}];
	const [offset, setOffset] = useState(0);
	useEffect(() => {
		window.document.title = `${APP_NAME}`;
		props.listJumps(headers);
	}, [headers]);

	const filterJump = jump => {
		return jump.name.includes(searchFilter) || jump.location.includes(searchFilter);
	};

	const classes = useStyles();
	let listItems = [];
	// Tell the loop what our pagination limits are
	let max = (offset + pageSize);
	if(max > props.jumps.length) max = props.jumps.length;
	// Loop-d-loop
	let sortedJumps = sortItems(props.jumps, props.sort);
	sortedJumps.filter(filterJump).forEach((i, index) => {
		if(index < offset || index > max) return;
		listItems.push(<JumpItem jump={i} key={i.id} id={i.id}/>);
	});

	return (
		<div>
			<SortedSubheader title={`${APP_NOUN}s`} size={listItems.length} sorts={sorts} onAdd={() => setJumpNew(true)}/>
			{props.loading === true ? <LinearProgress className={classes.progress} color={"primary"}/> : "" }
			<PoseGroup animateOnMount={true}>
				<Paper component={Item} key={"root"} style={{borderRadius: 12, marginBottom: 8}}>
					<List component={'ul'}>
						{listItems.length > 0 ? listItems : <EmptyCard/>}
					</List>
					<DeleteDialog onExited={() => setDelete(false, null)} onSubmit={() => deleteJump(headers, props.delete.item.id)}/>
					<JumpEditDialog jump={props.edit.item} open={props.edit.open} onExited={() => setJumpEdit(false, null)}/>
				</Paper>
			</PoseGroup>
			{listItems.length > pageSize || offset > 0 ?
				<Center>
					<Pagination limit={pageSize} offset={offset} total={sortedJumps.length}
					            nextPageLabel={"▶"} previousPageLabel={"◀"} onClick={(e, off) => setOffset(off)}/>
				</Center>
				:
				<div/>
			}
			<JumpDialog open={props.new.open} onExited={() => setJumpNew(false)}/>
		</div>
	)
};
const mapStateToProps = state => ({
	jumps: state.jumps.jumps,
	loading: state.loading[JUMP_LOAD],
	headers: state.auth.headers,
	isLoggedIn: state.auth.isLoggedIn,
	sort: state.generic.sort,
	searchFilter: state.generic.searchFilter,
	new: state.modal.jump.new,
	edit: state.modal.jump.edit,
	delete: state.modal.generic.delete
});
const mapDispatchToProps = ({
	listJumps,
	deleteJump,
	setSort,
	setJumpNew,
	setJumpEdit,
	setDelete,
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTheme(Jumps));
