import googleAPIConfig from '../../apiGoogleconfig.json';
import GoogleCalendar from "../models/GoogleCalendar";
import GoogleCalendarEvent from "../models/GoogleCalendarEvent";


let googleAPI: any = undefined;
export const googleClient = {
    isSignedIn: false,
    initialize: () => {
        if(googleAPI) return;
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
            return true;
        }).map(c => ({
            ...c,
            name: c.summary,
        }))
    },
    getEvents: async ({calendarId, timeMin, timeMax}: { calendarId?: string, timeMin: Date, timeMax: Date }) => {
        if (calendarId === undefined) return [];
        const response = await googleAPI.client.calendar.events.list({
            calendarId: calendarId,
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            showDeleted: false,
            singleEvents: true,
            orderBy: 'startTime',
        });
        if (response.status !== 200) return [];
        const responseBody: { items: GoogleCalendarEvent[] } = JSON.parse(response.body);
        return responseBody.items.map(e => ({
            ...e,
            duration: (new Date(e.end.dateTime).getTime() - new Date(e.start.dateTime).getTime()) ?? 0
        }));
    }
}

googleClient.initialize();

