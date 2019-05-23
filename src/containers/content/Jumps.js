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
import {JUMP_LOAD, listJumps, rmJump} from "../../actions/Jumps";
import {connect} from "react-redux";
import Paper from "@material-ui/core/Paper";
import Pagination from "material-ui-flat-pagination";
import Center from "react-center";
import {withStyles, withTheme} from "@material-ui/core";
import EmptyCard from "../../components/widget/EmptyCard";
import ReactImageFallback from "react-image-fallback";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PublicIcon from "@material-ui/icons/Public";
import SchemeHighlight from "../../components/widget/SchemeHighlight";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500}
});

class Jumps extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			jumps: [],
			pageSize: 10,
		};
		this.filterJump = this.filterJump.bind(this);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		console.log(nextProps);
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

	render() {
		const {classes, theme} = this.props;
		let listItems = [];
		this.state.jumps.filter(this.filterJump).forEach((i, index) => {
			let avatar = {
				icon: i.personal === 0 ? <PublicIcon/> : i.personal === 1 ? <AccountCircleIcon/> : <PublicIcon/>,
				bg: i.personal === 0 ? theme.palette.primary.light : i.personal === 1 ? theme.palette.success.light : theme.palette.info.light,
				fg: i.personal === 0 ? theme.palette.primary.dark : i.personal === 1 ? theme.palette.success.dark : theme.palette.info.dark
			};
			listItems.push((
				<ListItem button disableRipple key={index}>
					<Avatar component={'div'} style={{backgroundColor: avatar.bg, color: avatar.fg}}>
						<ReactImageFallback style={{borderRadius: 64}} src={i.image} fallbackImage={avatar.icon}/>
					</Avatar>
					<ListItemText primary={<span className={classes.title}>{i.name}</span>} secondary={<SchemeHighlight text={i.location}/>}/>
				</ListItem>
			));
		});

		return (
			<div>
				<ListSubheader className={classes.title} inset component={"div"}>Jumps {this.state.searchFilter}</ListSubheader>
				<Paper style={{borderRadius: 12, marginBottom: 8}}>
					<List>
						{listItems.length > 0 ? listItems : <EmptyCard/>}
					</List>
				</Paper>
				{this.state.jumps.length > this.state.pageSize ?
					<Center><Pagination limit={this.state.pageSize} offset={0} total={this.state.jumps.length} nextPageLabel={"▶"} previousPageLabel={"◀"}/></Center>
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
	rmJump
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme()(Jumps)));