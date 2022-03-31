import React, {useState} from "react";
import ConfirmDialog from "./ConfirmDialog";
import {TextField} from "@mui/material";


export interface TextFieldDialogProps {
    title: string;
    onConfirm: (s: string) => void;
}

export const TextFieldDialog: React.FC<TextFieldDialogProps> = ({title, children, onConfirm}) => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');

    const handleConfirm = () => {
        onConfirm?.(text)
        setOpen(false);
        setText('')
    }

    return (
        <>
            <div onClick={() => setOpen(true)}>
                {children}
            </div>
            <ConfirmDialog
                title={title}
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleConfirm}
            >
                <TextField
                    variant="standard"
                    placeholder={'Template name'}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </ConfirmDialog>
        </>
    )
}
export default TextFieldDialog;