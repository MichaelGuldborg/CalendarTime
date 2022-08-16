import {toHourMinuteText, toLocalDate, toLocalTime} from "../../functions/dateFormat";
import React from "react";
import GoogleCalendarEvent from "../../models/GoogleCalendarEvent";
import {TableCell, TableRow} from "@mui/material";
import BaseTable from "../../components/tables/BaseTable";
import HeadItem from "../../components/tables/HeadItem";
import {EventQueryState} from "../../useEventQueryState";


export interface EventTableProps {
    state: EventQueryState
}

export const EventTable: React.FC<EventTableProps> = ({state}) => {


    const fields: Array<HeadItem<GoogleCalendarEvent>> = [{
        id: 'summary',
        label: 'Title',
    }, {
        id: 'created',
        label: 'Date',
        render: (e) => toLocalDate(e.start?.dateTime) || e.start?.date,
        hidden: state.countBy !== 'event'
    }, {
        id: 'start',
        label: 'Start',
        render: (e) => toLocalTime(e.start?.dateTime) || 'All-day',
        hidden: state.countBy !== 'event'
    }, {
        id: 'end',
        label: 'End',
        render: (e) => toLocalTime(e.end?.dateTime) || 'All-day',
        hidden: state.countBy !== 'event'
    }, {
        id: 'createdByEmail',
        label: 'CreatedByEmail',
        hidden: !state.additionalFields.createdByEmail
    }, {
        id: 'createdByName',
        label: 'CreatedByName',
        hidden: !state.additionalFields.createdByName
    }, {
        id: 'created',
        label: 'Created',
        hidden: !state.additionalFields.created
    }, {
        id: 'updated',
        label: 'Updated',
        hidden: !state.additionalFields.updated
    }, {
        id: 'description',
        label: 'Description',
        hidden: !state.additionalFields.description
    }, {
        id: 'location',
        label: 'Location',
        hidden: !state.additionalFields.location
    }, {
        id: 'count',
        label: 'Count',
        hidden: state.countBy === 'event'
    }, {
        id: 'duration',
        label: 'Duration',
        disablePadding: true,
        render: (e) => toHourMinuteText(e.duration),
    }];


    return (
        <BaseTable<GoogleCalendarEvent>
            elements={state.events}
            heads={fields}
            initialOrder={'asc'}
            initialOrderKey={'start'}
        >
            {state.showTotalDuration && <TableRow key={'total'}>
                {fields.filter(e => !e.hidden).slice(2).map((e, i) => {
                    return <TableCell
                        key={'sum-' + i}
                        style={{borderBottom: 'none'}}
                    />;
                })}
                <TableCell
                    align={"left"}
                    component="th"
                    scope="row"
                    style={{borderBottom: 'none'}}
                >
                    TOTAL
                </TableCell>
                <TableCell
                    align={"left"}
                    style={{borderBottom: 'none'}}>
                    {toHourMinuteText(state.totalDuration)}
                </TableCell>
            </TableRow>}
        </BaseTable>
    )

}
