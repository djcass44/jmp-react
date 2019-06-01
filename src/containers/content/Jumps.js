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

import React from "react";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/es/ListSubheader/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/es/Avatar/Avatar";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import {deleteJump, JUMP_LOAD, listJumps, subscribeChangesInJumps} from "../../actions/Jumps";
import {connect} from "react-redux";
import Paper from "@material-ui/core/Paper";
import Pagination from "material-ui-flat-pagination";
import Center from "react-center";
import {LinearProgress, withStyles, withTheme} from "@material-ui/core";
import EmptyCard from "../../components/widget/EmptyCard";
import ReactImageFallback from "react-image-fallback";
import SchemeHighlight from "../../components/widget/SchemeHighlight";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import SortIcon from "@material-ui/icons/Sort";
import {pageSize} from "../../constants";
import posed, {PoseGroup} from "react-pose";
import JumpDialog from "../modal/JumpDialog";
import Icon from "@mdi/react";
import {mdiAccountCircleOutline, mdiAccountGroupOutline, mdiEarth} from "@mdi/js";
import JumpContent from "../../components/content/jmp/JumpContent";
import DeleteDialog from "../modal/DeleteDialog";

const Item = posed.div({
	enter: {opacity: 1},
	exit: {opacity: 0}
});
const LItem = posed.li({
	enter: {opacity: 1},
	exit: {opacity: 0}
});

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	button: {
		// margin: theme.spacing.unit,
	},
	grow: {flexGrow: 1}
});

