import React, {useEffect, useState} from 'react';
import {
	Button,
	Checkbox,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	makeStyles,
	Typography
} from "@material-ui/core";
import {GET_USER_GROUPS, getUserGroups, GROUP_LOAD, setUserGroups} from "../../actions/Groups";
import {useDispatch, useSelector} from "react-redux";
import {sortItems} from "../../misc/Sort";
import Center from "react-center";
import {MODAL_USER_GROUPS, setDialog} from "../../actions/Modal";
import {defaultState} from "../../reducers/Modal";

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

export default () => {
	// hooks
	const dispatch = useDispatch();

	const {headers} = useSelector(state => state.auth);
	const {groups, userGroups} = useSelector(state => state.groups);
	const loading = useSelector(state => state.loading[GROUP_LOAD] || state.loading[GET_USER_GROUPS]);
	const {other, open} = useSelector(state => state.modal[MODAL_USER_GROUPS] || defaultState);

	const user = other.user || {};


	const [usermap, setUsermap] = useState([]);
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
	useEffect(() => {
		if(open === true)
			updateGroupMappings()
	}, [groups, userGroups]);
	const onOpen = () => {
		if(user == null) return;
		setUsermap([]);
		getUserGroups(dispatch, headers, user.id);
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
		setUserGroups(dispatch, headers, user.id, JSON.stringify(payload));
	};
	const onChecked = index => onChange(index, !usermap[index].checked);

	const classes = useStyles();
	let listItems = [];
	let sortedGroups = sortItems(usermap, 'name');
	sortedGroups.forEach((i, index) => {
		listItems.push(
			<ListItem key={i.id} component='li' role={undefined} dense>
				<ListItemIcon>
					<Checkbox color="primary" edge="start" checked={i.checked === true}
					          disabled={loading === true || i.loading === true || i.public === true} tabIndex={-1}
					          onChange={() => onChecked(index)}/>
				</ListItemIcon>
				<ListItemText id={i.id} primary={i.name}/>
				{loading === true || i.loading === true ?
					<ListItemSecondaryAction><CircularProgress size={15}/></ListItemSecondaryAction> : ""}
			</ListItem>
		)
	});
	return (
		<Dialog open={open === true} aria-labelledby="form-dialog-title" onEnter={() => onOpen()}>
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
				<Button className={classes.button} color="secondary"
				        onClick={() => setDialog(dispatch, MODAL_USER_GROUPS, false)}
				        disabled={loading === true}>Done</Button>
			</DialogActions>
		</Dialog>
	);
};
