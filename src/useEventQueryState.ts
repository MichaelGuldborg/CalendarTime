import React, {Dispatch, SetStateAction, useMemo, useState} from "react";
import {endMonth, startMonth, toDateKey, toLocalDate} from "./functions/dateFormat";
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
    onCountByChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
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
    countBy: 'event' | 'date' | 'title'
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
        start: startMonth,
        end: endMonth,
        allDayOnly: false,
        showTotalDuration: true,
        countBy: 'event',
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
            // console.log('calendars:', calendars)
            if (values.selectedCalendars.length) return;
            const initialCalendar = calendars.find(c => c.summary.includes('@')) ?? calendars[0]
            setValues({...values, selectedCalendars: [initialCalendar]});
        },
        initialData: [],
    });


    const calendars: GoogleCalendar[] = calendarListQuery.data ?? [];

    const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);

    const mergedEvents = useMemo<GoogleCalendarEvent[]>(() => {
        if (values.countBy === 'date') {
            return Object.values(events.reduce((result, event) => {
                const key = new Date(event.start.dateTime).toISOString().split('T')[0];
                if (result[key] === undefined) result[key] = {
                    ...event,
                    summary: toLocalDate(key),
                    count: 1,
                }
                else result[key] = {
                    ...result[key],
                    duration: result[key].duration + event.duration,
                    count: result[key].count + 1,
                };
                return result;
            }, {}));
        }
        if (values.countBy === 'title') {
            return Object.values(events.reduce((result, event) => {
                const key = event.summary?.trim()?.toLowerCase();
                if (result[key] === undefined) result[key] = {
                    ...event,
                    count: 1,
                }
                else result[key] = {
                    ...result[key],
                    duration: result[key].duration + event.duration,
                    count: result[key].count + 1,
                };
                return result;
            }, {}));
        }
        return events;
    }, [events, values]);

    const filteredEvents = mergedEvents.filter(e => {
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
    const onCountByChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void = (e, v) => {
        if (v !== 'event' && v !== 'date' && v !== 'title') return;
        setValues({
            ...values,
            countBy: v,
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
        values.end.setHours(23, 59, 0)
        const calendarEvents = await Promise.all(values.selectedCalendars.map((calendar) => {
            return googleClient.getEvents({
                calendarId: calendar?.id,
                calendarTitle: calendar.name,
                timeMin: values.start,
                timeMax: values.end
            });
        }))
        const events = calendarEvents.flat();
        console.log(events);
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
        setValues: handleSetValues,
        onCalendarChange,
        onStartChange,
        onEndChange,
        onAllDayOnlyChange,
        onCountByChange,
        onShowTotalDurationChange,
        setSearch,
        handleFieldsChange,
        refreshEvents: () => fetchEvents(values),
    }]
}