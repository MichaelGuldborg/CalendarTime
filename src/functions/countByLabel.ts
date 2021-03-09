export const countByLabel = <T, >(list: T[], getLabel: (e: T) => string, getValue?: (e: T) => number) => {
    if (!list || !list[0]) return {};
    return list.reduce<{ [p: string]: number }>((result, element) => {
        const label = getLabel(element);
        const value = getValue?.(element) ?? 1;
        result[label] = !result[label] ? value : result[label] + value;
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