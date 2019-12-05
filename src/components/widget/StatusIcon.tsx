import {IconButton, Tooltip} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
import Icon from "@mdi/react";
import React from "react";
import {Theme} from "../../style/palette";

export default ({active = null, title, icon}: { active: string | null, title: string, icon: string }) => {
	const theme = useTheme<Theme>();

	if (active == null) return "";

	const ok = active === "UP";
	const colour = ok ? theme.palette.success.main : theme.palette.error.main;
	const colourName = ok ? "primary" : "secondary";
	return (
		<Tooltip title={`${title}: ${active || "DOWN"}`}>
			<IconButton color={colourName}>
				<Icon path={icon} size={1} color={colour}/>
			</IconButton>
		</Tooltip>
	)
};
