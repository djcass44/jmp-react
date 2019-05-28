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
import {JUMP_LOAD, listJumps, rmJump, subscribeChangesInJumps} from "../../actions/Jumps";
import {connect} from "react-redux";
import Paper from "@material-ui/core/Paper";
import Pagination from "material-ui-flat-pagination";
import Center from "react-center";
import {LinearProgress, withStyles, withTheme} from "@material-ui/core";
import EmptyCard from "../../components/widget/EmptyCard";
import ReactImageFallback from "react-image-fallback";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PublicIcon from "@material-ui/icons/Public";
import SchemeHighlight from "../../components/widget/SchemeHighlight";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import SortIcon from "@material-ui/icons/Sort";
import {pageSize} from "../../constants";

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
			headers: props.headers
		};
		this.filterJump = this.filterJump.bind(this);
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
				icon: i['personal'] === 0 ? <PublicIcon/> : i['personal'] === 1 ? <AccountCircleIcon/> : <PublicIcon/>,
				bg: i['personal'] === 0 ? theme.palette.primary.light : i['personal'] === 1 ? theme.palette.success.light : theme.palette.info.light,
				fg: i['personal'] === 0 ? theme.palette.primary.dark : i['personal'] === 1 ? theme.palette.success.dark : theme.palette.info.dark
			};
			// Generate the secondary text and add the owner (if it exists)
			let secondary = <span><SchemeHighlight text={i.location}/>{
				i['owner'] != null ? <span>&nbsp;&bull;&nbsp;{i['owner']}</span> : ""
			}</span>;
			let aliases = this.getAliases(i);
			listItems.push((
				<ListItem button disableRipple key={index} component={'li'}>
					<Avatar component={'div'} style={{backgroundColor: avatar.bg, color: avatar.fg, marginRight: 12}}>
						<ReactImageFallback style={{borderRadius: 64}} src={i.image} fallbackImage={avatar.icon} initialImage={avatar.icon}/>
					</Avatar>
					<Tooltip disableFocusListener title={aliases} placement={"left"} interactive>
						<ListItemText primary={<span className={classes.title}>{i.name}</span>} secondary={secondary}/>
					</Tooltip>
				</ListItem>
			));
		});

		const subHeader = (<ListSubheader className={classes.title} inset component={"div"}>
			Jumps {this.state.searchFilter != null && this.state.searchFilter.length > 0 ? `(${listItems.length} results)` : ''}
			{/*<div className={classes.grow}/>*/}
			<IconButton centerRipple={false} className={classes.button} aria-label="Sort"><SortIcon fontSize={"small"}/></IconButton>
			<IconButton centerRipple={false} className={classes.button} aria-label="Add"><AddIcon fontSize={"small"}/></IconButton>
		</ListSubheader>);

		return (
			<div>
				{subHeader}
				{this.state.loading === true ? <LinearProgress className={classes.grow} color={"primary"}/> : "" }
				<Paper style={{borderRadius: 12, marginBottom: 8}}>
					<List component={'ul'}>
						{listItems.length > 0 ? listItems : <EmptyCard/>}
					</List>
				</Paper>
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
	searchFilter: state.generic.searchFilter
});
const mapDispatchToProps = ({
	listJumps,
	rmJump,
	subscribeChangesInJumps
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(Jumps)));