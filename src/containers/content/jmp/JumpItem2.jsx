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

import {Collapse, ListItem, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import {mdiCallMerge, mdiChevronDown, mdiChevronUp} from "@mdi/js";
import React, {useState} from "react";
import {makeStyles, useTheme} from "@material-ui/styles";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from "prop-types";
import Domain from "../../../components/widget/Domain";
import {Link} from "react-router-dom";
import {APP_NOUN} from "../../../constants";
import posed, {PoseGroup} from "react-pose";
import JumpButton from "../../../components/content/jmp/JumpButton";
import {setJumpExpand} from "../../../actions/Jumps";
import JumpContent2 from "./JumpContent2";
import JumpAvatar from "../../../components/content/jmp/JumpAvatar";
import {usePalette} from "react-palette";

const Item = posed.div({
	enter: {
		opacity: 1,
		transition: {
			ease: "easeInOut"
		}
	},
	exit: {
		opacity: 0,
		transition: {
			ease: "easeInOut"
		}
	}
});

const useStyles = makeStyles(theme => ({
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

const JumpItem2 = ({jump}) => {
	// hooks
	const classes = useStyles();
	const theme = useTheme();
	const dispatch = useDispatch();
	const {expanded} = useSelector(state => state.jumps);
	const [focus, setFocus] = useState(false);
	const [mouse, setMouse] = useState(false);

	const selected = expanded === jump.id;

	const getAliases = () => {
		if (jump.alias.length === 0) return "";
		let items = [];
		jump.alias.forEach((i) => {
			items.push(i.name);
		});
		let alias = items.join(", ");
		return `AKA ${alias}`;
	};

	const primary = (
		<>
			<span className={classes.title}>
				{jump.name}
			</span>
			{((selected || focus || mouse) && jump.alias.length > 0) && <small className={classes.subtitle}>
				&nbsp;&bull;&nbsp;{getAliases()}
			</small>}
		</>
	);

	// Generate the secondary text and add the owner (if it exists)
	const secondary = (
		<span>
			<Domain text={jump.location}/>
			{jump.owner != null && <span>
				&nbsp;&bull;&nbsp;{jump.owner}
			</span>}
		</span>
	);

	const {data, loading, error} = usePalette(jump.image);

	const onFocus = (active) => {
		if (!active)
			setJumpExpand(dispatch, null);
		setFocus(active);
	};
	const onMouse = (active) => setMouse(active);

	const focusProps = {
		onFocus: () => setFocus(true),
		onBlur: () => setFocus(false),
		onMouseEnter: () => setMouse(true),
		onMouseLeave: () => setMouse(false)
	};

	return (
		<div>
			<ListItem component={"li"} button className={classes.item} value={jump.id}
			          selected={focus || selected}
			          onClick={() => setJumpExpand(dispatch, jump.id)}
			          onMouseEnter={() => onMouse(true)}
			          onMouseLeave={() => onMouse(false)}
			          onFocus={() => onFocus(true)}
			          onBlur={() => {
				          onFocus(false);
				          setJumpExpand(dispatch, null);
			          }}>
				<JumpAvatar jump={jump} background={false} palette={data} loading={loading} error={error}/>
				<ListItemText primary={primary} secondary={secondary}/>
				<ListItemSecondaryAction>
					<PoseGroup animateOnMount={true}>
						<Item className={classes.action} key="expand">
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
								focus={focus || selected}
								mouse={mouse}
								focusProps={focusProps}
							/>
						</Item>
						<Item className={classes.action} key="jump">
							<JumpButton
								title={APP_NOUN}
								buttonProps={{
									component: Link,
									to: `/jmp?query=${jump.name}&id=${jump.id}`
								}}
								iconProps={{
									path: mdiCallMerge,
									color: theme.palette.primary.dark
								}}
								focus={focus}
								mouse={mouse}
								focusProps={focusProps}
							/>
						</Item>
					</PoseGroup>
				</ListItemSecondaryAction>
			</ListItem>
			<Collapse in={selected} unmountOnExit timeout={"auto"}>
				<JumpContent2 focusProps={focusProps} jump={jump} palette={data} loading={loading} error={error}/>
			</Collapse>
		</div>
	);
};
JumpItem2.propTypes = {
	jump: PropTypes.object.isRequired
};
export default JumpItem2;