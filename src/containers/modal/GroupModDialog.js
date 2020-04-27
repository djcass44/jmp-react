import React, {useEffect, useState} from "react";
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
import {useDispatch, useSelector} from "react-redux";
import {sortItems} from "../../misc/Sort";
import Center from "react-center";
import {MODAL_USER_GROUPS, setDialog} from "../../store/actions/Modal";
import {defaultState} from "../../store/reducers/modal";
import {clone} from "../../util";
import {GROUP_LOAD} from "../../store/actions/groups/GetGroups";
import {GET_USER_GROUPS, getUserGroups} from "../../store/actions/groups/GetUserGroups";
import {SET_USER_GROUPS, setUserGroups} from "../../store/actions/groups/SetUserGroups";
import useAuth from "../../hooks/useAuth";

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
	const classes = useStyles();
	const dispatch = useDispatch();

	const {headers} = useAuth();
	const {groups, userGroups} = useSelector(state => state.groups);
	const loading = useSelector(state => state.loading[GROUP_LOAD] || state.loading[GET_USER_GROUPS] || state.loading[SET_USER_GROUPS]);
	const {other, open} = useSelector(state => state.modal[MODAL_USER_GROUPS] || defaultState);

	const user = other?.user || {};


	const [usermap, setUsermap] = useState([]);
	const [items, setItems] = useState([]);

	const updateGroupMappings = () => {
		let mapping = [];
		// Check whether the user is in each group and build a mapping array
		groups.content.forEach(g => {
			const g2 = clone(g);
			g2.checked = userGroups.some(e => e.name === g.name);
			mapping.push(g2);
		});
		setUsermap(mapping);
	};
	useEffect(() => {
		if (open === true)
			updateGroupMappings()
	}, [groups, userGroups]);

	useEffect(() => {
		/**
		 * Add or remove the user from a group
		 * @param index: position of the group in the userMap
		 * @param checked: whether the group should be added or removed
		 */
		const onChange = (index, checked) => {
			const item = usermap[index];
			let add = [];
			let rm = [];
			if (checked === true)
				add.push(item.id);
			else
				rm.push(item.id);
			const payload = new GroupModPayload(add, rm);
			item.loading = true;
			setUserGroups(dispatch, headers, user.id, JSON.stringify(payload));
		};

		const onChecked = index => {
			onChange(index, !usermap[index].checked);
		};

		const sortedGroups = sortItems(usermap, 'name');
		setItems(sortedGroups.map((i, index) => {
			return (
				<ListItem key={i.id} component='li' role={undefined} dense>
					<ListItemIcon>
						<Checkbox color="primary" edge="start" checked={i.checked === true}
						          disabled={loading === true || i.loading === true || i.public === true || i.name.startsWith("_")}
						          tabIndex={-1}
						          onChange={() => onChecked(index)}/>
					</ListItemIcon>
					<ListItemText id={i.id} primary={i.name}/>
					{loading === true || i.loading === true ?
						<ListItemSecondaryAction><CircularProgress size={15}/></ListItemSecondaryAction> : ""}
				</ListItem>
			)
		}));
	}, [usermap, loading]);

	const onOpen = () => {
		if (user == null) return;
		setUsermap([]);
		getUserGroups(dispatch, headers, user.id);
	};

	return (
		<Dialog open={open === true} aria-labelledby="form-dialog-title" onEnter={() => onOpen()}>
			<DialogTitle id="form-dialog-title">
				<Typography className={classes.title}>
					Modify groups
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Typography variant="body1">
					Here you can modify the groups that {user?.displayName || user?.username || 'the user'} is in.
				</Typography>
				<div style={{margin: 12}}>
					{loading === true && usermap.length === 0 ?
						<Center><CircularProgress/></Center>
						:
						<List component='ul'>
							{items.length > 0 ? items : <Center>There are no groups</Center>}
						</List>
					}
				</div>
			</DialogContent>
			<DialogActions>
				<Button className={classes.button} color="secondary"
				        onClick={() => setDialog(dispatch, MODAL_USER_GROUPS, false, null)}
				        disabled={loading === true}>Done</Button>
			</DialogActions>
		</Dialog>
	);
};
