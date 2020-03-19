import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
	Avatar,
	Card,
	Divider,
	ListItem,
	ListItemAvatar,
	ListItemText,
	ListSubheader,
	makeStyles,
	Theme,
	Typography
} from "@material-ui/core";
import Status from "./Status";
import {TState} from "../../../store/reducers";
import {AuthState} from "../../../store/reducers/auth";
import {getInfoSystem} from "../../../store/actions/info/GetInfoSystem";
import {APP_NAME} from "../../../constants";

const useStyles = makeStyles((theme: Theme) => ({
	versionInfo: {
		padding: theme.spacing(1)
	}
}));

const Info: React.FC = () => {
	// hooks
	const dispatch = useDispatch();
	const classes = useStyles();

	// global state
	const {headers} = useSelector<TState, AuthState>(state => state.auth);
	// @ts-ignore
	const {systemInfo} = useSelector<TState, object>(state => state.info);

	useEffect(() => {
		getInfoSystem(dispatch, headers);
	}, [headers]);

	return (
		<div>
			<ListSubheader>Application health</ListSubheader>
			<Card>
				<ListItem>
					<ListItemText secondary={<Status showReload/>}/>
				</ListItem>
			</Card>
			<ListSubheader>About {APP_NAME}</ListSubheader>
			<Card>
				<ListItem className={classes.versionInfo}>
					<ListItemAvatar>
						<Avatar alt="App icon" src="/jmp.png"/>
					</ListItemAvatar>
					<ListItemText primary={
						<Typography color="textPrimary" variant="h5">{APP_NAME}</Typography>
					}/>
				</ListItem>
				<Divider/>
				<ListItem>
					<ListItemText
						className={classes.versionInfo}
						secondary={systemInfo?.version || "No version information found."}
					/>
				</ListItem>
			</Card>
			<ListSubheader>Open source</ListSubheader>
			<Card>
				<ListItem>
					<ListItemText
						className={classes.versionInfo}
						secondary={<div>
							<span>{APP_NAME}</span><br/>
							<span>Copyright 2020 Django Cass. All rights reserved.</span><br/><br/>
							<span>{APP_NAME} is based on the <a href="https://github.com/djcass44/jmp">JMP</a> open source project.</span>
						</div>}
					/>
				</ListItem>
			</Card>
		</div>
	);
};
export default Info;
