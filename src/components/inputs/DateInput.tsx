import makeStyles from "@material-ui/core/styles/makeStyles";
import PopoverDatePicker from "./PopoverDatePicker";
import {toLocalDate, toLocalTime} from "../../functions/dateFormat";
import ArrowDownIcon from "remixicon-react/ArrowDownSLineIcon";
import React from "react";
import {DatePickerProps} from "@material-ui/pickers";


const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        minWidth: 160,
        textAlign: "center",
        padding: theme.spacing(0, 0, 0, 2),
        marginLeft: 16,
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
                <div style={{width: 8}}/>
                <ArrowDownIcon/>
            </div>
        </PopoverDatePicker>
    )
}

export default DateInput;