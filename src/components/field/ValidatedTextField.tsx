import {TextField} from "@material-ui/core";
import React from "react";
import {ValidatedData} from "../../types";

interface ValidatedTextFieldProps {
	data: ValidatedData;
	setData: Function;
	invalidLabel: string;
	fieldProps: any;
}

const ValidatedTextField: React.FC<ValidatedTextFieldProps> = ({data, setData, invalidLabel = "Invalid", fieldProps}: ValidatedTextFieldProps) => {
	const onChange = (e: any) => {
		const {value} = e.target;
		const error = data.regex.test(value) ? "" : invalidLabel;
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
};
export default ValidatedTextField;
