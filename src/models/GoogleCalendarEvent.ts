export interface GoogleCalendarEvent {
    kind: string,
    etag: string,
    id: string,
    created: Date,
    updated: Date,
    summary: string,
    start: { dateTime: Date },
    end: { dateTime: Date },
    duration: number,
    creator: {
        attendees: any[],
        eventType: string,
        status: string,
        email: string,
        self: boolean,
    },
}

export default GoogleCalendarEvent;