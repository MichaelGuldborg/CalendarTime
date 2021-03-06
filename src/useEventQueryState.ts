import React, {Dispatch, SetStateAction, useState} from "react";
import {endLastMonth, startLastMonth, toISODate} from "./functions/dateFormat";
import GoogleCalendar from "./models/GoogleCalendar";
import {useQuery} from "react-query";
import {googleClient} from "./services/googleClient";
import GoogleCalendarEvent from "./models/GoogleCalendarEvent";
import {SelectInputProps} from "@material-ui/core/Select/SelectInput";
import {DatePickerProps} from "@material-ui/pickers";
import {SwitchBaseProps} from "@material-ui/core/internal/SwitchBase";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {DownloadFormat} from "./pages/home/DownloadButton";


export type UseEventQueryState = [EventQueryState, EventQueryStateFunctions];

export interface EventQueryStateFunctions {
    onCalendarChange: (event: React.ChangeEvent<{ name?: string; value: unknown }>, child: React.ReactNode) => void;
    onStartChange: (date: MaterialUiPickersDate) => void;
    onEndChange: (date: MaterialUiPickersDate) => void;
    onAllDayOnlyChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
    setSearch: Dispatch<SetStateAction<string>>;
    onShowTotalDurationChange: SwitchBaseProps["onChange"];
    handleFieldsChange: (p: string) => SwitchBaseProps["onChange"];
    onDownloadFormatChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
    refreshEvents: () => Promise<void>;
}


export interface EventQueryState extends EventQueryFormValues {
    search: string;
    totalDuration: number;
    calendars: GoogleCalendar[];
    events: GoogleCalendarEvent[];
    filename: string;
}

export interface EventQueryFormValues {
    calendar?: GoogleCalendar,
    start: Date,
    end: Date,
    allDayOnly: boolean,
    showTotalDuration: boolean,
    downloadFormat: DownloadFormat;
    additionalFields: {
        createdByEmail: boolean,
        createdByName: boolean,
        created: boolean,
        updated: boolean,
        description: boolean,
        location: boolean,
    }
}

export const useEventQueryState = (): UseEventQueryState => {
    const [values, setValues] = useState<EventQueryFormValues>({
        calendar: undefined,
        start: startLastMonth,
        end: endLastMonth,
        allDayOnly: false,
        showTotalDuration: true,
        downloadFormat: 'csv',
        additionalFields: {
            createdByEmail: false,
            createdByName: false,
            created: false,
            updated: false,
            description: false,
            location: false,
        },
    });

    const [search, setSearch] = useState('');
    const searchLower = search.toLowerCase();

    const calendarListQuery = useQuery({
        queryKey: 'calendarList',
        queryFn: () => googleClient.getCalendarList({accessRole: 'owner'}),
        onSuccess: async (calendars: GoogleCalendar[]) => {
            const initialCalendar = calendars.find(c => c.summary.includes('@') ?? calendars[0])
            setValues({...values, calendar: initialCalendar});
        },
        initialData: [],
    });


    const calendars: GoogleCalendar[] = calendarListQuery.data ?? [];
    const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
    const filteredEvents = events.filter(e => {
        if (values.allDayOnly && e.start.date === undefined) return false;
        if (!values.allDayOnly && e.start.dateTime === undefined) return false;
        const summaryLower = e.summary?.toLowerCase();
        const descriptionLower = e.description?.toLowerCase() ?? '';
        const locationLower = e.location?.toLowerCase() ?? '';
        return summaryLower.includes(searchLower) || descriptionLower.includes(searchLower) || locationLower.includes(searchLower);
    })

    const totalDuration = filteredEvents.reduce<number>((result, value) => result + value.duration, 0)
    const filename = [values.calendar?.summary, toISODate(values.start), toISODate(values.end)].join('-')


    const onCalendarChange: SelectInputProps['onChange'] = (e) => {
        const c = calendars.find((c) => c.id === e.target.value);
        setValues({...values, calendar: c});
    }
    const onStartChange: DatePickerProps["onChange"] = async (date) => {
        if (date === null || date === undefined) return;
        setValues({...values, start: date})
        await refreshEvents()
    }
    const onEndChange: DatePickerProps["onChange"] = async (date) => {
        if (date === null || date === undefined) return;
        setValues({...values, end: date})
        await refreshEvents()
    }
    const onAllDayOnlyChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void = (e, v) => {
        setValues({
            ...values,
            allDayOnly: v === 'true',
        })
    };
    const onShowTotalDurationChange: SwitchBaseProps['onChange'] = (e, checked) => {
        setValues({
            ...values,
            showTotalDuration: checked
        });
    };
    const handleFieldsChange: (p: string) => SwitchBaseProps['onChange'] = (p) => (e, checked) => {
        setValues({
            ...values,
            additionalFields: {
                ...values.additionalFields,
                [p]: checked,
            }
        });
    }
    const onDownloadFormatChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void = (e, v) => {
        if (v === 'csv' || v === 'pdf' || v === 'html') return setValues({...values, downloadFormat: v});
    }

    const refreshEvents = async () => {
        const events = await googleClient.getEvents({
            calendarId: values.calendar?.id,
            timeMin: values.start,
            timeMax: values.end
        });
        setEvents(events);
    }


    return [{
        ...values,
        search,
        totalDuration,
        calendars,
        events: filteredEvents,
        filename,
    }, {
        onCalendarChange,
        onStartChange,
        onEndChange,
        onAllDayOnlyChange,
        onShowTotalDurationChange,
        setSearch,
        handleFieldsChange,
        onDownloadFormatChange,
        refreshEvents,
    }]
}