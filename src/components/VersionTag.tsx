import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import config from "../constants/config";

const useStyles = makeStyles(theme => ({
    root: {
        position: "absolute",
        bottom: 8,
        right: 16,
        color: theme.palette.info.contrastText
    }
}))

export const VersionTag: React.FC = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <span>v{config.version} {config.API_ENV}</span>
        </div>
    )
};

export default VersionTag;
