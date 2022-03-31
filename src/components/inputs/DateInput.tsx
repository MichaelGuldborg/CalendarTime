import React from "react";
import {DatePicker, DatePickerProps} from "@mui/lab";
import {TextField} from "@mui/material";


export const DateInput: React.FC<{ value: Date, onChange: DatePickerProps['onChange'] }> = ({value, onChange}) => {
    return (
        <DatePicker
            value={value}
            onChange={onChange}
            renderInput={(props) => {
                return <TextField {...props}/>
            }}
        />
    )
}

export default DateInput;