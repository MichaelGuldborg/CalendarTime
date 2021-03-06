import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import DateInput from "../../components/inputs/DateInput";
import {
    Button,
    capitalize,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    Radio,
    RadioGroup,
    Tooltip
} from "@material-ui/core";
import RefreshIcon from "remixicon-react/RefreshLineIcon";
import SelectNamed from "../../components/inputs/SelectNamed";
import InputRow from "./InputRow";
import {EventTable} from "./EventTable";
import SearchInput from "../../components/inputs/SearchInput";
import Paper from "@material-ui/core/Paper";
import DownloadButton from "./DownloadButton";
import InformationIcon from 'remixicon-react/InformationLineIcon'
import Grid from "@material-ui/core/Grid";
import {useEventQueryState} from "../../useEventQueryState";


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
        width: '100%',
        // minWidth: 250,
    }
}))


const HomePage: React.FC = () => {
    const classes = useStyles();
    const [values, {
        onCalendarChange,
        onStartChange,
        onEndChange,
        onAllDayOnlyChange,
        setSearch,
        onShowTotalDurationChange,
        handleFieldsChange,
        onDownloadFormatChange,
        refreshEvents,
    }] = useEventQueryState();


    const additionalFields = Object.keys(values.additionalFields).filter(key => values.additionalFields[key]);

    return (
        <div className={classes.root}>

            <Paper className={classes.toolbar} elevation={12}>
                <InputRow>
                    <Grid container spacing={2}>
                        <Grid item sm={12} md={4} lg={3} xl={2} style={{display: 'flex'}}>
                            <SelectNamed
                                className={classes.selector}
                                variant="outlined"
                                options={values.calendars}
                                value={values.calendar?.id ?? ''}
                                onChange={onCalendarChange}
                            />
                        </Grid>
                        <Grid item sm={12} md={4} lg={3} xl={2} style={{display: 'flex'}}>
                            <DateInput value={values.start} onChange={onStartChange}/>
                        </Grid>
                        <Grid item sm={12} md={4} lg={3} xl={2} style={{display: 'flex'}}>
                            <DateInput value={values.end} onChange={onEndChange}/>
                        </Grid>

                        <Grid item sm={12} md={12} lg={3} xl={6} style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Button
                                variant="contained"
                                color='primary'
                                style={{height: 54}}
                                onClick={refreshEvents}
                            >
                                <span style={{marginRight: 8}}>REFRESH EVENTS</span>
                                <RefreshIcon/>
                            </Button>
                        </Grid>
                    </Grid>

                </InputRow>

                <Divider className={classes.divider}/>


                <InputRow title={'Search filter:'}>
                    <SearchInput search={values.search} onChange={setSearch}/>
                    <div style={{display: 'flex', alignItems: 'center', marginLeft: 16}}>
                        <Tooltip
                            title={"Search will check if the event title, description or location contains the entered search value"}>
                            <div><InformationIcon/></div>
                        </Tooltip>
                    </div>
                </InputRow>

                <InputRow title={'All Day filter:'}>
                    <RadioGroup row name="allDayOnly" value={'' + values.allDayOnly} onChange={onAllDayOnlyChange}>
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
                            onChange={onShowTotalDurationChange}
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
                                        onChange={handleFieldsChange(key)}
                                        name={key}
                                    />
                                }
                            />
                        })}
                    </FormGroup>
                </InputRow>

                <Divider className={classes.divider}/>

                <InputRow title={'Download format:'}>
                    <RadioGroup row name="fileFormat" value={values.downloadFormat} onChange={onDownloadFormatChange}>
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
                        events={values.events}
                        showTotalDuration={values.showTotalDuration}
                        totalDuration={values.totalDuration}
                        filename={values.filename}
                        format={values.downloadFormat}
                    />
                </InputRow>

            </Paper>


            <Paper elevation={12}>
                <EventTable
                    additionalFields={additionalFields}
                    events={values.events}
                    showTotalDuration={values.showTotalDuration}
                    totalDuration={values.totalDuration}
                />
            </Paper>


        </div>
    );
};


export default HomePage;



