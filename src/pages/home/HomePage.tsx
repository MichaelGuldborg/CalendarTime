import React, {useState} from 'react';
import {DatePickerProps} from "@material-ui/pickers";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DateInput from "../../components/inputs/DateInput";
import {IconButton} from "@material-ui/core";
import RefreshIcon from "remixicon-react/RefreshLineIcon";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {
    endLastMonth,
    startLastMonth,
    toDuration,
    toDurationText,
    toLocalDate,
    toLocalTime
} from "../../functions/dateFormat";
import {googleClient} from "../../services/googleClient";
import {useQuery} from "react-query";
import SelectNamed from "../../components/inputs/SelectNamed";
import {SelectInputProps} from "@material-ui/core/Select/SelectInput";
import PDFButton from "./PDFButton";
import GoogleCalendar from "../../models/GoogleCalendar";
import GoogleCalendarEvent from "../../models/GoogleCalendarEvent";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    toolbar: {
        display: 'flex',
        padding: theme.spacing(4, 8),
    },
    selector: {
        minWidth: 240,
    }
}))


interface ValueState {
    calendar?: GoogleCalendar,
    start: Date,
    end: Date,
}

const HomePage: React.FC = () => {
    const classes = useStyles();
    const [values, setValues] = useState<ValueState>({
        calendar: undefined,
        start: startLastMonth,
        end: endLastMonth,
    });

    const calendarListQuery = useQuery({
        queryKey: 'calendarList',
        queryFn: () => googleClient.getCalendarList({accessRole: 'owner'}),
        onSuccess: (calendars) => setValues({...values, calendar: calendars[0]}),
        initialData: [],
    });
    const calendars: GoogleCalendar[] = calendarListQuery.data ?? [];
    const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
    const filteredEvents = events.filter(e => e.start.dateTime !== undefined)


    const totalDuration = filteredEvents.reduce<number>((result, value) => {
        return result + value.duration;
    }, 0)


    const onCalendarChange: SelectInputProps['onChange'] = (e) => {
        const c = calendars.find((c) => c.id === e.target.value);
        setValues({...values, calendar: c});
    }
    const handleStartChange: DatePickerProps["onChange"] = (date) => {
        if (date === null || date === undefined) return;
        setValues({...values, start: date})
    }
    const handleEndChange: DatePickerProps["onChange"] = (date) => {
        if (date === null || date === undefined) return;
        setValues({...values, end: date})
    }

    const handleRefreshClick = async () => {
        const events = await googleClient.getEvents({
            calendarId: values.calendar?.id,
            timeMin: values.start,
            timeMax: values.end
        });
        setEvents(events);
    }

    const filename = values.calendar?.summary + '.pdf';

    return (
        <div className={classes.root}>

            {/*{JSON.stringify(events?.[0], null, 2)}*/}
            {/*{JSON.stringify(calendars, null, 2)}*/}
            <div className={classes.toolbar}>

                <SelectNamed
                    className={classes.selector}
                    variant="outlined"
                    options={calendars}
                    value={values.calendar?.id ?? ''}
                    onChange={onCalendarChange}
                />

                <DateInput value={values.start} onChange={handleStartChange}/>
                <DateInput value={values.end} onChange={handleEndChange}/>
                <div>
                    <IconButton onClick={handleRefreshClick}>
                        <RefreshIcon/>
                    </IconButton>
                </div>
                <PDFButton
                    events={filteredEvents}
                    totalDuration={totalDuration}
                    filename={filename}
                />


            </div>

            <TableContainer>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Titel</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Start</TableCell>
                            <TableCell>End</TableCell>
                            <TableCell>Duration</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEvents.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell component="th" scope="row">
                                    {event.summary}
                                </TableCell>
                                <TableCell>{toLocalDate(event.start?.dateTime)}</TableCell>
                                <TableCell>{toLocalTime(event.start?.dateTime)}</TableCell>
                                <TableCell>{toLocalTime(event.end?.dateTime)}</TableCell>
                                <TableCell>{toDuration(event.start?.dateTime, event.end?.dateTime)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow key={'total'}>
                            <TableCell component="th" scope="row">
                                TOTAL
                            </TableCell>
                            <TableCell/>
                            <TableCell/>
                            <TableCell/>
                            <TableCell>{toDurationText(totalDuration)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};


export default HomePage;



