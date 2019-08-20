import {IconButton, Tooltip} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
import Icon from "@mdi/react";
import React from "react";
import {Theme} from "../../style/palette";

export const StatusIcon = ({active = false, title, icon}: {active: boolean | string | null, title: string, icon: string}) => {
	const theme = useTheme<Theme>();

	if(active == null) return "";

	const ok = active === true || active === "OK";
	const colour = ok ? theme.palette.success.main : theme.palette.error.main;
	const colourName = ok ? "primary" : "secondary";
	return (
		<Tooltip title={`${title}: ${ok ? "OK" : "Checks failed"}`}>
			<IconButton color={colourName}>
				<Icon path={icon} size={1} color={colour}/>
			</IconButton>
		</Tooltip>
	)
};
export default StatusIcon;