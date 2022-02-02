import {toHourMinuteText, toLocalDate, toLocalTime} from "../../functions/dateFormat";
import React from "react";
import GoogleCalendarEvent from "../../models/GoogleCalendarEvent";
import FileDownloadIcon from 'remixicon-react/FileDownloadLineIcon'
import {downloadCSVFile} from "../../functions/downloadFile";
import {ActionButton} from "../../components/buttons/ActionButton";
import pdfMakeX from 'pdfmake/build/pdfmake.js';
import * as pdfMake from 'pdfmake/build/pdfmake';
import config from "../../constants/config";
import {googleClient} from "../../services/googleClient";

const pdfFontsX = require('pdfmake-unicode/dist/pdfmake-unicode.js');

export type DownloadFormat = 'csv' | 'pdf' | 'html' | 'sheets';
pdfMakeX.vfs = pdfFontsX.pdfMake.vfs;

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
            } else if (format === "sheets") {
                return googleClient.createSheet('TESTAAAAAAA');
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
            pdfMake.createPdf({
                info: {
                    title: filename,
                    creationDate: new Date(),
                    producer: config.name,
                },
                content: [
                    {
                        style: {margin: [0, 5, 0, 15]},
                        table: {
                            body: [
                                ['Title', 'Date', 'Start', 'End', 'Duration'],
                                ...events.map(e => {
                                    return [
                                        e.summary,
                                        toLocalDate(e.start.dateTime),
                                        toLocalTime(e.start.dateTime),
                                        toLocalTime(e.end.dateTime),
                                        toHourMinuteText(e.duration)
                                    ];
                                }),
                                ['', '', '', 'Total', toHourMinuteText(totalDuration)],
                            ]
                        }
                    },
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                },
            }).download(filename + '.pdf');
        }


        const downloadHTML = () => {

        }


        return (
            <ActionButton
                text={format.toUpperCase()}
                icon={FileDownloadIcon}
                onClick={handleDownloadClick}
            />
        );
    }
export default DownloadButton;