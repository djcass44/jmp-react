import React, {useRef} from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import {fade} from "@material-ui/core/styles/colorManipulator";
import InputBase from "@material-ui/core/InputBase";
import {IconButton, withStyles} from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import Divider from "@material-ui/core/es/Divider/Divider";
import {setFilter} from "../actions/Generic";

const styles = theme => ({
	root: {width: '100%'},
	grow: {flexGrow: 1},
	title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block'
		},
		fontFamily: "Manrope"
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.primary.light, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.primary.main, 0.25),
		},
		marginRight: theme.spacing.unit * 2,
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing.unit * 3,
			width: 'auto',
		},
	},
	searchIcon: {
		width: theme.spacing.unit * 9,
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'inherit',
		width: '100%',
	},
	inputInput: {
		paddingTop: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
		paddingLeft: theme.spacing.unit * 10,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: 200,
		},
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
});

class Nav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			anchorEl: null,
			searchRoutes: ["/", "/users"],
			showSearch: true,
			searchFilter: '',
			username: 'Anonymous',
			isLoggedIn: false
		};
	}

	componentWillReceiveProps(nextProps, nextContext) {
		console.log(`username: ${nextProps.username}`);
		this.setState({username: nextProps.username});
		this.setState({isLoggedIn: nextProps.isLoggedIn});
	}

	componentWillMount() {
		this.unlisten = this.props.history.listen(() => {
			let search = this.state.searchRoutes.includes(window.location.pathname);
			this.setState({showSearch: search});
		});
	}

	componentWillUnmount() {
		this.unlisten();
	}

	handleProfileMenuOpen = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleMenuClose = () => {
		this.setState({ anchorEl: null });
	};

	handleSearchChange = e => {
		this.setState({searchFilter: e.target.value});
		this.props.setFilter(e.target.value);
	};

	render() {
		const {anchorEl} = this.state;
		const {classes} = this.props;
		const isMenuOpen = Boolean(anchorEl);

		return <div className={classes.root}>
			<AppBar position={"static"} color={"default"}>
				<Toolbar>
					<Typography className={classes.title} variant={"h6"} color={"inherit"}>
						JMP
					</Typography>
					{/*<Typography className={classes.title} style={{fontWeight: 300}} variant={"h6"} color={"inherit"}>*/}
					{/*	{process.env.REACT_APP_APP_MSG}*/}
					{/*</Typography>*/}
					{this.state.showSearch === true ?
						<div className={classes.search}>
							<div className={classes.searchIcon}>
								<SearchIcon/>
							</div>
							<InputBase placeholder={"Search..."} classes={{root: classes.inputRoot, input: classes.inputInput}} onChange={this.handleSearchChange} value={this.state.searchFilter}/>
						</div>
						:
						<div/>
					}
					<div className={classes.grow}/>
					<div className={classes.sectionDesktop}>
						<IconButton color={"inherit"} onClick={this.handleProfileMenuOpen} aria-haspopup="true" aria-owns={isMenuOpen ? 'material-appbar' : undefined}>
							<AccountCircle/>
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMenuOpen}
				onClose={this.handleMenuClose}>
				<MenuItem disabled={true}>
					<div>
						{/*<Avatar />*/}
						<span>{this.state.username}</span>
					</div>
				</MenuItem>
				<Divider/>
				<MenuItem component={Link} onClick={this.handleMenuClose} to={"/users"}>Users &amp; Groups</MenuItem>
				<MenuItem component={Link} onClick={this.handleMenuClose} to={"/settings"}>Settings</MenuItem>
				{this.state.isLoggedIn === false ?
					<MenuItem component={Link} onClick={this.handleMenuClose} to={"/login"}>Login</MenuItem>
					:
					<MenuItem component={Link} onClick={this.handleMenuClose} to={"/logout"}>Logout</MenuItem>
				}
			</Menu>
		</div>
	}
}
const mapStateToProps = state => ({
	isLoggedIn: state.auth.isLoggedIn,
	isAdmin: state.auth.isAdmin,
	username: state.auth.username
});
const mapDispatchToProps = ({
	setFilter
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Nav)));