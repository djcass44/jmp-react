import IconButton from "@material-ui/core/IconButton";
import React from "react";
import {Menu} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import SortIcon from "@material-ui/icons/Sort";
import CheckIcon from "@material-ui/icons/Check";
import PropTypes from "prop-types";

export const SortButton = props => {
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = e => {
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSubmit = (e, value) => {
		props.onSubmit(e, value);
		handleClose();
	};

	const items = props.sorts.map(s => {
		return <MenuItem onClick={(e) => {handleSubmit(e, s.id)}} component={'li'} button={true} key={s.id} value={s.id}>
			{s.id === props.selectedSort ? <CheckIcon/> : ""}
			{s.value}
		</MenuItem>
	});

	return (
		<span>
			<IconButton aria-owns={anchorEl ? 'simple-menu' : undefined} aria-haspopup="true" onClick={handleClick} centerRipple={false} aria-label="Sort">
				<SortIcon fontSize={"small"}/>
			</IconButton>
			<Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
				{items}
			</Menu>
		</span>
	)
};
SortButton.propTypes = {
	selectedSort: PropTypes.string.isRequired,
	onSubmit: PropTypes.func.isRequired,
	sorts: PropTypes.array.isRequired
};
export default SortButton;
