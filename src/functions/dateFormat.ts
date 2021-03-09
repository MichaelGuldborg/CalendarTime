export const twoDigit = (s: string | number): string => `${s}`.padStart(2, "0");
// export const toLocalISODate = (input: Date | string) => {
//     const date = new Date(input);
//     return [date.getFullYear(), twoDigit(date.getMonth() + 1), twoDigit(date.getDate())].join("-");
// };

export const secondMillis = 1000;
export const twoSecondMillis = 2000;
export const minuteMillis = 60000;
export const twoMinuteMillis = 120000;
export const hourMillis = 3600000;
export const twoHourMillis = 7200000;
export const dayMillis = 86400000;
export const twoDayMillis = 172800000;
export const weekMillis = 604800000;

export const startLastMonth = new Date();
startLastMonth.setMonth(startLastMonth.getMonth() - 1, 1);
startLastMonth.setHours(0, 0, 0)

export const endLastMonth = new Date();
endLastMonth.setMonth(endLastMonth.getMonth(), 0);
endLastMonth.setHours(0, 0, 0)

export const toISODate = (input: Date | string): string => {
    if (input === undefined) return '';
    const date = new Date(input);
    return '' + date.getDate() + '-' + date.getMonth() + 1 + '-' + date.getFullYear()
};


export const toLocalDateTime = (input: Date | string): string => {
    if (input === undefined) return '';
    return toLocalDate(input) + ' ' + toLocalTime(input);
};

export const toLocalDate = (input: Date | string): string => {
    if (input === undefined) return '';
    const date = new Date(input);
    return '' + date.getDate() + '. ' + monthNames[date.getMonth()] + ' ' + date.getFullYear()
};

export const toLocalTime = (input: Date | string): string => {
    if (input === undefined) return '';
    const date = new Date(input);
    return [twoDigit(date.getHours()), twoDigit(date.getMinutes())].join(":")
};

export const toHourMinuteText = (diff: number) => {
    const hours = (diff / 3600000);
    const minutes = (diff - hours * 3600000) / 60000;
    return [hours.toFixed(), twoDigit(minutes)].join(':')
};

export const toTimeAgo = (input?: Date | string): string => {
    if (input === undefined) return '';
    const date = new Date(input);
    const diff = new Date().getTime() - date.getTime()
    if (diff < secondMillis) return 'now'
    if (diff < twoSecondMillis) return '1 second'
    if (diff < minuteMillis) return '' + (diff / secondMillis).toFixed() + ' seconds'
    if (diff < twoMinuteMillis) return '1 minute'
    if (diff < hourMillis) return '' + (diff / minuteMillis).toFixed() + ' minutes'
    if (diff < twoHourMillis) return '1 hour'
    if (diff < dayMillis) return '' + (diff / hourMillis).toFixed() + ' hours'
    if (diff < twoDayMillis) return 'yesterday'
    if (diff < weekMillis) return '' + (diff / dayMillis).toFixed() + ' days'
    const monthName = monthNames[date.getMonth()];
    return `${date.getDate()}. ${monthName} ${toLocalTime(date)}`;
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
