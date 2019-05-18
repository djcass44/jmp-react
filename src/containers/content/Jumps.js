import React from "react";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/es/ListSubheader/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/es/Avatar/Avatar";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import {createLoadingSelector} from "../../reducers/Tools";
import {JUMP_LOAD, listJumps, rmJump} from "../../actions/Jumps";
import {connect} from "react-redux";
import Paper from "@material-ui/core/Paper";
import Pagination from "material-ui-flat-pagination";
import Center from "react-center"; // yeah yeah, I know

class Jumps extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			jumps: [
				{
					name: 'Google',
					location: "https://google.com"
				},
				{
					name: 'Reddit',
					location: "https://reddit.com"
				}
			],
			pageSize: 10
		};
	}
	componentDidMount() {
		this.props.listJumps(this.state.headers);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		console.log(nextProps.jumps.jumps);
		this.setState({jumps: nextProps.jumps.jumps});
	}

	render() {
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
				<ListSubheader inset component={"div"}>Jumps</ListSubheader>
				<Paper style={{borderRadius: 12, marginBottom: 8}}>
					<List>
						{listItems}
					</List>
				</Paper>
				{this.state.jumps.length > this.state.pageSize ?
					<Center><Pagination limit={this.state.pageSize} offset={0} total={this.state.jumps.length} nextPageLabel={"▶"} previousPageLabel={"◀"}/></Center>
					:
					<div/>}
			</div>
		)
	}
}
const loadingSelector = createLoadingSelector([JUMP_LOAD]);

const mapStateToProps = state => ({
	jumps: state.jumps,
	loading: loadingSelector(state),
	headers: state.headers
});
const mapDispatchToProps = ({
	listJumps,
	rmJump
});

export default connect(mapStateToProps, mapDispatchToProps)(Jumps);