import React from "react";
import {withStyles} from "@material-ui/core";

const styles = theme => ({
	https: {color: '#36B37E'},
	http: {
		color: '#FF5630',
		textDecorationLine: 'line-through'
	}
});

class SchemeHighlight extends React.Component {
	render() {
		// This can likely be done in a much better way
		const {classes} = this.props;
		const split = this.props.text.split("://");
		const type = split[0];
		const domain = split[1];
		let highlighted;
		if(type === "https")
			highlighted = <span className={classes.https}>https://</span>;
		else
			highlighted = <span className={classes.http}>http://</span>;
		return (<span>{highlighted}{domain}</span>)
	}
}
export default withStyles(styles)(SchemeHighlight);