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
 */

import {
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	makeStyles,
	Popover,
	Theme,
	useTheme,
	withWidth
} from "@material-ui/core";
import {
	mdiCallMerge,
	mdiDotsVertical,
	mdiNetworkStrength1,
	mdiNetworkStrength2,
	mdiNetworkStrength3,
	mdiNetworkStrength4,
	mdiNetworkStrengthOutline
} from "@mdi/js";
import React, {ReactNode, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {usePalette} from "react-palette";
import {isWidthDown} from "@material-ui/core/withWidth";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import JumpAvatar from "../../../components/content/jmp/JumpAvatar";
import {setJumpExpand} from "../../../store/actions/jumps";
import {Jump} from "../../../types";
import JumpButton from "../../../components/content/jmp/JumpButton";
import {APP_NOUN} from "../../../constants";
import Domain from "../../../components/widget/Domain";
import {TState} from "../../../store/reducers";
import {JumpsState} from "../../../store/reducers/jumps";
import getUsage from "../../../store/selectors/getUsage";
import JumpContent from "./JumpContent";

const useStyles = makeStyles((theme: Theme) => ({
	item: {
		borderRadius: 12
	},
	itemAction: {
		pointerEvents: "none"
	},
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		color: theme.palette.text.primary
	},
	subtitle: {
		color: theme.palette.text.hint
	},
	collapse: {
		padding: theme.spacing(2),
		borderRadius: 12,
		color: theme.palette.text.secondary,
		minHeight: 48
	},
	action: {
		float: "right"
	}
}));

interface JumpItemProps {
	jump: Jump;
	width: Breakpoint;
}

const JumpItem: React.FC<JumpItemProps> = ({jump, width}: JumpItemProps) => {
	// hooks
	const classes = useStyles();
	const theme = useTheme<Theme>();
	const dispatch = useDispatch();

	// global state
	const {expanded} = useSelector<TState, JumpsState>(state => state.jumps);
	const [mouse, setMouse] = useState<boolean>(false);
	const {data, loading, error} = usePalette(jump.image || "");
	const usage = useSelector<TState, number>(state => getUsage(jump, state));

	// local state
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	// misc data
	const selected = expanded === jump.id || anchorEl != null;
	const smallScreen = isWidthDown("sm", width);

	const getAliases = (): ReactNode | null => {
		if (jump.alias == null || jump.alias.length === 0) return null;
		return <small
			className={classes.subtitle}>
			&nbsp;&bull;&nbsp;AKA&nbsp;{jump.alias.map(i => i.name).join(", ")}
		</small>;
	};

	const primary = (
		<>
			<span className={classes.title}>
				{jump.name}
			</span>
			{(selected || mouse) && getAliases()}
		</>
	);

	// Generate the secondary text and add the owner (if it exists)
	const secondary = (
		<span>
			<Domain text={jump.location}/>
			{!jump.public && <span>
				&nbsp;&bull;&nbsp;{jump.owner?.username || jump.ownerGroup?.name}
			</span>}
		</span>
	);

	const onMouse = (active: boolean) => setMouse(active);

	const focusProps = {
		onMouseEnter: () => setMouse(true),
		onMouseLeave: () => setMouse(false)
	};

	const getUsageIconProps = (): object => {
		let color = theme.palette.primary.main;
		let path = mdiNetworkStrengthOutline;
		switch (usage) {
			case 4:
				color = theme.palette.success.main;
				path = mdiNetworkStrength4;
				break;
			case 3:
				color = theme.palette.secondary.main;
				path = mdiNetworkStrength3;
				break;
			case 2:
				color = theme.palette.warning.main;
				path = mdiNetworkStrength2;
				break;
			case 1:
				color = theme.palette.error.main;
				path = mdiNetworkStrength1;
				break;
		}
		return {
			color,
			path
		};
	};

	const onContext = (e: React.MouseEvent<HTMLElement>): void => {
		e.preventDefault();
		setAnchorEl(e.currentTarget);
	};

	return (
		<div>
			<ListItem
				className={classes.item}
				button
				selected={selected}
				onContextMenu={onContext}
				onClick={() => setJumpExpand(dispatch, jump.id)}
				onMouseEnter={() => onMouse(true)}
				onMouseLeave={() => onMouse(false)}>
				<JumpAvatar jump={jump} palette={data} loading={loading} error={error}/>
				<ListItemText primary={primary} secondary={secondary}/>
				<ListItemSecondaryAction>
					<div className={classes.action} key="expand">
						<JumpButton
							title="More"
							buttonProps={{
								onClick: (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)
							}}
							iconProps={{
								path: mdiDotsVertical,
								color: theme.palette.text.secondary
							}}
							focus={selected || smallScreen}
							mouse={mouse}
							focusProps={focusProps}
						/>
					</div>
					<div className={classes.action} key="jump">
						<JumpButton
							title={APP_NOUN}
							buttonProps={{
								component: Link,
								to: `/jmp?query=${jump.name}&id=${jump.id}`
							}}
							iconProps={{
								path: mdiCallMerge,
								color: theme.palette.primary.main
							}}
							focus={smallScreen}
							mouse={mouse}
							focusProps={focusProps}
						/>
					</div>
					<div className={classes.action} key="usage">
						<JumpButton
							title={`Used ${jump.usage} time(s)`}
							iconProps={getUsageIconProps()}
							focus={selected || smallScreen}
							mouse={mouse}
							focusProps={focusProps}
						/>
					</div>
				</ListItemSecondaryAction>
			</ListItem>
			<Popover
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				open={Boolean(anchorEl)}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right"
				}}>
				<JumpContent
					focusProps={focusProps}
					jump={jump} palette={data}
					loading={loading}
					error={error}
				/>
			</Popover>
		</div>
	);
};
export default withWidth()(JumpItem);