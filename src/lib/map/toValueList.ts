export const toValueList = <T extends { id?: string }>(values: (T | undefined)[], ids: string[]): T[] => {
    return ids.map((id) => values.find(t => t?.id === id)).filter((tag: T | undefined): tag is T => tag !== undefined);
};

export default toValueList;