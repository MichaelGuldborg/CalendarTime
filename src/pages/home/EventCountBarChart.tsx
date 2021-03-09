import React from "react";
import Box from "@material-ui/core/Box";
import {Bar} from "react-chartjs-2";
import GoogleCalendarEvent from "../../models/GoogleCalendarEvent";
import countByLabel, {filterDateCountMap} from "../../functions/countByLabel";
import {chartBackgroundColors, chartBorderColors} from "../../functions/chartColors";


const countByStartDate = (events: GoogleCalendarEvent[]) => countByLabel(events, (e) => {
    if (e.start.date) return '' + e.start.date;
    return new Date(e.start.dateTime).toISOString().split("T")[0];
})


export interface EventCountBarChartProps {
    events: GoogleCalendarEvent[];
    start: Date;
    end: Date;
}

export const EventCountBarChart: React.FC<EventCountBarChartProps> = ({events, start, end}) => {

    const countMap = filterDateCountMap(countByStartDate(events), start, end)
    const labels = Object.keys(countMap).sort((a, b) => a.localeCompare(b));
    const values = labels.map(label => countMap[label]).concat(0);


    return (
        <Box p={2}>
            <Box pl={2} pb={2} display={'flex'} justifyContent={'space-between'}>
                <span>{'Events count'}</span>
            </Box>

            <Bar
                options={{legend: {display: false}}}
                data={{
                    labels: labels,
                    datasets: [{
                        label: '',
                        data: values,
                        backgroundColor: chartBackgroundColors(values.length),
                        borderColor: chartBorderColors(values.length),
                        borderWidth: 1
                    }]
                }}
            />
        </Box>
    )
}

export default EventCountBarChart;