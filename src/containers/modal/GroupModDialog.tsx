import React, {ReactNode, useEffect, useMemo, useState} from "react";
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
import Center from "react-center";
import {GroupUserModPayload, MODAL_USER_GROUPS, setDialog} from "../../store/actions/Modal";
import {defaultState, Modal} from "../../store/reducers/modal";
import {clone} from "../../util";
import {GROUP_LOAD} from "../../store/actions/groups/GetGroups";
import {GET_USER_GROUPS, getUserGroups} from "../../store/actions/groups/GetUserGroups";
import {SET_USER_GROUPS, setUserGroups} from "../../store/actions/groups/SetUserGroups";
import useAuth from "../../hooks/useAuth";
import {TState} from "../../store/reducers";
import {GroupsState} from "../../store/reducers/groups";
import {Group} from "../../types";
import useLoading from "../../hooks/useLoading";

const useStyles = makeStyles(() => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		fontSize: 20
	},
	button: {
		fontFamily: "Manrope",
		fontWeight: "bold"
	},
}));

class GroupModPayload {
	private add: Array<string>;
	private rm: Array<string>;

	constructor(add: Array<string>, rm: Array<string>) {
		this.add = add;
		this.rm = rm;
	}
}

interface UserMap {
	group: Group;
	checked: boolean;
}

const GroupModDialog: React.FC = () => {
	// hooks
	const classes = useStyles();
	const dispatch = useDispatch();

	const {headers} = useAuth();
	const {groups, userGroups} = useSelector<TState, GroupsState>(state => state.groups);
	const loading = useLoading([GROUP_LOAD, GET_USER_GROUPS]);
	const loadingChange = useLoading([SET_USER_GROUPS]);
	const {other, open} = useSelector<TState, Modal>(state => state.modal[MODAL_USER_GROUPS] || defaultState);

	const user = (other as GroupUserModPayload)?.user || null;

	// local state
	const [items, setItems] = useState<Array<ReactNode>>([]);
	const usermap = useMemo(() => {
		if (!open)
			return [];
		// Check whether the user is in each group and build a mapping array
		const mapping: Array<UserMap> = groups.content.map(g => {
			return {
				group: clone(g),
				checked: userGroups.some(e => e.name === g.name)
			};
		});
		return mapping;
	}, [groups, userGroups]);

	useEffect(() => {
		if (loadingChange || user == null)
			return;
		dispatch(getUserGroups(headers, user.id));
	}, [loadingChange]);

	useEffect(() => {
		/**
		 * Add or remove the user from a group
		 * @param index: position of the group in the userMap
		 * @param checked: whether the group should be added or removed
		 */
		const onChange = (index: number, checked: boolean): void => {
			const item = usermap[index];
			let add = [];
			let rm = [];
			if (checked)
				add.push(item.group.id);
			else
				rm.push(item.group.id);
			const payload = new GroupModPayload(add, rm);
			dispatch(setUserGroups(headers, user.id, JSON.stringify(payload)));
		};

		const onChecked = (index: number): void => {
			onChange(index, !usermap[index].checked);
		};

		setItems(usermap.map((i, index) => {
			const {group} = i;
			return (
				<ListItem key={group.id} component='li' role={undefined} dense>
					<ListItemIcon>
						<Checkbox
							color="primary"
							edge="start"
							checked={i.checked}
							disabled={loading || loadingChange || group.public || group.name.startsWith("_")}
							tabIndex={-1}
							onChange={() => onChecked(index)}
						/>
					</ListItemIcon>
					<ListItemText id={group.id} primary={group.name}/>
					{loading && <ListItemSecondaryAction>
						<CircularProgress size={15}/>
					</ListItemSecondaryAction>}
				</ListItem>
			)
		}));
	}, [usermap, loading]);

	const onOpen = () => {
		if (user == null) return;
		dispatch(getUserGroups(headers, user.id));
	};

	return (
		<Dialog open={open} aria-labelledby="form-dialog-title" onEnter={() => onOpen()}>
			<DialogTitle id="form-dialog-title">
				<Typography className={classes.title}>
					Modify groups
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Typography variant="body1">
					Here you can modify the groups that {user?.displayName || user?.username || "the user"} is in.
				</Typography>
				<div style={{margin: 12}}>
					{loading && usermap.length === 0 ?
						<Center><CircularProgress/></Center>
						:
						<List component='ul'>
							{items.length > 0 ? items : <Center>There are no groups</Center>}
						</List>
					}
				</div>
			</DialogContent>
			<DialogActions>
				<Button
					className={classes.button}
					color="secondary"
					onClick={() => dispatch(setDialog(MODAL_USER_GROUPS, false, null))}
					disabled={loading}>
					Done
				</Button>
			</DialogActions>
		</Dialog>
	);
};
export default GroupModDialog;