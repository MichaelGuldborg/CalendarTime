import makeStyles from "@material-ui/core/styles/makeStyles";
import PopoverDatePicker from "./PopoverDatePicker";
import {toLocalDate} from "../../functions/dateFormat";
import CalendarIcon from "remixicon-react/CalendarLineIcon";
import React from "react";
import {DatePickerProps} from "@material-ui/pickers";


const useStyles = makeStyles((theme) => ({
    root: {
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
    },
}))

export const DateInput: React.FC<{ value: Date, onChange: DatePickerProps['onChange'] }> = ({value, onChange}) => {
    const classes = useStyles();
    return (
        <PopoverDatePicker value={value} onChange={onChange}>
            <div className={classes.root}>
                {toLocalDate(value)}
                <div style={{flex: 1}}/>
                <CalendarIcon/>
            </div>
        </PopoverDatePicker>
    )
}

export default DateInput;