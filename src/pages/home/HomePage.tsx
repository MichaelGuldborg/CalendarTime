import React, {useState} from 'react';
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
import IconButton from "@material-ui/core/IconButton";
import ArrowDownIcon from 'remixicon-react/ArrowDownSLineIcon'
import ArrowUpIcon from 'remixicon-react/ArrowUpSLineIcon'


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2, 6),
    },
    divider: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    paper: {
        margin: theme.spacing(4, 6)
    },
    showAll: {
        maxHeight: "2000px",
        transition: "max-height 1s ease-in",
    },
    hideAll: {
        maxHeight: "0",
        transition: "max-height 0.50s ease-out",
        overflow: "hidden"
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

    const [showAll, setShowAll] = useState(true);


    return (
        <div className={classes.root}>

            <Paper className={classes.toolbar} elevation={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={4} lg={3} xl={2} style={{display: 'flex'}}>
                        <SelectNamed
                            fullWidth
                            variant="outlined"
                            options={values.calendars}
                            value={values.calendar?.id ?? ''}
                            onChange={onCalendarChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={3} xl={2} style={{display: 'flex'}}>
                        <DateInput value={values.start} onChange={onStartChange}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={3} xl={2} style={{display: 'flex'}}>
                        <DateInput value={values.end} onChange={onEndChange}/>
                    </Grid>
                    <Grid item xs={12} sm={1} md={1} lg={1} xl={1} style={{display: 'flex'}}>
                        <div>
                            <Tooltip title={showAll ? 'Hide advanced options' : 'Show advanced options'}>
                                <IconButton onClick={() => setShowAll(!showAll)}>
                                    {showAll ? <ArrowUpIcon/> : <ArrowDownIcon/>}
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={11} md={11} lg={2} xl={5}
                          style={{display: 'flex', justifyContent: 'flex-end'}}>
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


                <div className={showAll ? classes.showAll : classes.hideAll}>
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
                        <RadioGroup row name="fileFormat" value={values.downloadFormat}
                                    onChange={onDownloadFormatChange}>
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
                            {/*<FormControlLabel*/}
                            {/*    value='html'*/}
                            {/*    control={<Radio color='primary'/>}*/}
                            {/*    label="HTML"*/}
                            {/*/>*/}
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
                </div>

            </Paper>


            <Paper elevation={12} className={classes.paper}>
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



