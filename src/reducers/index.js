import {combineReducers} from "redux";
import auth from "./Auth";
import loading from "./Loading";
import errors from "./Errors";
import jumps from "./Jumps";
import generic from "./Generic";

const main = combineReducers({
	auth,
	loading,
	errors,
	jumps,
	generic
});
export default main;