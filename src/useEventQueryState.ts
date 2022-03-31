import React, {Dispatch, SetStateAction, useState} from "react";
import {endLastMonth, startLastMonth, toDateKey} from "./functions/dateFormat";
import GoogleCalendar from "./models/GoogleCalendar";
import {useQuery} from "react-query";
import {googleClient} from "./services/googleClient";
import GoogleCalendarEvent from "./models/GoogleCalendarEvent";
import {SelectChangeEvent, SelectInputProps} from "@mui/material/Select/SelectInput";
import {DatePickerProps} from "@mui/lab";
import {SwitchBaseProps} from "@mui/material/internal/SwitchBase";


export type UseEventQueryState = [EventQueryState, EventQueryStateFunctions];

export interface EventQueryStateFunctions {
    setValues: (values: EventQueryFormValues) => void;
    onCalendarChange: (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void;
    onStartChange: (date: unknown) => void;
    onEndChange: (date: unknown) => void;
    onAllDayOnlyChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
    setSearch: Dispatch<SetStateAction<string>>;
    onShowTotalDurationChange: SwitchBaseProps["onChange"];
    handleFieldsChange: (p: string) => SwitchBaseProps["onChange"];
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
    selectedCalendars: GoogleCalendar[];
    start: Date;
    end: Date;
    allDayOnly: boolean;
    showTotalDuration: boolean;
    additionalFields: {
        createdByEmail: boolean;
        createdByName: boolean;
        created: boolean;
        updated: boolean;
        description: boolean;
        location: boolean;
    }
}

export const useEventQueryState = (): UseEventQueryState => {
    const [values, setValues] = useState<EventQueryFormValues>({
        selectedCalendars: [],
        start: startLastMonth,
        end: endLastMonth,
        allDayOnly: false,
        showTotalDuration: true,
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
        queryFn: () => googleClient.getCalendarList(),
        onSuccess: async (calendars: GoogleCalendar[]) => {
            console.log('calendars:', calendars)
            if (values.selectedCalendars.length) return;
            const initialCalendar = calendars.find(c => c.summary.includes('@')) ?? calendars[0]
            setValues({...values, selectedCalendars: [initialCalendar]});
        },
        initialData: [],
    });


    const calendars: GoogleCalendar[] = calendarListQuery.data ?? [];

    const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
    const filteredEvents = events.filter(e => {
        if (values.allDayOnly && e.start.date === undefined) return false;
        if (!values.allDayOnly && e.start.dateTime === undefined) return false;
        const summaryLower = e.summary?.toLowerCase() ?? '';
        const descriptionLower = e.description?.toLowerCase() ?? '';
        const locationLower = e.location?.toLowerCase() ?? '';
        return summaryLower.includes(searchLower) || descriptionLower.includes(searchLower) || locationLower.includes(searchLower);
    })

    const totalDuration = filteredEvents.reduce<number>((result, value) => result + value.duration, 0)
    const calendarName = values.selectedCalendars.map(e => e.name).join('+');
    const startName = toDateKey(values.start);
    const endName = toDateKey(values.end);
    const filename = [calendarName, startName, endName].join('-')

    const onCalendarChange: SelectInputProps['onChange'] = async (e) => {
        const value = e.target.value as string[];
        const newValues = {...values, selectedCalendars: calendars.filter(c => value.includes(c.id))};
        setValues(newValues)
        await fetchEvents(newValues);
    }
    const onStartChange: DatePickerProps["onChange"] = async (date) => {
        if (date === null || date === undefined) return;
        const newValues = {...values, start: date as Date};
        setValues(newValues)
        await fetchEvents(newValues);
    }
    const onEndChange: DatePickerProps["onChange"] = async (date) => {
        if (date === null || date === undefined) return;
        const newValues = {...values, end: date as Date};
        setValues(newValues)
        await fetchEvents(newValues);
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

    const handleSetValues = async (values: EventQueryFormValues) => {
        setValues(values);
        await fetchEvents(values);
    }

    const fetchEvents = async (values: EventQueryFormValues) => {
        const events = await Promise.all(values.selectedCalendars.map((calendar) => {
            return googleClient.getEvents({
                calendarId: calendar?.id,
                calendarTitle: calendar.name,
                timeMin: values.start,
                timeMax: values.end
            });
        }))
        setEvents(events.flat());
    }


    return [{
        ...values,
        search,
        totalDuration,
        calendars,
        events: filteredEvents,
        filename,
    }, {
        setValues: handleSetValues,
        onCalendarChange,
        onStartChange,
        onEndChange,
        onAllDayOnlyChange,
        onShowTotalDurationChange,
        setSearch,
        handleFieldsChange,
        refreshEvents: () => fetchEvents(values),
    }]
}