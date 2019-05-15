import {combineReducers} from "redux";
import auth from "./Auth";
import loading from "./Loading";
import errors from "./Errors";

const main = combineReducers({
	auth,
	loading,
	errors
});
export default main;