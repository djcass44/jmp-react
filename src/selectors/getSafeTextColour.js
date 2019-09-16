export default (theme, color) => {
	if (color == null) return theme.palette.text.primary;
	try {
		return theme.palette.getContrastText(color);
	} catch (e) {
		console.error(`Failed to generate contrast for color: ${color}`);
		return theme.palette.text.primary
	}
};