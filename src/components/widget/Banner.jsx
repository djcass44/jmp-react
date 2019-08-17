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

import React from "react";
import {Alert} from "evergreen-ui";
import PropTypes from "prop-types";

// THIS CLASS CANNOT BE CONVERTED TO TYPESCRIPT UNTIL EVERGREEN-UI HAS TYPE DEFINITIONS

const Banner = ({open, label}) => {
	return open === true ?
			<Alert intent={"danger"} title={label && label.toString() || "No information could be provided"} style={{marginBottom: 32, borderRadius: 8}} />
			:
			<div/>
};
Banner.propTypes = {
	open: PropTypes.bool.isRequired,
	label: PropTypes.object
};
Banner.defaultProps = {
	label: null
};
export default Banner;