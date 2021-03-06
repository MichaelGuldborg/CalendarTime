import React from "react";
import Box from "@material-ui/core/Box";
import {Bar} from "react-chartjs-2";
import GoogleCalendarEvent from "../../models/GoogleCalendarEvent";
import countByLabel, {filterDateCountMap} from "../../functions/countByLabel";

const backgroundColors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
];
const borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
];

const chartBackgroundColors = (length: number) => new Array(length).fill(0).map((e, i) => backgroundColors[i % backgroundColors.length])
const chartBorderColors = (length: number) => new Array(length).fill(0).map((e, i) => borderColors[i % borderColors.length])


const countByStartDate = (events: GoogleCalendarEvent[]) => countByLabel(events, (e) => {
    if (e.start.date) return '' + e.start.date;
    return new Date(e.start.dateTime).toISOString().split("T")[0];
})


export interface EventBarChartProps {
    events: GoogleCalendarEvent[];
    start: Date;
    end: Date;
}

export const EventBarChart: React.FC<EventBarChartProps> = ({events, start, end}) => {

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

export default EventBarChart;