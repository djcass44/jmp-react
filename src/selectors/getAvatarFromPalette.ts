import {Theme} from "../style/palette";
import {PaletteColors} from "react-palette";

export default (theme: Theme, icon: string, palette: PaletteColors) => {
	if(theme.palette.type === "dark") {
		return {
			icon,
			bg: palette.darkVibrant,
			fg: palette.darkMuted
		}
	}
	else {
		return {
			icon,
			bg: palette.lightVibrant,
			fg: palette.lightMuted
		}
	}
}