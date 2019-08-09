/*
 *    Copyright 2019 Django Cass
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

import * as React from "react";
import {Button, makeStyles} from "@material-ui/core";
import Icon from "@mdi/react";
import {BASE_URL} from "../../constants";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
	title: {fontFamily: "Manrope", fontWeight: 500},
}));

export const SocialButton = props => {
	const classes = useStyles();
	return (<Button href={`${BASE_URL}/api/v2/oauth2/authorise?provider=${props.id}`} className={classes.title} style={{color: props.colour, margin: 4}}>
		<Icon path={props.icon} size={1} color={props.colour}/>{props.name}
	</Button>);
};
SocialButton.propTypes = {
	icon: PropTypes.string.isRequired,
	colour: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired
};
export default SocialButton;