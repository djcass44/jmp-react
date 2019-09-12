import {Theme} from "@material-ui/core";

export default (theme: Theme) => {
	if(theme.palette.type === "dark") {
		return theme.palette.secondary.dark;
	}
	else return theme.palette.primary.light;
}
