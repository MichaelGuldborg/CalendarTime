import {Button} from "@material-ui/core";
import React from "react";


export interface ActionButtonProps {
    text?: string;
    icon?: React.ElementType,
    onClick?: VoidFunction;
}

export const ActionButton: React.FC<ActionButtonProps> = ({children, text, icon: Icon, onClick}) => {
    return (
        <Button
            variant="contained"
            color='primary'
            style={{height: 54}}
            onClick={onClick}
        >
            <span>{text || children}</span>
            {Icon && <Icon style={{
                width: 24,
                height: 24,
                minWidth: 16,
                marginLeft: 8,
            }}/>}
        </Button>
    )
}