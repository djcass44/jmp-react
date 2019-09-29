import {TextField} from "@material-ui/core";
import React from "react";

export default ({data, setData, invalidLabel = "Invalid", fieldProps}) => {
	const onChange = (e) => {
		const {value} = e.target;
		const error = data.regex.test(value) === true ? "" : invalidLabel;
		setData({...data, value, error});
	};
	return (
		<TextField
			value={data.value}
			error={data.error.length !== 0}
			helperText={data.error}
			onChange={(e) => onChange(e)}
			{...fieldProps}
		/>
	);
}