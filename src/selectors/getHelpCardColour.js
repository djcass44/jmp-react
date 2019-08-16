export default theme => {
	if(theme.palette.type === "dark")
		return theme.palette.secondary.dark;
	else return theme.palette.primary.light;
}