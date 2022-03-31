import React from "react";
import {Box} from "@mui/material";

export interface InputRowProps {
    title?: string;
}

export const InputRow: React.FC<InputRowProps> = ({title, children}) => {
    return (
        <Box sx={(theme) => ({
            marginBottom: theme.spacing(2),
            display: 'flex',
        })}>
            <Box sx={{
                fontSize: 16,
                fontWeight: 600,
                marginRight: 16,
                minWidth: 160,
                display: 'flex',
                alignItems: 'center',
            }}>{title}</Box>
            {children}
        </Box>
    )
}
export default InputRow;