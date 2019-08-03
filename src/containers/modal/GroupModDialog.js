import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {CircularProgress, Typography, withStyles, withTheme} from "@material-ui/core";
import List from "@material-ui/core/List";
import {
	GET_USER_GROUPS,
	getGroups,
	getUserGroups,
	GROUP_LOAD,
	SET_USER_GROUPS,
	setUserGroups
} from "../../actions/Groups";
import {connect} from "react-redux";
import {sortItems} from "../../misc/Sort";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Center from "react-center";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
});

class GroupModPayload {
	constructor(add, rm) {
		this.add = add;
		this.rm = rm;
	}
}
class GroupModDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			groups: props.groups,
			userMap: [],
			userMapRO: [], // used to determine the delta
			userGroups: props.userGroups,
			loading: props.loading,
			headers: props.headers,
		};
		this.loadData = this.loadData.bind(this);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
		if(this.props.open === true)
			this.updateGroupMappings(nextProps);
	}

	componentDidMount() {
		this.loadData();
	}

	updateGroupMappings(nextProps) {
		let mapping = [];
		// Check whether the user is in each group and build a mapping array
		this.state.groups.forEach(g => {
			const g2 = JSON.parse(JSON.stringify(g));
			g2.checked = nextProps.userGroups.some(e => e.name === g.name);
			mapping.push(g2);
		});
		this.setState({userMap: mapping, userMapRO: JSON.parse(JSON.stringify(mapping))});
	}

	loadData() {
		if(this.props.user == null) return;
		this.props.getUserGroups(this.state.headers, this.props.user.id);
	}

	handleCheckChange(e, index) {
		const checked = !this.state.userMap[index].checked;
		this.handleChange(index, checked)
	}

	/**
	 * Add or remove the user from a group
	 * @param index: position of the group in the userMap
	 * @param checked: whether the group should be added or removed
	 */
	handleChange(index, checked) {
		const {userMap} = this.state;
		const item = userMap[index];
		let add = [];
		let rm = [];
		if(checked === true)
			add.push(item.id);
		else
			rm.push(item.id);
		const payload = new GroupModPayload(add, rm);
		item['loading'] = true;
		this.setState({...userMap});
		this.props.setUserGroups(this.state.headers, this.props.user.id, JSON.stringify(payload));
	}

	render() {
		const {classes} = this.props;
		let sortedGroups = sortItems(this.state.userMap, 'name');
		let listItems = [];
		sortedGroups.forEach((i, index) => {
			listItems.push((
				<ListItem key={i.id} component={'li'} role={undefined} dense>
					<ListItemIcon>
						<Checkbox color={"primary"} edge="start" checked={i.checked === true} disabled={this.state.loading === true || i['loading'] === true} tabIndex={-1} onChange={e => {this.handleCheckChange(e, index)}}/>
					</ListItemIcon>
					<ListItemText id={i.id} primary={i.name}/>
					{this.state.loading === true || i['loading'] === true ? <ListItemSecondaryAction><CircularProgress size={15}/></ListItemSecondaryAction> : ""}
				</ListItem>
			))
		});
		return (
			<Dialog open={this.props.open === true} aria-labelledby={"form-dialog-title"} onClose={this.props.onExited} onEnter={this.loadData}>
				<DialogTitle id={"form-dialog-title"} className={classes.title}>Modify groups</DialogTitle>
				<DialogContent>
					<Typography variant={"body1"}>
						Here you can modify the groups that {this.props.user != null ? this.props.user.username || 'the user' : 'the user'} is in.
					</Typography>
					<div style={{margin: 12}}>
					{this.state.loading === true && this.state.userMap.length === 0 ?
						<Center><CircularProgress/></Center>
						:
						<List component={'ul'}>
							{listItems.length > 0 ? listItems : <Center>There are no groups</Center>}
						</List>
					}
					</div>
				</DialogContent>
				<DialogActions>
					<Button color={"secondary"} onClick={this.props.onExited}>Done</Button>
				</DialogActions>
			</Dialog>
		);
	}
}
const mapStateToProps = state => ({
	groups: state.groups.groups || [],
	userGroups: state.groups.userGroups || [],
	loading: state.loading[GROUP_LOAD] || state.loading[GET_USER_GROUPS],
	loadingMod: state.loading[SET_USER_GROUPS],
	headers: state.auth.headers
});
const mapDispatchToProps = ({
	getGroups,
	getUserGroups,
	setUserGroups
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(GroupModDialog)));