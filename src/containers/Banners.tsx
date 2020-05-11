/*
 *    Copyright 2020 Django Cass
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 */

import {Alert} from "@material-ui/lab";
import React from "react";
import {useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {TState} from "../store/reducers";
import {SimpleMap} from "../types";
import {ErrorState} from "../config/types/Feedback";

const useStyles = makeStyles(() => ({
	root: {
		position: "fixed",
		width: "100%",
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "transparent"
	}
}));

/**
 * This component is still in incubation
 */
const Banners: React.FC = () => {
	const classes = useStyles();

	const {errors} = useSelector<TState, TState>(state => state);
	return (
		<div className={classes.root}>
			{Object.entries(errors as SimpleMap<ErrorState>).map(([k, v]) => v &&
				<Alert severity="error">{k}: {v?.message}</Alert>)}
		</div>
	);
};
export default Banners;
