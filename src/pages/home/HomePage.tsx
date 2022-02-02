import React, {useState} from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import DateInput from "../../components/inputs/DateInput";
import {
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
import SearchInput from "../../components/inputs/SearchInput";
import DownloadButton from "./DownloadButton";
import InformationIcon from 'remixicon-react/InformationLineIcon'
import Grid from "@material-ui/core/Grid";
import {useEventQueryState} from "../../useEventQueryState";
import {EventTable} from "./EventTable";
import TemplateInput from "./TemplateInput";
import {ActionButton} from "../../components/buttons/ActionButton";
import IconButton from "@material-ui/core/IconButton";
import ArrowUpIcon from "remixicon-react/ArrowUpSLineIcon";
import ArrowDownIcon from "remixicon-react/ArrowDownSLineIcon";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'column',
        margin: theme.spacing(4, 0, 0, 0),
        padding: theme.spacing(2, 6),
        // boxShadow: '4px 4px 8px 3px rgb(152 162 179 / 15%), 0 2px 2px -1px rgb(152 162 179 / 30%)',
    },
    divider: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    paper: {
        margin: theme.spacing(4, 6),
        // position: 'relative',
        // transition: 'all 150ms cubic-bezier(0.694, 0.0482, 0.335, 1)',
        boxShadow: '4px 4px 24px 24px rgb(152 162 179 / 15%), 0 2px 2px -1px rgb(152 162 179 / 30%)',
        // boxShadow: '4px 4px 8px 3px rgb(152 162 179 / 15%), 0 2px 2px -1px rgb(152 162 179 / 30%)',
        // overflow: 'hidden',
        borderRadius: 4,
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
        setValues,
        onCalendarChange,
        onStartChange,
        onEndChange,
        onAllDayOnlyChange,
        setSearch,
        onShowTotalDurationChange,
        handleFieldsChange,
        refreshEvents,
    }] = useEventQueryState();


    const additionalFields = Object.keys(values.additionalFields).filter(key => values.additionalFields[key]);

    const [showAll, setShowAll] = useState(false);


    return (
        <div className={classes.root}>

            <div className={classes.toolbar}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={4} lg={3} xl={2} style={{display: 'flex'}}>
                        <SelectNamed
                            fullWidth
                            variant="outlined"
                            multiple
                            options={values.calendars}
                            value={values.selectedCalendars.map(c => c.id)}
                            onChange={onCalendarChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={3} xl={2} style={{display: 'flex'}}>
                        <DateInput value={values.start} onChange={onStartChange}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={3} xl={2} style={{display: 'flex'}}>
                        <DateInput value={values.end} onChange={onEndChange}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={3} xl={6}
                          style={{display: 'flex', justifyContent: 'flex-end'}}
                    >
                        <DownloadButton
                            events={values.events}
                            showTotalDuration={values.showTotalDuration}
                            totalDuration={values.totalDuration}
                            filename={values.filename}
                            format={'csv'}
                        />
                        <div style={{width: 16}}/>
                        <DownloadButton
                            events={values.events}
                            showTotalDuration={values.showTotalDuration}
                            totalDuration={values.totalDuration}
                            filename={values.filename}
                            format={'pdf'}
                        />
                        <div style={{width: 16}}/>
                        <ActionButton
                            text='REFRESH EVENTS'
                            icon={RefreshIcon}
                            onClick={refreshEvents}
                        />
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
                                    key={key}
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
                    <InputRow title={'Query templates:'}>
                        <TemplateInput
                            values={values}
                            setValues={setValues}
                        />
                    </InputRow>
                </div>

                <div style={{marginBottom: '-16px', display: 'flex', justifyContent: 'flex-end'}}>
                    <Tooltip title={showAll ? 'Hide advanced options' : 'Show advanced options'}>
                        <IconButton onClick={() => setShowAll(!showAll)} color={"primary"}>
                            {showAll ? <ArrowUpIcon/> : <ArrowDownIcon/>}
                        </IconButton>
                    </Tooltip>
                </div>

            </div>


            <Grid container>
                <Grid item xs={12}>
                    <div className={classes.paper}>
                        <EventTable
                            additionalFields={additionalFields}
                            events={values.events}
                            showTotalDuration={values.showTotalDuration}
                            totalDuration={values.totalDuration}
                        />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};


export default HomePage;



