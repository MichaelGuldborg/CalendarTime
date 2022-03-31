import React from "react";
import {Box} from "@mui/material";

const BasePage: React.FC = ({children,}) => {
    return (
        <Box sx={(theme) => ({
            flex: 1,
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: "column",
            justifyContent: 'flex-start',
            alignItems: "start",
            position: 'relative',
            padding: theme.spacing(0, 2, 2, 2),
            [theme.breakpoints.down("sm")]: {
                justifyContent: 'center',
                paddingTop: theme.spacing(2),
            }
        })}>
            {children}
        </Box>
    );
}

export default BasePage;

