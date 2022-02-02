import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {capitalize} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import {toHourMinuteText, toLocalDate, toLocalTime} from "../../functions/dateFormat";
import React from "react";
import GoogleCalendarEvent from "../../models/GoogleCalendarEvent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import truncate from "../../functions/truncate";

const useStyles = makeStyles(() => ({
    cell: {
        maxWidth: 160,
        wordBreak: 'break-all',
    }
}))

export interface EventTableProps {
    additionalFields: string[];
    events: GoogleCalendarEvent[];
    showTotalDuration: boolean;
    totalDuration: number;
}

export const EventTable: React.FC<EventTableProps> = ({events, additionalFields, showTotalDuration, totalDuration}) => {
    const classes = useStyles();
    return (
        <TableContainer>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        {additionalFields.map((key) => <TableCell key={key}>{capitalize(key)}</TableCell>)}
                        <TableCell>Date</TableCell>
                        <TableCell>Start</TableCell>
                        <TableCell>End</TableCell>
                        <TableCell>Duration</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((event) => (
                        <TableRow key={event.id}>
                            <TableCell className={classes.cell} component="th" scope="row">
                                {event.summary}
                            </TableCell>
                            {additionalFields.map((key) => {
                                const value = event?.[key];
                                return <TableCell key={`${event.id}-${key}`} className={classes.cell}>{truncate(value, 180)}</TableCell>;
                            })}
                            <TableCell>{toLocalDate(event.start?.dateTime) || event.start?.date}</TableCell>
                            <TableCell>{toLocalTime(event.start?.dateTime) || 'All-day'}</TableCell>
                            <TableCell>{toLocalTime(event.end?.dateTime) || 'All-day'}</TableCell>
                            <TableCell>{toHourMinuteText(event.duration)}</TableCell>
                        </TableRow>
                    ))}
                    {showTotalDuration && <TableRow key={'total'}>
                        {[0, 1, 2, ...additionalFields].map((e,i) => <TableCell key={'sum-' + i} style={{borderBottom: 'none'}}/>)}
                        <TableCell component="th" scope="row" style={{borderBottom: 'none'}}>
                            TOTAL
                        </TableCell>
                        <TableCell style={{borderBottom: 'none'}}>{toHourMinuteText(totalDuration)}</TableCell>
                    </TableRow>}
                </TableBody>
            </Table>
        </TableContainer>
    )
}