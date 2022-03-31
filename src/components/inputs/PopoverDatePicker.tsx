import React from "react";
import {DatePicker, DatePickerProps} from "@mui/lab";
import {Popover, TextField} from "@mui/material";

type PopoverDatePickerProps = Omit<DatePickerProps, "renderInput"> & {
    children: JSX.Element;
}

export const PopoverDatePicker: React.FC<PopoverDatePickerProps> = (
    {
        children,
        onChange,
        ...rest
    }
) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange: DatePickerProps["onChange"] = date => {
        onChange(date);
        handleClose();
    }

    return (
        <React.Fragment>
            {React.cloneElement(children, {onClick: handleClick})}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
            >
                <DatePicker
                    {...rest}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Popover>
        </React.Fragment>
    )
}

export default PopoverDatePicker
