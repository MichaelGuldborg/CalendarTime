import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(2),
        display: 'flex',
    },
    title: {
        fontSize: 16,
        fontWeight: 600,
        marginRight: 16,
        minWidth: 160,
        display:'flex',
        alignItems: 'center',
    }
}))

export interface InputRowProps {
    title?: string;
}

export const InputRow: React.FC<InputRowProps> = ({title,children}) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <span className={classes.title}>{title}</span>
            {children}
        </div>
    )
}
export default InputRow;