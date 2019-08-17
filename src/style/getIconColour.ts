import {Theme} from "@material-ui/core";

export default (theme: Theme) => {
	return theme.palette.getContrastText(theme.palette.background.default);
};