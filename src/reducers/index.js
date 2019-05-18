import {combineReducers} from "redux";
import auth from "./Auth";
import loading from "./Loading";
import errors from "./Errors";
import jumps from "./Jumps";

const main = combineReducers({
	auth,
	loading,
	errors,
	jumps
});
export default main;