export interface GoogleCalendar {
    kind: string,
    etag: string,
    id: string,
    name: string,
    summary: string,
    description: string,
    timeZone: string,
    colorId: string,
    backgroundColor: string,
    foregroundColor: string,
    accessRole: 'reader' | 'writer' | 'owner',
}

export default GoogleCalendar;