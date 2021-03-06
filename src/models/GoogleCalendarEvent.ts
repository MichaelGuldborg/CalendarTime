export interface GoogleCalendarEvent {
    kind: string,
    etag: string,
    id: string,
    description?: string,
    location?: string,
    created: Date,
    updated: Date,
    summary: string,
    start: { date: Date,dateTime: Date },
    end: { date: Date,dateTime: Date },
    attendees: any[],
    eventType: string,
    status: string,
    creator: {
        email: string,
        displayName: string,
        self: boolean,
    },
    // extensions
    duration: number,
    createdByEmail?: string
    createdByName?: string
}

export default GoogleCalendarEvent;