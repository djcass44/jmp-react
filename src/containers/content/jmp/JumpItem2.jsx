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

	// Generate the secondary text and add the owner (if it exists)
	let secondary = (
		<span>
			<Domain text={jump.location}/>
			{jump.owner != null ?
				<span>&nbsp;&bull;&nbsp;{jump.owner}</span>
				:
				""
			}
		</span>
	);

	const onFocus = (active) => setFocus(active);
	const onMouse = (active) => setMouse(active);

	const focusProps = {
		onFocus: onFocus,
		onMouse: onMouse,
		focus,
		mouse
	};

	return (
		<div key={jump.id}>
			<ListItem button className={classes.item} value={jump.id} component={"li"}
			          selected={focus}
			          onMouseEnter={() => onMouse(true)}
			          onMouseLeave={() => onMouse(false)}
			          onFocus={() => onFocus(true)}
			          onBlur={() => {
				          onFocus(false);
				          setJumpExpand(dispatch, null);
			          }}>
				<ListItemText primary={<span className={classes.title}>{jump.name}</span>} secondary={secondary}/>
				<ListItemSecondaryAction>
					<PoseGroup animateOnMount={true}>
						<Item className={classes.action} key="expand">
							<JumpButton
								title="More"
								buttonProps={{
									onClick: () => setJumpExpand(dispatch,
										// collapse if we're already expanded
										expanded === jump.id ? null : jump.id
									)
								}}
								iconProps={{
									path: expanded === jump.id ? mdiChevronUp : mdiChevronDown,
									color: theme.palette.primary.main
								}
								}
								{...focusProps}
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
								}
								}
								{...focusProps}
							/>
						</Item>
					</PoseGroup>
				</ListItemSecondaryAction>
			</ListItem>
			<Collapse in={jump.id === expanded} unmountOnExit timeout={"auto"}>
				<JumpContent2 focusProps={focusProps} jump={jump}/>
			</Collapse>
		</div>
	);
};
JumpItem2.propTypes = {
	jump: PropTypes.object.isRequired
};
export default JumpItem2;