import {Theme} from "@material-ui/core";

export default (theme: Theme, color: string | null, fallback?: string | null): string => {
	if (color == null)
		return fallback || theme.palette.text.primary;
	try {
		return theme.palette.getContrastText(color);
	} catch (e) {
		console.error(`Failed to generate contrast for color: ${color}`);
		return fallback || theme.palette.text.primary;
	}
};