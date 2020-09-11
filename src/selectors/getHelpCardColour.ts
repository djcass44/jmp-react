import {Theme} from "@material-ui/core";

export default (theme: Theme): string => {
	return theme.palette.type === "dark" ? theme.palette.secondary.dark : theme.palette.primary.light;
}
