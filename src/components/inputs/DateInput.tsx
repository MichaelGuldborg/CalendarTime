import PopoverDatePicker from "./PopoverDatePicker";
import {toLocalDate} from "../../functions/dateFormat";
import CalendarIcon from "remixicon-react/CalendarLineIcon";
import React from "react";
import {DatePickerProps} from "@mui/lab";
import {Box} from "@mui/material";


export const DateInput: React.FC<{ value: Date, onChange: DatePickerProps['onChange'] }> = ({value, onChange}) => {
    return (
        // @ts-ignore
        <PopoverDatePicker value={value} onChange={onChange}>
            <Box sx={(theme) => ({
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
                width: '100%',
                height: 54,
                minWidth: 180,
                textAlign: "center",
                padding: theme.spacing(0, 2, 0, 2),
                cursor: "pointer",
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: 4,
            })}>
                {toLocalDate(value)}
                <div style={{flex: 1}}/>
                <CalendarIcon/>
            </Box>
        </PopoverDatePicker>
    )
}

export default DateInput;