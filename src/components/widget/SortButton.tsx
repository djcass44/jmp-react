import IconButton from "@material-ui/core/IconButton";
import React from "react";
import {Menu} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import SortIcon from "@material-ui/icons/Sort";
import CheckIcon from "@material-ui/icons/Check";

interface Sort {
	id: string,
	value: string
}

export const SortButton = ({selectedSort, sorts, onSubmit}: {selectedSort: string, sorts: Array<Sort>, onSubmit: Function}) => {
	const [anchorEl, setAnchorEl] = React.useState<any>(null);

	const handleClick = (e: any) => {
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSubmit = (id: string) => {
		onSubmit(id);
		handleClose();
	};

	const items = sorts.map(s => {
		return (
			<MenuItem onClick={() => handleSubmit(s.id)} component="li" button key={s.id} value={s.id}>
				{s.id === selectedSort ? <CheckIcon/> : ""}
				{s.value}
			</MenuItem>
		);
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
export default SortButton;
