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
import Card from "@material-ui/core/es/Card/Card";
import Avatar from "@material-ui/core/es/Avatar/Avatar";
import ListItemText from "@material-ui/core/es/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/es/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/ClearOutlined";

class Banner extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: true
		};
	}

	render() {
		return <Card style={{borderRadius: 12, marginBottom: 8}}>
			{this.props.open === true && this.state.visible === true ?
				<ListItem key={this.props.label}>
					<Avatar style={this.props.avatarStyle}>
						{this.props.icon}
					</Avatar>
					<ListItemText primary={<span>{this.props.label}</span>}/>
					{this.props.showDismissButton === true ?
						<ListItemSecondaryAction>
							<IconButton size={'small'} onClick={() => this.setState({visible: false})}>
								<ClearIcon/>
							</IconButton>
						</ListItemSecondaryAction>
						:
						""
					}
				</ListItem>
				:
				<div/>
			}
		</Card>
	}
}
export default Banner;