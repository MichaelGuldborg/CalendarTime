import React, {CSSProperties, useState} from 'react';
import ConfirmDialog from "../dialogs/ConfirmDialog";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from 'remixicon-react/DeleteBinLineIcon'
import {RemixiconReactIconComponentType} from "remixicon-react";

export interface DeleteButtonProps {
    title?: string;
    message?: string;
    onConfirm: () => void;
    icon?: RemixiconReactIconComponentType;
    style?: CSSProperties;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({title = "Delete", message, onConfirm, icon: Icon,style}) => {
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const handleClick = () => setShowDialog(true);
    const handleClose = () => setShowDialog(false);
    const handleConfirm = () => {
        setShowDialog(false);
        onConfirm && onConfirm();
    };

    return (
        <div style={style}>
            <Tooltip title={title}>
                <IconButton onClick={handleClick}>
                    {Icon ? <Icon/> : <DeleteIcon/>}
                </IconButton>
            </Tooltip>
            <ConfirmDialog title={title} open={showDialog} onClose={handleClose} onConfirm={handleConfirm}>
                {message}
            </ConfirmDialog>
        </div>
    )
}

export default DeleteButton;