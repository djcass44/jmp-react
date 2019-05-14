import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

class Nav extends React.Component {
	render() {
		return <div>
			<AppBar position={"static"} color={"default"}>
				<Toolbar>
					<Typography variant={"h6"} color={"inherit"}>
						JMP
					</Typography>
				</Toolbar>
			</AppBar>
		</div>
	}
}
export default Nav;