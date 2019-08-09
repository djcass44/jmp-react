import {IconButton, Tooltip, withTheme} from "@material-ui/core";
import Icon from "@mdi/react";
import React from "react";
import PropTypes from "prop-types";

export const StatusIcon = props => {
	const colour = props.active === true ? props.theme.palette.success.main : props.theme.palette.error.main;
	const colourName = props.active === true ? "primary" : "secondary";
	return (
		<Tooltip title={props.title}>
			<IconButton color={colourName} centerRipple={false}>
				<Icon component={'div'} path={props.icon} size={1} color={colour}/>
			</IconButton>
		</Tooltip>
	)
};
StatusIcon.propTypes = {
	active: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired
};
export default withTheme(StatusIcon);