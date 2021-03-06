import Button from "@material-ui/core/Button";
import {jsPDF} from "jspdf";
import {toDuration, toDurationText, toLocalDate, toLocalTime} from "../../functions/dateFormat";
import React from "react";
import GoogleCalendarEvent from "../../models/GoogleCalendarEvent";

interface PDFButtonProps {
    events: GoogleCalendarEvent[];
    totalDuration: number;
    filename: string;
}

export const PDFButton: React.FC<PDFButtonProps> =
    ({
         events,
         totalDuration,
         filename,
     }) => {
        return (
            <Button
                variant="outlined"
                onClick={() => {
                    const doc = new jsPDF({
                        orientation: 'p',
                    });
                    const yOffset = 10;
                    events.forEach((e, index) => {
                        doc.text(toLocalDate(e.start.dateTime), 20, 20 + yOffset * index)
                        doc.text(toLocalTime(e.start.dateTime), 80, 20 + yOffset * index)
                        doc.text(toLocalTime(e.end.dateTime), 100, 20 + yOffset * index)
                        doc.text(toDuration(e.start.dateTime, e.end.dateTime), 130, 20 + yOffset * index)
                    })
                    doc.text('Total', 20, 20 + yOffset * events.length)
                    doc.text(toDurationText(totalDuration), 130, 20 + yOffset * events.length)
                    doc.save(filename);
                }}>
                DOWNLOAD PDF
            </Button>
        );
    }
export default PDFButton;