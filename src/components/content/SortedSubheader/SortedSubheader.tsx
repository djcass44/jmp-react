import {IconButton, ListSubheader, makeStyles, Tooltip} from "@material-ui/core";
import * as React from "react";
import SortButton from "../../widget/SortButton";
import {Sort} from "../../../misc/Sort";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles(() => ({
	root: {
		fontFamily: "Manrope",
		fontWeight: 500,
		margin: 8
	}
}));

interface SortedSubheaderProps {
	title: string;
	searchFilter?: string;
	size: number;
	sort: string;
	sorts: Array<Sort>;
	setSort: Function;
	onAdd?: Function;
}

const SortedSubheader: React.FC<SortedSubheaderProps> = ({title, searchFilter, size, sort, sorts, setSort, onAdd}: SortedSubheaderProps) => {
	const classes = useStyles();
	return (
		<ListSubheader className={classes.root} inset component="div">
			{title} {searchFilter != null && searchFilter.length > 0 && `(${size} results)`}
			<SortButton selectedSort={sort} sorts={sorts} onSubmit={(e: string) => setSort(e)}/>
			{onAdd != null && <Tooltip title="Add">
				<IconButton centerRipple={false} aria-label="Add" onClick={() => onAdd()}>
					<AddIcon fontSize="small"/>
				</IconButton>
			</Tooltip>}
		</ListSubheader>
	);
};
export default SortedSubheader;
