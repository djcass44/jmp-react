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
import {Grid, withStyles, withTheme} from "@material-ui/core";
import React from "react";
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

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	button: {
		// margin: theme.spacing.unit,
	},
	chip: {
		margin: theme.spacing.unit / 2,
		fontFamily: "Manrope",
		fontWeight: 500
	},
	grow: {flexGrow: 1}
});

class Similar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			similar: []
		};
	}
	componentDidMount() {
		window.document.title = `Similar - ${process.env.REACT_APP_APP_NAME}`;
		this.getMatches();
	}
	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}

	getMatches() {
		let url = new URL(window.location.href);
		let query = url.searchParams.get("query");
		if(query != null && query !== '') {
			this.props.getSimilar(this.state.headers, query);
		}
		else {
			this.props.getSimilarFail("You must specify a query!");
		}
	}

	render() {
		const {classes, theme} = this.props;
		const status = this.state.similar.length === 0 ? "We couldn't find any matches" : `We found ${this.state.similar.length} match(s)`;
		const chips = this.state.similar.map(i => {
			let avatar = {
				icon: i.personal === 0 ? mdiEarth : i.personal === 1 ? mdiAccountCircleOutline : mdiAccountGroupOutline,
				bg: i.personal === 0 ? theme.palette.primary.light : i.personal === 1 ? theme.palette.success.light : theme.palette.info.light,
				fg: i.personal === 0 ? theme.palette.primary.dark : i.personal === 1 ? theme.palette.success.dark : theme.palette.info.dark
			};
			return (
				<Tooltip disableFocusListener title={i.location} placement={"bottom"} interactive key={`${i.id}${i.name}`}>
					<Chip
						avatar={<Avatar><Icon path={avatar.icon} size={1}/></Avatar>}
						label={i.name}
						clickable
						component={Link}
						to={`/jmp?query=${i.name}`}
						className={classes.chip}/>
				</Tooltip>
			)
		});
		return <Grid container spacing={40}>
			<Grid item sm={3}/>
			<Grid item sm={6}>
				<Center><Typography variant={"h1"}>Woah</Typography></Center>
				<Center><Typography variant={"headline"}>Before you go <span role={"img"} aria-label={"Rocket"}>🚀</span></Typography></Center>
				<Center>{this.state.error == null ? status : this.state.error}</Center>
				{this.state.loading === true ? <Center><CircularProgress/></Center> : ""}
				<Center>{chips}</Center>
			</Grid>
			<Grid item sm={3}/>
		</Grid>;
	}
}

const mapStateToProps = state => ({
	similar: state.jumps.similar || [],
	loading: state.loading[GET_SIMILAR],
	error: state.errors[GET_SIMILAR],
	headers: state.auth.headers,
});
const mapDispatchToProps = ({
	getSimilar,
	getSimilarFail
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme()(withRouter(Similar))));