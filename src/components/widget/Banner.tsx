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

interface BannerProps {
	open: boolean;
	label?: any | null;
}

const Banner: React.FC<BannerProps> = ({open, label}: BannerProps) => {
	return open ?
		<Alert intent={"danger"} title={(label?.toString()) || "No information could be provided"}
		       style={{marginBottom: 32, borderRadius: 8}}/>
		:
		<div/>
};

export default Banner;
