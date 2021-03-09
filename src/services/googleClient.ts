import GoogleCalendar from "../models/GoogleCalendar";
import GoogleCalendarEvent from "../models/GoogleCalendarEvent";
import googleAPIConfig from "../constants/googleAPIConfig";


let googleAPI: any = undefined;

const isInfoCalendar = (c: GoogleCalendar) => {
    // check if the calendar is a default google info calendar
    const calendarIdHash = c.id.split('@')?.[1];
    return calendarIdHash === 'group.v.calendar.google.com';
}


export const googleClient = {
    isSignedIn: false,
    initialize: () => {
        if (googleAPI) return;
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        document.body.appendChild(script);
        script.onload = (): void => {
            googleAPI = (window['gapi'] as any);
            googleAPI.load('client:auth2', async () => {
                await googleAPI.client.init(googleAPIConfig).catch((e: any) => {
                    console.error(e);
                });

                // Handle the initial sign-in state.
                googleClient.isSignedIn = googleAPI.auth2.getAuthInstance().isSignedIn.get();

                // Listen for sign-in state changes.
                googleAPI.auth2.getAuthInstance().isSignedIn
                    .listen((signedIn: boolean) => googleClient.isSignedIn = signedIn);

            });
        };
    },
    signIn: () => {
        return googleAPI.auth2.getAuthInstance().signIn();
    },
    getCalendarList: async ({accessRole}: { accessRole?: 'reader' | 'writer' | 'owner' } = {}) => {
        const response = await googleAPI.client.calendar.calendarList.list();
        if (response.status !== 200) return [];
        const responseBody: { items: GoogleCalendar[] } = JSON.parse(response.body);
        return responseBody.items.filter((c) => {
            if (accessRole && accessRole !== c.accessRole) return false;
            return !isInfoCalendar(c);

        }).map(c => ({
            ...c,
            name: c.summaryOverride || c.summary,
        }))
    },
    getEvents: async ({calendarId, calendarTitle, timeMin, timeMax}: { calendarId: string, calendarTitle: string, timeMin: Date, timeMax: Date }): Promise<GoogleCalendarEvent[]> => {
        if (calendarId === undefined) return [];
        const response = await googleAPI.client.calendar.events.list({
            calendarId: calendarId,
            timeMin: new Date(timeMin).toISOString(),
            timeMax: new Date(timeMax).toISOString(),
            showDeleted: false,
            singleEvents: true,
            orderBy: 'startTime',
        });
        if (response.status !== 200) return [];
        const responseBody: { items: GoogleCalendarEvent[] } = JSON.parse(response.body);
        return responseBody.items.map(e => ({
            ...e,
            calendarId: calendarId,
            calendarTitle: calendarTitle,
            duration: getEventDuration(e),
            createdByEmail: e.creator?.email,
            createdByName: e.creator?.displayName,
        }));
    },
}

const getEventDuration = (event: GoogleCalendarEvent) => {
    if (event?.start?.dateTime === undefined && event?.start?.date === undefined) return 0;
    if (event?.start?.dateTime === undefined) {
        return (new Date(event.end.date).getTime() - new Date(event.start.date).getTime())
    }
    return (new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime())
}

googleClient.initialize();

