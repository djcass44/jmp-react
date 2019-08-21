import {ListSubheader} from "@material-ui/core";
import * as React from "react";
import SortButton from "../../widget/SortButton";
import {Sort} from "../../../misc/Sort";

export default ({title, searchFilter, size, sort, sorts, setSort}: {title: string, searchFilter: string | null, size: number, sort: string, sorts: Array<Sort>, setSort: Function}) => {
	return (
		<ListSubheader inset component="div">
			{title} {searchFilter != null && searchFilter.length > 0 ? `(${size} results)` : ""}
			<SortButton selectedSort={sort} sorts={sorts} onSubmit={(e: string) => setSort(e)}/>
		</ListSubheader>
	)
}