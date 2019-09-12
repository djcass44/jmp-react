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
import {LinearProgress, makeStyles, Avatar, ListItemText, ListItem, Paper, List} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import EmptyCard from "../../../components/widget/EmptyCard";
import Center from "react-center";
import Pagination from "material-ui-flat-pagination/lib/Pagination";
import {pageSize} from "../../../constants";
import {getGroups, GROUP_LOAD} from "../../../actions/Groups";
import Icon from "@mdi/react";
import {mdiAccountGroupOutline} from "@mdi/js";
import posed, {PoseGroup} from "react-pose";
import {defaultSorts, sortItems} from "../../../misc/Sort";
import CreateGroupDialog from "../../modal/CreateGroupDialog";
import {setGroupNew} from "../../../actions/Modal";
import {setSort} from "../../../actions/Generic";
import getAvatarScheme from "../../../style/getAvatarScheme";
import {useTheme} from "@material-ui/core/styles";
import SortedSubheader from "../../../components/content/SortedSubheader";

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
		backgroundColor: 'transparent',
		flexGrow: 1
	}
}));

const Groups = props => {
	const sorts = defaultSorts;
	const [offset, setOffset] = useState(0);

	useEffect(() => {
		props.getGroups(props.headers);
	}, [props.headers]);
	const filterGroup = group => {
		return group.name.toLowerCase().includes(props.searchFilter) ||
			group.from.toLowerCase() === props.searchFilter.toLowerCase();
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
	let max = (offset + pageSize);
	if(max > props.groups.length) max = props.groups.length;
	let sortedGroups = sortItems(props.groups, props.sort);
	sortedGroups.filter(filterGroup).forEach((i, index) => {
		if(index < offset || index > max) return;
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
	return (
		<div>
			<SortedSubheader title="Groups" size={listItems.length} sorts={sorts} onAdd={() => props.setGroupNew(true)}/>
			{props.loading === true ? <LinearProgress className={classes.progress} color="primary"/> : "" }
			<PoseGroup animateOnMount={true}>
				<Paper key="root" component={Item} style={{borderRadius: 12, marginBottom: 8}}>
					<List component='ul'>
						{listItems.length > 0 ? listItems : <EmptyCard/>}
					</List>
				</Paper>
			</PoseGroup>
			{listItems.length > pageSize || offset > 0 ?
				<Center>
					<Pagination limit={pageSize} offset={offset} total={sortedGroups.length}
		                nextPageLabel={"▶"} previousPageLabel={"◀"} onClick={(e, off) => setOffset(off)}/>
				</Center>
				:
				<div/>
			}
			<CreateGroupDialog/>
		</div>
	)
};

const mapStateToProps = state => ({
	groups: state.groups.groups,
	loading: state.loading[GROUP_LOAD],
	headers: state.auth.headers,
	sort: state.generic.sort,
	searchFilter: state.generic.searchFilter,
});
const mapDispatchToProps = ({
	getGroups,
	setGroupNew,
	setSort
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Groups);
