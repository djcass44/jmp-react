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

import {connect} from "react-redux";
import {LinearProgress, makeStyles, Avatar, ListItemText, ListItem, ListSubheader, Paper, List, IconButton} from "@material-ui/core";
import React, {useEffect} from "react";
import EmptyCard from "../../../components/widget/EmptyCard";
import Center from "react-center";
import Pagination from "material-ui-flat-pagination/lib/Pagination";
import {pageSize} from "../../../constants";
import {getGroups, GROUP_LOAD} from "../../../actions/Groups";
import Icon from "@mdi/react";
import {mdiAccountGroupOutline} from "@mdi/js";
import posed, {PoseGroup} from "react-pose";
import {sortItems} from "../../../misc/Sort";
import SortButton from "../../../components/widget/SortButton";
import AddIcon from "@material-ui/icons/Add";
import CreateGroupDialog from "../../modal/CreateGroupDialog";
import {setGroupNew} from "../../../actions/Modal";
import {setOffset, setSort} from "../../../actions/Generic";
import getAvatarScheme from "../../../style/getAvatarScheme";
import {useTheme} from "@material-ui/core/styles";

const Item = posed.div({
	enter: {opacity: 1},
	exit: {opacity: 0}
});

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	},
	progress: {
		backgroundColor: theme.palette.background.default,
		flexGrow: 1
	}
}));

const Groups = props => {
	const sorts = [
		{id: 'name', value: "Name"},
		{id: '-name', value: "Name Desc"},
		{id: 'creation', value: "Creation"},
		{id: 'updated', value: "Last edited"}
	];
	
	useEffect(() => {
		props.getGroups(props.headers);
	}, [props.headers]);
	
	const filterGroup = group => {
		return group.name.toLowerCase().includes(props.searchFilter) ||
			group.from.toLowerCase() === props.searchFilter.toLowerCase();
	};
	const handlePageChange = offset => props.setOffset(offset);
	const handleSortChange = value => {
		props.setSort(value);
		props.getGroups(props.headers);
	};
	const capitalise = text => {
		if(text == null || text.length === 0) return text;
		if(text.toLowerCase() === "ldap") return "LDAP";
		return text.substring(0, 1).toUpperCase() + text.substring(1, text.length).toLowerCase();
	};
	const theme = useTheme();
	const classes = useStyles();
	// get the colour scheme
	const scheme = getAvatarScheme(theme, 2);

	let listItems = [];
	// Tell the loop what our pagination limits are
	let max = (props.offset + pageSize);
	if(max > props.groups.length) max = props.groups.length;
	let sortedGroups = sortItems(props.groups, props.sort);
	sortedGroups.filter(filterGroup).forEach((i, index) => {
		if(index < props.offset || index > max) return;
		let secondary = <span>{capitalise(i.from)}</span>;
		listItems.push((
			<ListItem button disableRipple key={index} component={'li'}>
				<Avatar component={'div'} style={{backgroundColor: scheme[0], color: scheme[1], marginRight: 12}}>
					<Icon path={mdiAccountGroupOutline} size={1} color={scheme[1]}/>
				</Avatar>
				<ListItemText primary={<span className={classes.title}>{i.name}</span>} secondary={secondary}/>
			</ListItem>
		));
	});
	// TODO move to component
	const subHeader = (
		<ListSubheader className={classes.title} inset component="div">
			Groups {props.searchFilter != null && props.searchFilter.length > 0 ? `(${listItems.length} results)` : ''}
			<SortButton selectedSort={props.sort} sorts={sorts} onSubmit={(e, value) => handleSortChange(value)}/>
			<IconButton centerRipple={false} aria-label="Add" onClick={() => props.setGroupNew(true)}>
				<AddIcon fontSize="small"/>
			</IconButton>
			<CreateGroupDialog/>
		</ListSubheader>
	);

	return (
		<div>
			{subHeader}
			{props.loading === true ? <LinearProgress className={classes.progress} color="primary"/> : "" }
			<PoseGroup animateOnMount={true}>
				<Paper key="root" component={Item} style={{borderRadius: 12, marginBottom: 8}}>
					<List component='ul'>
						{listItems.length > 0 ? listItems : <EmptyCard/>}
					</List>
				</Paper>
			</PoseGroup>
			{listItems.length > pageSize || props.offset > 0 ?
				<Center>
					<Pagination limit={pageSize} offset={props.offset} total={sortedGroups.length}
		                nextPageLabel={"▶"} previousPageLabel={"◀"} onClick={(e ,offset) => handlePageChange(offset)}/>
				</Center>
				:
				<div/>
			}
		</div>
	)
};

const mapStateToProps = state => ({
	groups: state.groups.groups,
	loading: state.loading[GROUP_LOAD],
	headers: state.auth.headers,
	sort: state.generic.sort,
	searchFilter: state.generic.searchFilter,
	offset: state.generic.offset
});
const mapDispatchToProps = ({
	getGroups,
	setGroupNew,
	setOffset,
	setSort
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Groups);
