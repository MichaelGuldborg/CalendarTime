import React, {useState} from 'react';
import {DatePickerProps} from "@material-ui/pickers";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DateInput from "../../components/inputs/DateInput";
import {Button, capitalize, Checkbox, Divider, FormControlLabel, FormGroup, Radio, RadioGroup} from "@material-ui/core";
import RefreshIcon from "remixicon-react/RefreshLineIcon";
import {endLastMonth, startLastMonth} from "../../functions/dateFormat";
import {googleClient} from "../../services/googleClient";
import {useQuery} from "react-query";
import SelectNamed from "../../components/inputs/SelectNamed";
import {SelectInputProps} from "@material-ui/core/Select/SelectInput";
import GoogleCalendar from "../../models/GoogleCalendar";
import GoogleCalendarEvent from "../../models/GoogleCalendarEvent";
import {SwitchBaseProps} from "@material-ui/core/internal/SwitchBase";
import InputRow from "./InputRow";
import {EventTable} from "./EventTable";
import SearchInput from "../../components/inputs/SearchInput";
import Paper from "@material-ui/core/Paper";
import DownloadButton, {DownloadFormat} from "./DownloadButton";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(4, 6)
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(4, 8),
        marginBottom: theme.spacing(4),
    },
    divider: {
        marginBottom: theme.spacing(2),
    },
    selector: {
        minWidth: 250,
    }
}))


interface ValueState {
    calendar?: GoogleCalendar,
    start: Date,
    end: Date,
    allDayOnly: boolean,
    showTotalDuration: boolean,
    additionalFields: {
        createdByEmail: boolean,
        createdByName: boolean,
        created: boolean,
        updated: boolean,
        description: boolean,
        location: boolean,
    }
}

const HomePage: React.FC = () => {
    const classes = useStyles();
    const [values, setValues] = useState<ValueState>({
        calendar: undefined,
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
    const handleAdditionalFieldsChange: (p: string) => SwitchBaseProps['onChange'] = (p) => (e, checked) => {
        setValues({
            ...values,
            additionalFields: {
                ...values.additionalFields,
                [p]: checked,
            }
        });
    }
    const handleAllDayOnlyChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void = (e, v) => {
        setValues({
            ...values,
            allDayOnly: v === 'true',
        })
    };

    const handleRefreshClick = async () => {
        const events = await googleClient.getEvents({
            calendarId: values.calendar?.id,
            timeMin: values.start,
            timeMax: values.end
        });
        setEvents(events);
    }


    const additionalFields = Object.keys(values.additionalFields).filter(key => values.additionalFields[key]);

    const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>('csv');


    return (
        <div className={classes.root}>

            <Paper className={classes.toolbar} elevation={12}>
                <InputRow>
                    <SelectNamed
                        className={classes.selector}
                        variant="outlined"
                        options={calendars}
                        value={values.calendar?.id ?? ''}
                        onChange={onCalendarChange}
                    />

                    <DateInput value={values.start} onChange={handleStartChange}/>
                    <DateInput value={values.end} onChange={handleEndChange}/>
                    <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
                        <Button variant='outlined' onClick={handleRefreshClick} style={{marginLeft: 16}}>
                            <span style={{marginRight: 8}}>REFRESH EVENTS</span>
                            <RefreshIcon/>
                        </Button>
                    </div>
                </InputRow>

                <Divider className={classes.divider}/>


                <InputRow title={'Search filter:'}>
                    <SearchInput search={search} onChange={setSearch}/>
                </InputRow>

                <InputRow title={'All Day filter:'}>
                    <RadioGroup row name="allDayOnly" value={'' + values.allDayOnly} onChange={handleAllDayOnlyChange}>
                        <FormControlLabel
                            value='false'
                            control={<Radio color='primary'/>}
                            label="Exclude All-day events"
                        />
                        <FormControlLabel
                            value='true'
                            control={<Radio color='primary'/>}
                            label="All-day events only"
                        />
                    </RadioGroup>
                </InputRow>


                <InputRow title={'Show total duration:'}>
                    <FormControlLabel
                        label=''
                        control={<Checkbox
                            color="primary"
                            checked={values.showTotalDuration}
                            onChange={(e, checked) => setValues({...values, showTotalDuration: checked})}
                        />}
                    />
                </InputRow>
                <InputRow title={'Additional fields:'}>
                    <FormGroup row>
                        {Object.keys(values.additionalFields).map(key => {
                            return <FormControlLabel
                                label={capitalize(key)}
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={values.additionalFields[key]}
                                        onChange={handleAdditionalFieldsChange(key)}
                                        name={key}
                                    />
                                }
                            />
                        })}
                    </FormGroup>
                </InputRow>

                <Divider className={classes.divider}/>

                <InputRow title={'Download format:'}>
                    <RadioGroup row name="fileFormat" value={downloadFormat} onChange={(e, v) => {
                        if (v === 'csv' || v === 'pdf' || v === 'html') return setDownloadFormat(v);
                    }}>
                        <FormControlLabel
                            value='csv'
                            control={<Radio color='primary'/>}
                            label="CSV"
                        />
                        <FormControlLabel
                            value='pdf'
                            control={<Radio color='primary'/>}
                            label="PDF"
                        />
                        <FormControlLabel
                            value='html'
                            control={<Radio color='primary'/>}
                            label="HTML"
                        />
                    </RadioGroup>
                    <div style={{flex: 1}}/>
                    <DownloadButton
                        events={filteredEvents}
                        totalDuration={totalDuration}
                        filename={values.calendar?.summary}
                        format={downloadFormat}
                    />
                </InputRow>

            </Paper>


            <Paper elevation={12}>
                <EventTable
                    additionalFields={additionalFields}
                    events={filteredEvents}
                    showTotalDuration={values.showTotalDuration}
                    totalDuration={totalDuration}
                />
            </Paper>


        </div>
    );
};


export default HomePage;



