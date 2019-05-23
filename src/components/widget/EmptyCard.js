import React from "react";
import Avatar from "@material-ui/core/es/Avatar";
import ListItemText from "@material-ui/core/es/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import {SentimentDissatisfied} from "@material-ui/icons";

class EmptyCard extends React.Component {
	render() {
		return (
			<ListItem key={"null"}>
				<Avatar>
					<SentimentDissatisfied color={"error"}/>
				</Avatar>
				<ListItemText primary={"Nothing could be found."}/>
			</ListItem>
		)
	}
}
export default EmptyCard;