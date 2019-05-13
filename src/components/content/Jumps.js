import React from "react";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/es/ListSubheader/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/es/Avatar/Avatar";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";

class Jumps extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [
				{
					name: 'Google',
					location: "https://google.com"
				},
				{
					name: 'Reddit',
					location: "https://reddit.com"
				}
			]
		};
	}
	render() {
		let listItems = [];
		this.state.items.forEach((i, index) => {
			listItems.push((
				<ListItem button disableRipple key={index}>
					<Avatar/>
					<ListItemText primary={i.name} secondary={i.location}/>
				</ListItem>
			));
		});

		return (
			<List subheader={<ListSubheader inset component={"div"}>Jumps</ListSubheader> }>
				{listItems}
			</List>
		)
	}
}
export default Jumps;