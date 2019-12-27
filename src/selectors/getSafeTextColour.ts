import {Theme} from "@material-ui/core";

export default (theme: Theme, color: string | null) => {
	if (color == null) return theme.palette.text.primary;
	try {
		return theme.palette.getContrastText(color);
	} catch (e) {
		console.error(`Failed to generate contrast for color: ${color}`);
		return theme.palette.text.primary;
	}
};