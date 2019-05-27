import React from "react";
import {connect} from "react-redux";
import {withStyles, withTheme} from "@material-ui/core";
import InfoItem from "../../../components/content/settings/InfoItem";
import {
	GET_INFO_APP,
	GET_INFO_STAT,
	GET_INFO_SYS,
	getInfoApp,
	getInfoHealth,
	getInfoSystem
} from "../../../actions/Info";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";

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
	grow: {flexGrow: 1}
});

class Info extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: '',
			status: {
				headers: props.headers,
				isAdmin: props.isAdmin,
				isLoggedIn: props.isLoggedIn
			}
		};
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}
	componentDidMount() {
		this.props.getInfoApp(this.state.headers);
		this.props.getInfoSystem(this.state.headers);
		this.props.getInfoHealth(this.state.headers);
	}

	render() {
		const {classes} = this.props;
		const status = (
			<div>
				{this.state.statusLoad === true ? <LinearProgress/> : ""}
				<p>HTTP Server... {this.state.status.http === "OK" ? <span className={classes.statusOK}>Ok</span> : <span className={classes.statusFail}>Error</span>}</p>
				<p>Database... {this.state.status['database'] === true ? <span className={classes.statusOK}>Ok</span> : <span className={classes.statusFail}>Error</span>}</p>
				<p>LDAP... {this.state.status['ldap'] === true ? <span className={classes.statusOK}>Ok</span> : this.state.status['ldap'] == null ? <span className={classes.statusWarn}>Disabled</span> : <span className={classes.statusFail}>Error</span>}</p>
			</div>
		);
		return (
			<div>
				<InfoItem title={"Application health"} content={status} open={true}/>
				<InfoItem title={"Application information"} content={JSON.stringify(this.state.appInfo)} error={this.state.appInfoError}/>
				<InfoItem title={"System information"} content={JSON.stringify(this.state.systemInfo)} error={this.state.systemInfoError}/>
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
	status: state.info.status,
	statusCheck: state.info.statusCheck || null,
	statusLoad: state.loading[GET_INFO_STAT]
});
const mapDispatchToProps = ({
	getInfoApp,
	getInfoSystem,
	getInfoHealth
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(Info)));