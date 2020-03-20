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
	Collapse,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	makeStyles,
	Theme,
	useTheme,
	withWidth
} from "@material-ui/core";
import {mdiCallMerge, mdiChevronDown, mdiChevronUp} from "@mdi/js";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Domain from "../../../components/widget/Domain";
import {Link} from "react-router-dom";
import {APP_NOUN} from "../../../constants";
import JumpButton from "../../../components/content/jmp/JumpButton";
import JumpContent from "./JumpContent";
import JumpAvatar from "../../../components/content/jmp/JumpAvatar";
import {usePalette} from "react-palette";
import {isWidthDown} from "@material-ui/core/withWidth";
import {setJumpExpand} from "../../../store/actions/jumps";
import {Jump} from "../../../types";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import {TState} from "../../../store/reducers";
import {JumpsState} from "../../../store/reducers/jumps";

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
	const {expanded} = useSelector<TState, JumpsState>(state => state.jumps);
	const [mouse, setMouse] = useState<boolean>(false);
	const {data, loading, error} = usePalette(jump.image || "");

	// misc data
	const selected = expanded === jump.id;
	const smallScreen = isWidthDown("sm", width);

	const getAliases = () => {
		if (jump.alias == null || jump.alias.length === 0) return "";
		return `AKA ${jump.alias.map(i => i.name).join(", ")}`;
	};

	const primary = (
		<>
			<span className={classes.title}>
				{jump.name}
			</span>
			{((selected || mouse) && jump.alias && jump.alias.length > 0) && <small className={classes.subtitle}>
				&nbsp;&bull;&nbsp;{getAliases()}
			</small>}
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

	return (
		<div>
			<ListItem component={"li"} button className={classes.item} value={jump.id}
			          selected={selected}
			          onClick={() => setJumpExpand(dispatch, jump.id)}
			          onMouseEnter={() => onMouse(true)}
			          onMouseLeave={() => onMouse(false)}>
				<JumpAvatar jump={jump} background={false} palette={data} loading={loading} error={error}/>
				<ListItemText primary={primary} secondary={secondary}/>
				<ListItemSecondaryAction>
					<div className={classes.action} key="expand">
						<JumpButton
							title="More"
							buttonProps={{
								onClick: () => setJumpExpand(dispatch,
									// collapse if we're already expanded
									selected ? null : jump.id
								)
							}}
							iconProps={{
								path: selected ? mdiChevronUp : mdiChevronDown,
								color: theme.palette.primary.main
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
				</ListItemSecondaryAction>
			</ListItem>
			<Collapse in={selected} unmountOnExit timeout={"auto"}>
				<JumpContent focusProps={focusProps} jump={jump} palette={data} loading={loading} error={error}/>
			</Collapse>
		</div>
	);
};
export default withWidth()(JumpItem);