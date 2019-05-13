import React from "react";
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";
import Card from "@material-ui/core/es/Card/Card";
import {CardContent, Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false
		}
	}
	render() {
		let loader = null;
		if(this.state.loading === true) {
			loader = (<CircularProgress/>)
		}
		else {
			loader = (
				<Card>
					<CardContent>
						<Grid container spacing={24} alignContent={"center"} justify={"center"}>
							<Grid item xs={12}>
								<img src={`${process.env.PUBLIC_URL}/favicon.ico`} alt={"App icon"}/>
								<Typography variant={"h2"} align={"center"}>Login</Typography>
							</Grid>
							<Grid item xs={12}>
								<TextField required fullWidth id="text-username" label="Username" margin="normal" variant="outlined"/>
							</Grid>
							<Grid item xs={12}>
								<TextField required fullWidth id="text-password" label="Password" margin="normal" variant="outlined" type="password"/>
							</Grid>
							<Grid item xs={12}>
								<Button variant={"contained"} color={"primary"} fullWidth size={"large"}>Login</Button>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			)
		}
		return(
			<div>
				{loader}
			</div>
		);
	}

}
export default Login;