import {createStyles, makeStyles} from "@material-ui/core";
import * as React from "react";
import { ThemeProvider, useTheme } from "@material-ui/styles";

interface Theme {
	palette: {
		success: {
			main: string,
		},
		error: {
			main: string
		},
		text: {
			secondary: string
		}
	}
}

const useStyles = makeStyles(({palette}: Theme) => createStyles({
	https: {
		color: palette.success.main
	},
	http: {
		color: palette.error.main,
		textDecorationLine: 'line-through'
	},
	secondaryText: {
		color: palette.text.secondary
	}
}));

const Domain = ({text}: {text: string}) => {
	const theme = useTheme<Theme>();
	const classes = useStyles(theme);

	const highlighted = (url: string, classes: any) => {
		const split = url.split("://");
		const scheme = split[0];
		const domain = split[1];
		return (<span className={classes[scheme]}>{scheme}://<span className={classes.secondaryText}>{domain}</span></span>);
	};
	return (
		<ThemeProvider<Theme> theme={theme}>
			<span>
				{highlighted(text, classes)}
			</span>
		</ThemeProvider>
	)

};
export default Domain;