
export const countByLabel = <T, >(list: T[], getLabel: (e: T) => string) => {
    if (!list || !list[0]) return {};
    return list.reduce<{ [p: string]: number }>((result, value) => {
        const label = getLabel(value);
        result[label] = !result[label] ? 1 : result[label] + 1;
        return result;
    }, {});
}

export const filterDateCountMap = (map: { [k: string]: number }, start: Date, end: Date) => {
    const result = {};
    const dt = new Date(start);
    end = new Date(end);
    while (dt <= end) {
        const key = new Date(dt).toISOString().split("T")[0];
        result[key] = map[key] || 0;
        dt.setDate(dt.getDate() + 1);
    }
    return result;
}
export default countByLabel;