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

import React, {useEffect} from "react";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/es/ListSubheader/ListSubheader";
import {
	deleteJump,
	JUMP_LOAD,
	listJumps, setJumpExpand,
} from "../../actions/Jumps";
import {connect} from "react-redux";
import Paper from "@material-ui/core/Paper";
import Pagination from "material-ui-flat-pagination";
import Center from "react-center";
import {LinearProgress, makeStyles, withTheme} from "@material-ui/core";
import EmptyCard from "../../components/widget/EmptyCard";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import { pageSize} from "../../constants";
import posed, {PoseGroup} from "react-pose";
import JumpDialog from "../modal/JumpDialog";
import DeleteDialog from "../modal/DeleteDialog";
import JumpEditDialog from "../modal/JumpEditDialog";
import {sortItems} from "../../misc/Sort";
import SortButton from "../../components/widget/SortButton";
import {setOffset, setSort} from "../../actions/Generic";
import {setJumpDelete, setJumpEdit, setJumpNew} from "../../actions/Modal";
import JumpItem from "./jmp/JumpItem";

const Item = posed.div({
	enter: {opacity: 1},
	exit: {opacity: 0}
});

const useStyles = makeStyles(() => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	grow: {flexGrow: 1}
}));

const Jumps = props => {
	const sorts = [
		{id: 'name', value: "Name"},
		{id: '-name', value: "Name Desc"},
		{id: 'usage', value: "Usage"},
		{id: 'creation', value: "Creation"},
		{id: 'updated', value: "Last edited"}
	];
	
	useEffect(() => {
		window.document.title = `${process.env.REACT_APP_APP_NAME}`;
		props.listJumps(props.headers);
	}, [props.headers]);

	const filterJump = jump => {
		return jump.name.includes(props.searchFilter) || jump.location.includes(props.searchFilter);
	};

	const handlePageChange = off => {
		props.setOffset(off);
	};
	const handleJumpDialog = visible => {
		props.setJumpNew(visible);
	};
	const handleDeleteDialog = (visible, item) => {
		props.setJumpDelete(visible, item);
	};
	const handleEditDialog = (visible, item) => {
		props.setJumpEdit(visible, item);
	};
	const handleDeleteJump = () => {
		if(props.delete.item == null) {
			console.log("No item to delete");
			return;
		}
		props.deleteJump(props.headers, props.delete.item.id);
	};
	const handleSortChange = value => {
		props.setSort(value);
		props.listJumps(props.headers);
	};
	const classes = useStyles();
	let listItems = [];
	// Tell the loop what our pagination limits are
	let max = (props.offset + pageSize);
	if(max > props.jumps.length) max = props.jumps.length;
	// Loop-d-loop
	let sortedJumps = sortItems(props.jumps, props.sort);
	sortedJumps.filter(filterJump).forEach((i, index) => {
		if(index < props.offset || index > max) return;
		listItems.push(<JumpItem jump={i} key={i.id} id={i.id}/>);
	});

	const subHeader = (<ListSubheader className={classes.title} inset component={"div"}>
		{process.env.REACT_APP_APP_NOUN}s {props.searchFilter != null && props.searchFilter.length > 0 ? `(${listItems.length} results)` : ''}
		{/*<div className={classes.grow}/>*/}
		<SortButton selectedSort={props.sort} sorts={sorts} onSubmit={(e, value) => {handleSortChange(value)}}/>
		{props.isLoggedIn === true ?
			<IconButton centerRipple={false} aria-label="Add" onClick={(() => {handleJumpDialog(true)})}>
				<AddIcon fontSize={"small"}/>
			</IconButton>
			:
			""
		}
		<JumpDialog open={props.new.open} onExited={() => {handleJumpDialog(false)}}/>
	</ListSubheader>);

	return (
		<div>
			{subHeader}
			{props.loading === true ? <LinearProgress className={classes.grow} color={"primary"}/> : "" }
			<PoseGroup animateOnMount={true}>
				<Paper component={Item} key={"root"} style={{borderRadius: 12, marginBottom: 8}}>
					<List component={'ul'}>
						{listItems.length > 0 ? listItems : <EmptyCard/>}
					</List>
					<DeleteDialog open={props.delete.open} onExited={() => {handleDeleteDialog(false, null)}} onSubmit={() => handleDeleteJump()}/>
					<JumpEditDialog jump={props.edit.item} open={props.edit.open} onExited={() => {handleEditDialog(false, null)}}/>
				</Paper>
			</PoseGroup>
			{listItems.length > pageSize || props.offset > 0 ?
				<Center>
					<Pagination limit={pageSize} offset={props.offset} total={sortedJumps.length}
					            nextPageLabel={"▶"} previousPageLabel={"◀"} onClick={(e, off) => handlePageChange(off)}/>
				</Center>
				:
				<div/>
			}
		</div>
	)
};
const mapStateToProps = state => ({
	jumps: state.jumps.jumps,
	expanded: state.jumps.expanded,
	loading: state.loading[JUMP_LOAD],
	headers: state.auth.headers,
	isLoggedIn: state.auth.isLoggedIn,
	sort: state.generic.sort,
	searchFilter: state.generic.searchFilter,
	offset: state.generic.offset,
	new: state.modal.jump.new,
	edit: state.modal.jump.edit,
	delete: state.modal.jump.delete
});
const mapDispatchToProps = ({
	listJumps,
	deleteJump,
	setSort,
	setJumpNew,
	setJumpEdit,
	setJumpDelete,
	setOffset,
	setJumpExpand
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTheme(Jumps));
