export default (theme, type) => {
	const {palette} = theme;
	if(palette.type === 'dark') {
		switch (type) {
			case 1:
				return [palette.success.dark, palette.success.light];
			case 2:
				return [palette.info.dark, palette.info.light];
			default:
				return [palette.primary.dark, palette.primary.light];
		}
	}
	else {
		switch (type) {
			case 1:
				return [palette.success.light, palette.success.dark];
			case 2:
				return [palette.info.light, palette.info.dark];
			default:
				return [palette.primary.light, palette.primary.dark];
		}
	}
}