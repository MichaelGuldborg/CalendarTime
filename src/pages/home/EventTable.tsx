import {toHourMinuteText, toLocalDate, toLocalTime} from "../../functions/dateFormat";
import React from "react";
import GoogleCalendarEvent from "../../models/GoogleCalendarEvent";
import truncate from "../../functions/truncate";
import {capitalize, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";


const StyledCell = styled(TableCell)`
  max-width: 160px;
  word-break: break-all;
`

export interface EventTableProps {
    additionalFields: string[];
    events: GoogleCalendarEvent[];
    showTotalDuration: boolean;
    totalDuration: number;
}

export const EventTable: React.FC<EventTableProps> = ({events, additionalFields, showTotalDuration, totalDuration}) => {
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
                            <StyledCell component="th" scope="row">
                                {event.summary}
                            </StyledCell>
                            {additionalFields.map((key) => {
                                const value = event?.[key];
                                return <StyledCell key={`${event.id}-${key}`}>{truncate(value, 180)}</StyledCell>;
                            })}
                            <TableCell>{toLocalDate(event.start?.dateTime) || event.start?.date}</TableCell>
                            <TableCell>{toLocalTime(event.start?.dateTime) || 'All-day'}</TableCell>
                            <TableCell>{toLocalTime(event.end?.dateTime) || 'All-day'}</TableCell>
                            <TableCell>{toHourMinuteText(event.duration)}</TableCell>
                        </TableRow>
                    ))}
                    {showTotalDuration && <TableRow key={'total'}>
                        {[0, 1, 2, ...additionalFields].map((e, i) => <TableCell key={'sum-' + i}
                                                                                 style={{borderBottom: 'none'}}/>)}
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