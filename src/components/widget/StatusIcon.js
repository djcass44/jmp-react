import {IconButton, Tooltip, withTheme} from "@material-ui/core";
import Icon from "@mdi/react";
import React from "react";
import PropTypes from "prop-types";

export const StatusIcon = ({active, title, icon, theme}) => {
	const {palette} = theme;
	const ok = active === true || active === "OK";
	const colour = ok === true ? palette.success.main : palette.error.main;
	const colourName = ok === true ? "primary" : "secondary";
	return (
		<Tooltip title={`${title}: ${ok === true ? "OK" : "Checks failed"}`}>
			<IconButton color={colourName}>
				<Icon component={'div'} path={icon} size={1} color={colour}/>
			</IconButton>
		</Tooltip>
	)
};
StatusIcon.propTypes = {
	active: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.bool
	]),
	title: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired
};
StatusIcon.defaultProps = {
	active: false
};
export default withTheme(StatusIcon);