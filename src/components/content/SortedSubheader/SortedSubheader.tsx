import {IconButton, ListSubheader, makeStyles} from "@material-ui/core";
import * as React from "react";
import SortButton from "../../widget/SortButton";
import {Sort} from "../../../misc/Sort";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles(() => ({
	title: {
		fontFamily: "Manrope",
		fontWeight: 500
	}
}));

export default ({title, searchFilter, size, sort, sorts, setSort, onAdd}: {title: string, searchFilter?: string, size: number, sort: string, sorts: Array<Sort>, setSort: Function, onAdd?: Function}) => {
	const classes = useStyles();
	return (
		<ListSubheader className={classes.title} inset component="div">
			{title} {searchFilter != null && searchFilter.length > 0 ? `(${size} results)` : ""}
			<SortButton selectedSort={sort} sorts={sorts} onSubmit={(e: string) => setSort(e)}/>
			{onAdd != null ?
				<IconButton centerRipple={false} aria-label="Add" onClick={() => onAdd()}>
					<AddIcon fontSize="small"/>
				</IconButton>
				:
				""
			}
		</ListSubheader>
	)
}