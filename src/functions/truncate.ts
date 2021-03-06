
export const truncate = (s: string, maxLength: number): string => {
    if(s === undefined || s.length === 0) return '';
    const suffix = s.length > maxLength ? '...' : '';
    return s.substring(0, Math.min(maxLength, s.length)) + suffix;
}

export default truncate;