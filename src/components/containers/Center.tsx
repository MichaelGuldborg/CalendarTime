import React from "react";
import {Box} from "@mui/material";


const Center: React.FC = ({children}) => {
    return (
        <Box sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {children}
        </Box>
    )
}

export default Center;