class Jumps extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			jumps: props.jumps,
			offset: 0,
			headers: props.headers,
			isLoggedIn: props.isLoggedIn,
			showJumpDialog: false,
			showDeleteDialog: false,
			deleteItem: null
		};
		this.filterJump = this.filterJump.bind(this);
		this.handleJumpShow = this.handleJumpShow.bind(this);
		this.handleJumpHide = this.handleJumpHide.bind(this);
	}
	componentDidMount() {
		this.props.listJumps(this.state.headers);
		this.props.subscribeChangesInJumps(this.state.headers);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		// TODO check to see if anything has actually changed...
		if(nextProps.headers !== this.state.headers) {
			// Load jumps from the API
			this.props.listJumps(nextProps.headers);
		}
		this.setState({...nextProps});
	}

	filterJump(jump) {
		return jump.name.includes(this.state.searchFilter) || jump.location.includes(this.state.searchFilter);
	}

	handlePageChange(offset) {
		this.setState({offset: offset});
	}
	handleJumpShow() {
		this.setState({showJumpDialog: true});
	}
	handleJumpHide() {
		this.setState({showJumpDialog: false});
	}
	handleDeleteDialog(e, visible, item) {
		this.setState({showDeleteDialog: visible, deleteItem: item});
	}
	handleDeleteJump() {
		if(this.state.deleteItem == null) {
			console.log("No item to delete");
			return;
		}
		this.props.deleteJump(this.state.headers, this.state.deleteItem);
	}

	toggleExpansion(e, id) {
		let val = id;
		const {jumps} = this.state;
		jumps.forEach(i => {
			if(i.id !== val) {
				i.expanded = false;
				return;
			}
			if(i.expanded == null) i.expanded = true;
			else i.expanded = i.expanded !== true;
		});
		this.setState({...jumps});
	}

	getAliases(jump) {
		if(jump.alias.length === 0) return "";
		let items = [];
		jump.alias.forEach((i) => {
			items.push(i.name);
		});
		let alias = items.join(', ');
		return `AKA ${alias}`;
	}

	render() {
		const {classes, theme} = this.props;
		let listItems = [];
		// Tell the loop what our pagination limits are
		let max = (this.state.offset + pageSize);
		if(max > this.state.jumps.length) max = this.state.jumps.length;
		// Loop-d-loop
		this.state.jumps.filter(this.filterJump).forEach((i, index) => {
			if(index < this.state.offset || index > max) return;
			let avatar = {
				icon: i['personal'] === 0 ? mdiEarth : i['personal'] === 1 ? mdiAccountCircleOutline : mdiAccountGroupOutline,
				bg: i['personal'] === 0 ? theme.palette.primary.light : i['personal'] === 1 ? theme.palette.success.light : theme.palette.info.light,
				fg: i['personal'] === 0 ? theme.palette.primary.dark : i['personal'] === 1 ? theme.palette.success.dark : theme.palette.info.dark
			};
			// Generate the secondary text and add the owner (if it exists)
			let secondary = <span><SchemeHighlight text={i.location}/>{
				i['owner'] != null ? <span>&nbsp;&bull;&nbsp;{i['owner']}</span> : ""
			}</span>;
			let aliases = this.getAliases(i);
			listItems.push((
				<div key={i.id}>
					<ListItem button disableRipple value={i.id} onClick={(e) => this.toggleExpansion(e, i.id)}>
						<Avatar component={'div'} style={{backgroundColor: avatar.bg, color: avatar.fg, marginRight: 12}}>
							<ReactImageFallback style={{borderRadius: 64}} src={i.image} fallbackImage={<Icon path={avatar.icon} color={avatar.fg} size={1}/>} initialImage={<Icon path={avatar.icon} color={avatar.fg} size={1}/>}/>
						</Avatar>
						<Tooltip disableFocusListener title={aliases} placement={"left"} interactive>
							<ListItemText primary={<span className={classes.title}>{i.name}</span>} secondary={secondary}/>
						</Tooltip>
					</ListItem>
					<JumpContent jump={i} open={i.expanded === true} onDelete={(e, item) => {this.handleDeleteDialog(e, true, item)}}/>
				</div>
			));
		});

		const subHeader = (<ListSubheader className={classes.title} inset component={"div"}>
			Jumps {this.state.searchFilter != null && this.state.searchFilter.length > 0 ? `(${listItems.length} results)` : ''}
			{/*<div className={classes.grow}/>*/}
			<IconButton centerRipple={false} className={classes.button} aria-label="Sort"><SortIcon fontSize={"small"}/></IconButton>
			{this.state.isLoggedIn === true ? <IconButton centerRipple={false} className={classes.button} aria-label="Add" onClick={this.handleJumpShow}><AddIcon fontSize={"small"}/></IconButton> : ""}
			<JumpDialog open={this.state.showJumpDialog} onExited={this.handleJumpHide}/>
		</ListSubheader>);

		return (
			<div>
				{subHeader}
				{this.state.loading === true ? <LinearProgress className={classes.grow} color={"primary"}/> : "" }
				<PoseGroup animateOnMount={true}>
					<Paper component={Item} key={"root"} style={{borderRadius: 12, marginBottom: 8}}>
						<List component={'ul'}>
							{listItems.length > 0 ? listItems : <EmptyCard/>}
						</List>
						<DeleteDialog open={this.state.showDeleteDialog} onExited={(e) => {this.handleDeleteDialog(e, false, null)}} onSubmit={this.handleDeleteJump.bind(this)}/>
					</Paper>
				</PoseGroup>
				{listItems.length > pageSize || this.state.offset > 0 ?
					<Center><Pagination limit={pageSize} offset={this.state.offset} total={listItems.length} nextPageLabel={"▶"} previousPageLabel={"◀"} onClick={(e, offset) => this.handlePageChange(offset)}/></Center>
					:
					<div/>
				}
			</div>
		)
	}
}
const mapStateToProps = state => ({
	jumps: state.jumps.jumps,
	loading: state.loading[JUMP_LOAD],
	headers: state.auth.headers,
	searchFilter: state.generic.searchFilter,
	isLoggedIn: state.auth.isLoggedIn
});
const mapDispatchToProps = ({
	listJumps,
	deleteJump,
	subscribeChangesInJumps
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(Jumps)));