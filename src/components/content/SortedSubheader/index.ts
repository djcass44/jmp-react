import {setSort} from "../../../actions/Generic";
import SortedSubheader from "./SortedSubheader";
import {connect} from "react-redux";

const mapStateToProps = (state: any) => ({
	searchFilter: state.generic.searchFilter,
	sort: state.generic.sort,
});
const mapDispatchToProps = ({
	setSort
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SortedSubheader);
