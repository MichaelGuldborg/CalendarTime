import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, useTheme} from '@material-ui/core';

export interface ConfirmDialogProps {
    title: string;
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({title, open, onClose, children, onConfirm}) => {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} style={{color: theme.palette.error.main}}>
                    Cancel
                </Button>
                <Button onClick={onConfirm} style={{color: theme.palette.success.main}} autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog;