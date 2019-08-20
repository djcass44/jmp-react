import {Theme} from "@material-ui/core";

export const getDefault = (theme: Theme) => {
	return theme.palette.getContrastText(theme.palette.background.default);
};
export const getPaper = (theme: Theme) => {
	return theme.palette.getContrastText(theme.palette.background.paper);
};