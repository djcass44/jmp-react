import {PaletteColors} from "react-palette";
import {Theme} from "@material-ui/core";

export interface Avatar {
	icon: string;
	bg: string;
	fg: string;
}

export default (theme: Theme, icon: string, palette: PaletteColors): Avatar => {
	if (theme.palette.type === "dark") {
		return {
			icon,
			bg: palette.darkVibrant || "",
			fg: palette.darkMuted || ""
		};
	} else {
		return {
			icon,
			bg: palette.lightVibrant || "",
			fg: palette.lightMuted || ""
		};
	}
}