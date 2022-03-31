import React from 'react';
import RequestFeedback from "../../models/ResponseFeedback";
import {Button} from "@mui/material";
import {Alert} from "@mui/lab";

export interface FeedbackDisplayProps {
    error?: string;
    onDismiss: () => void;
    feedback?: RequestFeedback;
    action?: JSX.Element
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({error, onDismiss, feedback, action}) => {
    if (feedback === undefined && error !== undefined && error.length > 0) {
        feedback = {
            severity: 'warning',
            message: error,
        }
    }

    if (action === undefined && onDismiss !== undefined) {
        action = <Button onClick={onDismiss}>OK</Button>
    }


    return (
        <React.Fragment>
            {feedback && (
                <Alert
                    severity={feedback?.severity}
                    action={action}
                >
                    {feedback?.message}
                </Alert>
            )}
        </React.Fragment>
    );
};


export default FeedbackDisplay;
