import Button from "@material-ui/core/Button";
import {jsPDF} from "jspdf";
import {toHourMinuteText, toLocalDate, toLocalTime} from "../../functions/dateFormat";
import React from "react";
import GoogleCalendarEvent from "../../models/GoogleCalendarEvent";
import FileDownloadIcon from 'remixicon-react/FileDownloadLineIcon'
import {downloadCSVFile} from "../../functions/downloadFile";

export type DownloadFormat = 'csv' | 'pdf' | 'html';

export interface DownloadButtonProps {
    events: GoogleCalendarEvent[];
    showTotalDuration: boolean;
    totalDuration: number;
    filename: string;
    format: DownloadFormat;
}

export const DownloadButton: React.FC<DownloadButtonProps> =
    ({
         events,
         showTotalDuration,
         totalDuration,
         format,
         filename,
     }) => {

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
            const separator = ";"
            const keys = ['title', 'start', 'end', 'duration'];
            const csv = events.map((e) => keys.map((key) => {
                if (key === 'title') return e['summary'];
                if (key === 'start') return toLocalDate(e[key].dateTime) ?? e[key].date;
                if (key === 'end') return toLocalDate(e[key].dateTime) ?? e[key].date;
                if (key === 'duration') return toHourMinuteText(e[key]);
                return e[key];
            }).join(separator))
            if (showTotalDuration) {
                const totalDurationRow = [...new Array(keys.length - 2), 'total', toHourMinuteText(totalDuration)].join(separator)
                csv.push(totalDurationRow)
            }


            csv.unshift(keys.join(separator));
            csv.unshift("SEP=" + separator);
            const content = csv.join('\r\n')
            downloadCSVFile(filename + '.csv', content);
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
                variant="contained"
                color='primary'
                style={{height: 58}}
                onClick={handleDownloadClick}
            >
                <span style={{marginRight: 8}}>DOWNLOAD</span>
                <FileDownloadIcon/>
            </Button>
        );
    }
export default DownloadButton;