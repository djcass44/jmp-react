import {IconButton, Theme, Tooltip} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import Icon from "@mdi/react";
import React from "react";
import {Skeleton} from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) => ({
	skeleton: {
		margin: theme.spacing(1.5),
		float: "left"
	}
}));

interface StatusIconProps {
	active: string | null;
	title: string;
	icon: string;
	loading?: boolean;
}

const StatusIcon: React.FC<StatusIconProps> = ({active = null, title, icon, loading = false}) => {
	// hooks
	const classes = useStyles();
	const {palette} = useTheme();

	const ok = active === "UP";
	const colour = active == null ? palette.text.hint : (ok ? palette.success.main : palette.error.main);
	const colourName = ok ? "primary" : "secondary";
	return (
		<>
			{loading ? <Skeleton
					className={classes.skeleton}
					variant="circle"
					width={24}
					height={24}
					animation="wave"
				/>
				:
				<Tooltip title={`${title}: ${active || "UNKNOWN"}`}>
					<IconButton color={colourName}>
						<Icon path={icon} size={1} color={colour}/>
					</IconButton>
				</Tooltip>}
		</>
	);
};

export default StatusIcon;
