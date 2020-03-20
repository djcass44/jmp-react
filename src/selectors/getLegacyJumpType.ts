import {Jump} from "../types";

export default (jump: Jump) => {
	if (jump.public)
		return 0;
	else if (jump.owner != null)
		return 1;
	else return 2;
}