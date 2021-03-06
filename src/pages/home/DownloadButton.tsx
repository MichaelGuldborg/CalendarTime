import Button from "@material-ui/core/Button";
import {jsPDF} from "jspdf";
import {toHourMinuteText, toLocalDate, toLocalTime} from "../../functions/dateFormat";
import React from "react";
import GoogleCalendarEvent from "../../models/GoogleCalendarEvent";
import FileDownloadIcon from 'remixicon-react/FileDownloadLineIcon'

export type DownloadFormat = 'csv' | 'pdf' | 'html';

export interface DownloadButtonProps {
    events: GoogleCalendarEvent[];
    totalDuration: number;
    filename?: string;
    format: DownloadFormat;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({events, totalDuration, format, filename,}) => {

    const handleDownloadClick = () => {
        if (format === 'csv') {
            return downloadCSV();
        } else if (format === "pdf") {
            return downloadPDF()
        } else {
            return downloadHTML();
        }
    }

    const downloadCSV = () => {

    }

    const downloadPDF = () => {
        const doc = new jsPDF({
            orientation: 'p',
        });
        const yOffset = 10;
        events.forEach((e, index) => {
            doc.text(toLocalDate(e.start.dateTime), 20, 20 + yOffset * index)
            doc.text(toLocalTime(e.start.dateTime), 80, 20 + yOffset * index)
            doc.text(toLocalTime(e.end.dateTime), 100, 20 + yOffset * index)
            doc.text(toHourMinuteText(e.duration), 130, 20 + yOffset * index)
        })
        doc.text('Total', 20, 20 + yOffset * events.length)
        doc.text(toHourMinuteText(totalDuration), 130, 20 + yOffset * events.length)
        doc.save(filename + '.pdf');
    }

    const downloadHTML = () => {

    }


    return (
        <Button
            variant="outlined"
            style={{height: 58}}
            onClick={handleDownloadClick}
        >
            <span style={{marginRight: 8}}>DOWNLOAD</span>
            <FileDownloadIcon/>
        </Button>
    );
}
export default DownloadButton;