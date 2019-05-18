import React from "react";
import Typography from "@material-ui/core/es/Typography/Typography";
import Center from "react-center";
import {withStyles} from "@material-ui/core";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import BackIcon from "@material-ui/icons/ArrowBack";
import HomeIcon from "@material-ui/icons/Home";
import {Link} from "react-router-dom";

const styles = theme => ({
	title: {
		fontSize: 148,
		fontWeight: 200,
		color: "#454545"
	}
});

class NotFound extends React.Component {
	render() {
		const {classes} = this.props;
		return <div>
			<div>
				<Center><h1 className={classes.title}>404</h1></Center>
				<Center><Typography style={{textAlign: "center"}} variant={"headline"}>The page you're looking for doesn't exist or the server refused to disclose it.</Typography></Center>
				<Center>
					<IconButton color={"secondary"} href={"javascript:window.history.back()"} aria-label={"Go back"}>
						<BackIcon/>
					</IconButton>
					<IconButton component={Link} to={"/"} color={"primary"} aria-label={"Return to home"}>
						<HomeIcon/>
					</IconButton>
				</Center>
			</div>
		</div>
	}
}
export default withStyles(styles)(NotFound);