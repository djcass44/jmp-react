import IconButton from "@material-ui/core/IconButton";
import React from "react";
import {Menu, Tooltip} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import SortIcon from "@material-ui/icons/Sort";
import CheckIcon from "@material-ui/icons/Check";

interface Sort {
	id: string,
	value: string
}

interface SortButtonProps {
	selectedSort: string;
	sorts: Array<Sort>;
	onSubmit: Function;
}

const SortButton: React.FC<SortButtonProps> = ({selectedSort, sorts, onSubmit}: SortButtonProps) => {
	const [anchorEl, setAnchorEl] = React.useState<any>(null);

	const handleSubmit = (id: string) => {
		onSubmit(id);
		setAnchorEl(null);
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
			<Tooltip title="Sort">
				<IconButton aria-owns={anchorEl ? "simple-menu" : undefined} aria-haspopup="true"
				            onClick={(e) => setAnchorEl(e.currentTarget)} centerRipple={false} aria-label="Sort">
					<SortIcon fontSize="small"/>
				</IconButton>
			</Tooltip>
			<Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
				{items}
			</Menu>
		</span>
	)
};
export default SortButton;
