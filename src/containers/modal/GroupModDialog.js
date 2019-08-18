import React, {useEffect, useState} from 'react';
import {
	CircularProgress,
	Typography,
	Button,
	DialogTitle,
	DialogContent,
	DialogActions,
	Dialog,
	List,
	ListItem,
	ListItemIcon,
	Checkbox,
	ListItemText,
	ListItemSecondaryAction,
	makeStyles
} from "@material-ui/core";
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
import Center from "react-center";
import {setUserGroups as mSetUserGroups} from "../../actions/Modal";

const useStyles = makeStyles(() => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		fontSize: 20
	},
	button: {
		fontFamily: "Manrope",
		fontWeight: 'bold'
	},
}));

class GroupModPayload {
	constructor(add, rm) {
		this.add = add;
		this.rm = rm;
	}
}
const GroupModDialog = ({open, user, groups, userGroups, loading, headers, ...props}) => {
	const [usermap, setUsermap] = useState([]);

	useEffect(() => {
		if(open === true)
			updateGroupMappings()
	}, [groups, userGroups]);

	const updateGroupMappings = () => {
		let mapping = [];
		// Check whether the user is in each group and build a mapping array
		groups.forEach(g => {
			const g2 = JSON.parse(JSON.stringify(g));
			g2.checked = userGroups.some(e => e.name === g.name);
			mapping.push(g2);
		});
		setUsermap(mapping);
	};

	const loadData = () => {
		if(user == null) return;
		props.getUserGroups(headers, user.id);
	};

	const onChecked = index => {
		const checked = !usermap[index].checked;
		onChange(index, checked);
	};

	/**
	 * Add or remove the user from a group
	 * @param index: position of the group in the userMap
	 * @param checked: whether the group should be added or removed
	 */
	const onChange = (index, checked) => {
		const item = usermap[index];
		let add = [];
		let rm = [];
		if(checked === true)
			add.push(item.id);
		else
			rm.push(item.id);
		const payload = new GroupModPayload(add, rm);
		item.loading = true;
		props.setUserGroups(headers, user.id, JSON.stringify(payload));
	};

	const classes = useStyles();
	let listItems = [];
	let sortedGroups = sortItems(usermap, 'name');
	sortedGroups.forEach((i, index) => {
		listItems.push(
			<ListItem key={i.id} component='li' role={undefined} dense>
				<ListItemIcon>
					<Checkbox color="primary" edge="start" checked={i.checked === true} disabled={loading === true || i['loading'] === true} tabIndex={-1} onChange={() => onChecked(index)}/>
				</ListItemIcon>
				<ListItemText id={i.id} primary={i.name}/>
				{loading === true || i['loading'] === true ? <ListItemSecondaryAction><CircularProgress size={15}/></ListItemSecondaryAction> : ""}
			</ListItem>
		)
	});
	return (
		<Dialog open={open === true} aria-labelledby="form-dialog-title" onEnter={() => loadData()}>
			<DialogTitle id="form-dialog-title">
				<Typography className={classes.title}>
					Modify groups
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Typography variant="body1">
					Here you can modify the groups that {user != null ? user.username || 'the user' : 'the user'} is in.
				</Typography>
				<div style={{margin: 12}}>
				{loading === true && usermap.length === 0 ?
					<Center><CircularProgress/></Center>
					:
					<List component='ul'>
						{listItems.length > 0 ? listItems : <Center>There are no groups</Center>}
					</List>
				}
				</div>
			</DialogContent>
			<DialogActions>
				<Button className={classes.button} color="secondary" onClick={() => props.mSetUserGroups(false, null)}>Done</Button>
			</DialogActions>
		</Dialog>
	);
};
const mapStateToProps = state => ({
	groups: state.groups.groups,
	userGroups: state.groups.userGroups,
	loading: state.loading[GROUP_LOAD] || state.loading[GET_USER_GROUPS],
	loadingMod: state.loading[SET_USER_GROUPS],
	headers: state.auth.headers,
	user: state.modal.user.group.item,
	open: state.modal.user.group.open
});
const mapDispatchToProps = ({
	getGroups,
	getUserGroups,
	setUserGroups,
	mSetUserGroups
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GroupModDialog);
