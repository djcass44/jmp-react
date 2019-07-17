import React from "react";
import Typography from "@material-ui/core/Typography";
import Center from "react-center";
import {withTheme, withStyles, Paper} from "@material-ui/core";
import Info from "./settings/Info";
import BackButton from "../../components/widget/BackButton";
import General from "./settings/General";
import Auth from "./settings/Auth";
import {connect} from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@mdi/react";
import {mdiSettingsOutline} from "@mdi/js";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
	name: {fontFamily: "Manrope", fontWeight: 500, color: theme.palette.secondary.main},
	button: {
		// margin: theme.spacing.unit,
	},
	grow: {flexGrow: 1},
	avatar: {
		backgroundColor: '#FAFAFA',
		width: 56,
		height: 56,
		borderRadius: 100,
		margin: 24,
		padding: 6
	},
});

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isAdmin: props.isAdmin,
			isLoggedIn: props.isLoggedIn
		};
	}
	componentDidMount() {
		window.document.title = `Settings - ${process.env.REACT_APP_APP_NAME}`;
	}
	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}
	render() {
		const {classes, theme} = this.props;
		return (
			<div>
				<Center>
					<Avatar className={classes.avatar} component={Paper}><Icon path={mdiSettingsOutline} size={2} color={theme.palette.primary.main}/></Avatar>
				</Center>
				<Center>
					<Typography variant={"h4"} className={classes.name}>Settings</Typography>
				</Center>
				<General/>
				{this.state.isAdmin === true ?
					<div>
						<Auth/>
						<Info/>
					</div>
					:
					""
				}
			</div>
		)
	}
}
const mapStateToProps = state => ({
	isAdmin: state.auth.isAdmin,
	isLoggedIn: state.auth.isLoggedIn
});
export default connect(mapStateToProps, null)(withStyles(styles)(withTheme(Settings)));
