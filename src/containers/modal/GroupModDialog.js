import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {CircularProgress, Typography, withStyles, withTheme} from "@material-ui/core";
import List from "@material-ui/core/List";
import {getGroups, GROUP_LOAD} from "../../actions/Groups";
import {connect} from "react-redux";
import {sortItems} from "../../misc/Sort";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Center from "react-center";

const styles = theme => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
});

class GroupModDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			groups: props.groups,
			loading: props.loading,
			headers: props.headers
		};
	}

	componentDidMount() {
		this.props.getGroups(this.state.headers);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({...nextProps});
	}

	handleSubmit(e) {
		if(typeof(this.props.onSubmit) === 'function')
			this.props.onSubmit(e);
		if(typeof(this.props.onExited) === 'function')
			this.props.onExited(e);
	}

	render() {
		const {classes, theme} = this.props;
		let sortedGroups = sortItems(this.state.groups, 'name');
		let listItems = [];
		sortedGroups.forEach(i => {
			listItems.push((
				<ListItem key={i.id} component={'li'} role={undefined} dense button>
					<ListItemIcon>
						<Checkbox edge="start" checked={true} tabIndex={-1} disableRipple/>
					</ListItemIcon>
					<ListItemText id={i.id} primary={i.name}/>
				</ListItem>
			))
		});
		return (
			<Dialog open={this.props.open === true} aria-labelledby={"form-dialog-title"} onClose={this.props.onExited}>
				<DialogTitle id={"form-dialog-title"} className={classes.title}>Modify groups</DialogTitle>
				<DialogContent>
					<Typography variant={"body1"}>
						Here you can modify the groups that {this.props.user != null ? this.props.user.username || 'the user' : 'the user'} is in.
					</Typography>
					{this.state.loading ?
						<CircularProgress/>
						:
						<List component={'ul'}>
							{listItems.length > 0 ? listItems : <Center>There are no groups</Center>}
						</List>
					}
				</DialogContent>
				<DialogActions>
					<Button color={"secondary"} onClick={this.props.onExited}>Cancel</Button>
					<Button style={{color: theme.palette.error.main}} onClick={this.handleSubmit.bind(this)} >Update</Button>
				</DialogActions>
			</Dialog>
		);
	}
}
const mapStateToProps = state => ({
	groups: state.groups.groups || [],
	loading: state.loading[GROUP_LOAD],
	headers: state.auth.headers,
});
const mapDispatchToProps = ({
	getGroups
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(GroupModDialog)));
