export interface Theme {
	palette: PaletteGroup
}
export interface PaletteGroup {
	primary: Palette,
	secondary: Palette,
	search: string,
	warning: Palette,
	error: Palette,
	info: Palette,
	success: Palette,
	text: {
		primary: string,
		secondary: string
	}
	background: {
		default: string,
		paper: string
	},
	action: {
		selected: string,
		hover: string
	}
	type: string
}
export interface Palette {
	main: string,
	light: string,
	dark: string
}

export const light = {
	primary: {
		main: '#4285F4',
		light: '#DEEBFF',
		dark: '#0052CC'
	},
	secondary: {
		main: '#172B4d',
		light: '#455570',
		dark: '#101e35'
	},
	search: '#DEEBFF',
	warning: {
		main: '#F4B400',
		light: '#FFE380',
		dark: '#FF8B00'
	},
	error: {
		main: '#DB4437',
		light: '#FFEBE5',
		dark: '#BF2600'
	},
	info: {
		main: '#6554C0',
		light: '#EAE6FF',
		dark: '#5243AA'
	},
	success: {
		main: '#0F9D58',
		light: '#E3FCEF',
		dark: '#00875A'
	},
	background: {
		paper: '#FFFFFF',
		default: '#FAFAFA'
	},
	type: 'light'
};

export const dark = {
	primary: {
		main: '#449df4',
		light: '#52abff',
		dark: '#222425'
	},
	secondary: {
		main: '#d1cec7',
		light: '#3F51B5',
		dark: '#222425'
	},
	search: '#505355',
	warning: {
		main: '#cd6700',
		light: '#e69400',
		dark: '#b44400'
	},
	error: {
		main: '#e26a5f',
		light: '#ff7a59',
		dark: '#430f00'
	},
	info: {
		main: '#403294',
		light: '#9288d0',
		dark: '#222425'
	},
	success: {
		main: '#78f2b7',
		light: '#4CAF50',
		dark: '#1B5E20'
	},
	background: {
		paper: '#222425',
		default: '#1a1b1c'
	},
	action: {
		selected: "#161718",
		hover: "#161718"
	},
	type: 'dark'
};
