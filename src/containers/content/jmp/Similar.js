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
import {Grid, makeStyles, withTheme} from "@material-ui/core";
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

const useStyles = makeStyles(theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	button: {
		// margin: theme.spacing.unit,
	},
	chip: {
		margin: theme.spacing.unit / 2,
		fontFamily: "Manrope",
		fontWeight: 500
	},
	grow: {flexGrow: 1},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: '80vh'
	}
}));

const Similar = props => {
	useEffect(() => {
		window.document.title = `Similar - ${process.env.REACT_APP_APP_NAME}`;
		getMatches();
	}, []);

	const getMatches = () => {
		let url = new URL(window.location.href);
		let query = url.searchParams.get("query");
		if(query != null && query !== '') {
			props.getSimilar(props.headers, query);
		}
		else {
			props.getSimilarFail("You must specify a query!");
		}
	};
	
	const classes = useStyles();
	const {theme} = props;
	let status;
	switch (props.similar.length) {
		case 0:
			status = "We couldn't find any matches";
			break;
		case 1:
			status = "We found 1 match";
			break;
		default:
			status = `We found ${props.similar.length} matches`;
			break;
	}
	const chips = props.similar.map(i => {
		let avatar = {
			icon: i.personal === 0 ? mdiEarth : i.personal === 1 ? mdiAccountCircleOutline : mdiAccountGroupOutline,
			bg: i.personal === 0 ? theme.palette.primary.light : i.personal === 1 ? theme.palette.success.light : theme.palette.info.light,
			fg: i.personal === 0 ? theme.palette.primary.dark : i.personal === 1 ? theme.palette.success.dark : theme.palette.info.dark
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
					label={i.name}
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
			<Center><Typography className={classes.title} variant={"h1"}>Woah</Typography></Center>
			<Center><Typography variant={"subtitle1"}>Before you go <span role={"img"} aria-label={"Rocket"}>🚀</span></Typography></Center>
			<Center><Typography variant={"subtitle1"} className={classes.title}>{props.error == null ? status : props.error}</Typography></Center>
			{props.loading === true ? <Center><CircularProgress/></Center> : ""}
			<Center style={{padding: 16}}>{chips}</Center>
		</Grid>
		<Grid item sm={3}/>
	</Grid>;
};
Similar.propTypes = {
	similar: PropTypes.array.isRequired,
	headers: PropTypes.object,
	loading: PropTypes.bool,
	error: PropTypes.object
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
)(withTheme(withRouter(Similar)));
