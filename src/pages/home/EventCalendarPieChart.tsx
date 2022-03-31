import React from "react";
import {Pie} from "react-chartjs-2";
import {chartBackgroundColors, chartBorderColors} from "../../functions/chartColors";
import countByLabel from "../../functions/countByLabel";
import GoogleCalendarEvent from "../../models/GoogleCalendarEvent";
import {hourMillis} from "../../functions/dateFormat";
import {Box} from "@mui/material";


export const EventCalendarPieChart: React.FC<{ events: GoogleCalendarEvent[] }> = ({events}) => {

    const countMap = countByLabel(events, e => e.calendarTitle, e => e.duration / hourMillis);
    const labels = Object.keys(countMap).sort((a, b) => a.localeCompare(b));
    const values = labels.map(label => countMap[label]);

    return (
        <Box p={2}>
            <Box pl={2} pb={2} display={'flex'} justifyContent={'space-between'}>
                <span>{'Event duration per calendar in hours'}</span>
            </Box>

            <Pie
                data={{
                    labels: labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: chartBackgroundColors(4),
                            borderColor: chartBorderColors(4),
                            borderWidth: 1,
                        },
                    ],
                }}
            />
        </Box>
    )
}
export default EventCalendarPieChart;