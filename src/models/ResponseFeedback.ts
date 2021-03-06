import RequestSeverity from "./RequestSeverity";

export interface RequestFeedback {
    severity: RequestSeverity;
    errorCode?: string;
    message: string;
    stacktrace?: string;
}

export default RequestFeedback;