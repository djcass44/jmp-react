import React from "react";
import {connect} from "react-redux";
import {ListSubheader, Typography, withStyles, withTheme,} from "@material-ui/core";
import InfoItem from "../../../components/content/settings/InfoItem";
import {
	GET_INFO_APP, GET_INFO_ERROR,
	GET_INFO_SYS,
	getInfoApp, getInfoError,
	getInfoSystem
} from "../../../actions/Info";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import JSONPretty from "react-json-pretty";
import {
	mdiApplication,
	mdiBugCheckOutline,
	mdiMemory
} from "@mdi/js";
import Icon from "@mdi/react";
import Status from "./Status";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	button: {
		// margin: theme.spacing.unit,
	},
	statusOK: {
		color: theme.palette.success.main
	},
	statusFail: {
		color: theme.palette.error.main
	},
	statusWarn: {
		color: theme.palette.warning.main
	},
	grow: {flexGrow: 1},
});

class Info extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: '',
			headers: props.headers,
			isAdmin: props.isAdmin,
			isLoggedIn: props.isLoggedIn,
			error: props.error
		};
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}
	componentDidMount() {
		this.props.getInfoApp(this.state.headers);
		this.props.getInfoSystem(this.state.headers);
		this.props.getInfoError(this.state.headers);
	}

	render() {
		const {classes, theme} = this.props;
		const status = (
			<div>
				<Status showReload={true}/>
				<Typography variant={"body1"} className={classes.title}>Recent exceptions</Typography>
				<p>There have been {this.state.error.length} exceptions in the last 15 minutes.</p>
				{this.state.errorLoad === true ? <LinearProgress/> : ""}
			</div>
		);
		const appInfo = (<JSONPretty data={JSON.stringify(this.state.appInfo)}/>);
		const sysInfo = (<JSONPretty data={JSON.stringify(this.state.systemInfo)}/>);
		return (
			<div>
				<ListSubheader className={classes.title} inset component={"div"}>Information &amp; status</ListSubheader>
				<InfoItem title={<span>Application health</span>} content={status} open={true} icon={
					<Icon style={{paddingRight: 8}} path={mdiBugCheckOutline} size={1} color={theme.palette.error.main}/>
				}/>
				<InfoItem title={<span>Application information</span>} content={appInfo} error={this.state.appInfoError} icon={
					<Icon style={{paddingRight: 8}} path={mdiApplication} size={1} color={theme.palette.info.main}/>
				}/>
				<InfoItem title={<span>System information</span>} content={sysInfo} error={this.state.systemInfoError} icon={
					<Icon style={{paddingRight: 8}} path={mdiMemory} size={1} color={theme.palette.secondary.main}/>
				}/>
			</div>
		);
	}
}
const mapStateToProps = state => ({
	isAdmin: state.auth.isAdmin,
	isLoggedIn: state.auth.isLoggedIn,
	headers: state.auth.headers,
	appInfo: state.info.appInfo,
	appInfoError: state.errors[GET_INFO_APP],
	systemInfo: state.info.systemInfo,
	systemInfoError: state.errors[GET_INFO_SYS],
	error: state.info.error,
	errorLoad: state.loading[GET_INFO_ERROR]
});
const mapDispatchToProps = ({
	getInfoApp,
	getInfoSystem,
	getInfoError
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(Info)));
