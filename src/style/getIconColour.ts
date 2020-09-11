import {Theme} from "@material-ui/core";

export default (theme: Theme): string => {
	return theme.palette.getContrastText(theme.palette.background.default);
};
