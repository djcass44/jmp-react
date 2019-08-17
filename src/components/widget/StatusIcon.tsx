import {IconButton, Tooltip} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
import Icon from "@mdi/react";
import React from "react";

interface MTheme {
	palette: {
		success: {
			main: string
		},
		error: {
			main: string
		}
	}
}

export const StatusIcon = ({active = false, title, icon}: {active: any, title: string, icon: string}) => {
	const theme = useTheme<MTheme>();

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