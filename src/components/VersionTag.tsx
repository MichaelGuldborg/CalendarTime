import React from "react";
import config from "../constants/config";
import {Box} from "@mui/material";


export const VersionTag: React.FC = () => {
    return (
        <Box sx={{
            position: "absolute",
            bottom: 8,
            right: 16,
            color: 'white',
        }}>
            <span>v{config.version} {config.API_ENV}</span>
        </Box>
    )
};

export default VersionTag;
