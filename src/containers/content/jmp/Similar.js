/*
 *    Copyright 2019 Django Cass
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 */

import {connect} from "react-redux";
import {Grid, makeStyles} from "@material-ui/core";
import React, {useEffect} from "react";
import {GET_SIMILAR, getSimilar, getSimilarFail} from "../../../actions/Jumps";
import Typography from "@material-ui/core/es/Typography/Typography";
import Center from "react-center";
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";
import Chip from "@material-ui/core/Chip";
import Icon from "@mdi/react";
import {mdiAccountGroupOutline, mdiAccountCircleOutline, mdiEarth} from "@mdi/js";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import {Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import ReactImageFallback from "react-image-fallback";
import getAvatarScheme from "../../../style/getAvatarScheme";
import useTheme from "@material-ui/core/styles/useTheme";
import getErrorMessage from "../../../selectors/getErrorMessage";
import {APP_NAME} from "../../../constants";

const useStyles = makeStyles(theme => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500,
		color: theme.palette.text.primary
	},
	subtitle: {
		color: theme.palette.text.secondary
	},
	button: {
		// margin: theme.spacing.unit,
	},
	chip: {
		margin: theme.spacing.unit / 2,
		fontFamily: "Manrope",
		fontWeight: 500
	},
	grow: {
		flexGrow: 1
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: '80vh'
	}
}));

const Similar = ({headers, similar, loading, error, getSimilar, getSimilarFail}) => {
	useEffect(() => {
		window.document.title = `Similar - ${APP_NAME}`;
		getMatches();
	}, []);

	const getMatches = () => {
		let url = new URL(window.location.href);
		let query = url.searchParams.get("query");
		if(query != null && query !== '') {
			getSimilar(headers, query);
		}
		else {
			getSimilarFail("You must specify a query!");
		}
	};
	
	const classes = useStyles();
	const theme = useTheme();
	let status;
	switch (similar.length) {
		case 0:
			status = "We couldn't find any matches";
			break;
		case 1:
			status = "We found 1 match";
			break;
		default:
			status = `We found ${similar.length} matches`;
			break;
	}
	const chips = similar.map(i => {
		const scheme = getAvatarScheme(theme, i.personal);
		const textColour = theme.palette.getContrastText(scheme[0]);
		let avatar = {
			icon: i.personal === 0 ? mdiEarth : i.personal === 1 ? mdiAccountCircleOutline : mdiAccountGroupOutline,
			bg: scheme[0],
			fg: scheme[1]
		};
		return (
			<Tooltip disableFocusListener title={i.location} placement={"bottom"} interactive key={`${i.id}${i.name}`}>
				<Chip
					avatar={<Avatar style={{backgroundColor: avatar.bg, color: avatar.fg}}>
						{/* Website icon or MDI icon fallback */}
						<ReactImageFallback style={{borderRadius: 64}} src={i.image} fallbackImage={
							<Icon path={avatar.icon} color={avatar.fg} size={1}/>
						} initialImage={<Icon path={avatar.icon} color={avatar.fg} size={1}/>}/>
					</Avatar>}
					label={<span style={{color: textColour}}>{i.name}</span>}
					clickable
					component={Link}
					to={`/jmp?query=${i.name}?id=${i.id}`}
					style={{backgroundColor: avatar.bg, color: avatar.fg}}
					className={classes.chip}/>
			</Tooltip>
		)
	});
	return <Grid container spacing={5} className={classes.container}>
		<Grid item sm={3}/>
		<Grid item sm={6}>
			<Center>
				<Typography className={classes.title} variant={"h1"}>Woah</Typography>
			</Center>
			<Center>
				<Typography className={classes.subtitle} variant={"subtitle1"}>Before you go <span role={"img"} aria-label={"Rocket"}>🚀</span></Typography>
			</Center>
			<Center>
				<Typography variant={"subtitle1"} className={classes.title}>{error == null ? status : getErrorMessage(error)}</Typography>
			</Center>
			{loading === true ? <Center><CircularProgress/></Center> : ""}
			<Center style={{padding: 16}}>{chips}</Center>
		</Grid>
		<Grid item sm={3}/>
	</Grid>;
};
Similar.propTypes = {
	similar: PropTypes.array.isRequired,
	headers: PropTypes.object,
	loading: PropTypes.bool,
	error: PropTypes.object,
	getSimilar: PropTypes.func.isRequired,
	getSimilarFail: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	similar: state.jumps.similar,
	loading: state.loading[GET_SIMILAR],
	error: state.errors[GET_SIMILAR],
	headers: state.auth.headers,
});
const mapDispatchToProps = ({
	getSimilar,
	getSimilarFail
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(Similar));
