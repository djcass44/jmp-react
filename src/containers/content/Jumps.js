import React from "react";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/es/ListSubheader/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/es/Avatar/Avatar";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import {JUMP_LOAD, listJumps, rmJump} from "../../actions/Jumps";
import {connect} from "react-redux";
import Paper from "@material-ui/core/Paper";
import Pagination from "material-ui-flat-pagination";
import Center from "react-center";
import {withStyles} from "@material-ui/core";
import {LS_HEADERS} from "../../constants";
import EmptyCard from "../../components/widget/EmptyCard";

const styles = theme => ({
	title: {fontFamily: "Manrope"}
});

class Jumps extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			jumps: [],
			pageSize: 10,
			headers: JSON.parse(localStorage.getItem(LS_HEADERS)) || {},
		};
	}
	componentDidMount() {
		// Load jumps from the API
		this.props.listJumps(this.state.refresh, this.state.headers);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		console.log(nextProps.jumps);
		this.setState({...nextProps});
	}

	render() {
		const {classes} = this.props;
		let listItems = [];
		this.state.jumps.forEach((i, index) => {
			listItems.push((
				<ListItem button disableRipple key={index}>
					<Avatar src={i.image}/>
					<ListItemText primary={i.name} secondary={i.location}/>
				</ListItem>
			));
		});

		return (
			<div>
				<ListSubheader className={classes.title} inset component={"div"}>Jumps {this.state.searchFilter}</ListSubheader>
				<Paper style={{borderRadius: 12, marginBottom: 8}}>
					<List>
						{listItems.length > 0 ? listItems : <EmptyCard/>}
					</List>
				</Paper>
				{this.state.jumps.length > this.state.pageSize ?
					<Center><Pagination limit={this.state.pageSize} offset={0} total={this.state.jumps.length} nextPageLabel={"▶"} previousPageLabel={"◀"}/></Center>
					:
					<div/>
				}
			</div>
		)
	}
}
const mapStateToProps = state => ({
	jumps: state.jumps.jumps,
	loading: state.loading[JUMP_LOAD],
	headers: state.auth.headers,
	searchFilter: state.generic.searchFilter
});
const mapDispatchToProps = ({
	listJumps,
	rmJump
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Jumps));