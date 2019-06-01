import IconButton from "@material-ui/core/IconButton";
import React from "react";
import {Menu} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import SortIcon from "@material-ui/icons/Sort";
import CheckIcon from "@material-ui/icons/Check";

function SortButton(props) {
	const [anchorEl, setAnchorEl] = React.useState(null);

	function handleClick(event) {
		setAnchorEl(event.currentTarget);
	}

	function handleClose() {
		setAnchorEl(null);
	}
	function handleSubmit(e, value) {
		if(typeof props.onSubmit === 'function') {
			props.onSubmit(e, value);
			handleClose();
		}
	}

	const items = props.sorts.map(s => {
		return <MenuItem onClick={(e) => {handleSubmit(e, s.id)}} component={'li'} button={true} key={s.id} value={s.id}>
			{s.id === props.selectedSort ? <CheckIcon/> : ""}
			{s.value}
		</MenuItem>
	});

	return (
		<span>
			<IconButton aria-owns={anchorEl ? 'simple-menu' : undefined} aria-haspopup="true" onClick={handleClick} centerRipple={false} aria-label="Sort"><SortIcon fontSize={"small"}/></IconButton>
			<Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
				{items}
			</Menu>
		</span>
	)
}
export default SortButton;