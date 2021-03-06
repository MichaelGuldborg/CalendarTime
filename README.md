# Calendar Time
> This is the repository of the opensource web application Calendar Time

The application allows for exporting google calendar events to csv and pdf formats 

## Installation

In order to run the application for development you must create a google api config file and include it at the root of the application.

The file should be name `apiGoogleconfig.json` and contain the following values
```json
{
  "clientId": "xxxxxxxx-xxxxxxxx.apps.googleusercontent.com",
  "apiKey": "xxxxxxxx",
  "scope": "https://www.googleapis.com/auth/calendar",
  "discoveryDocs": [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ]
}
```

## Development

The following is a list of commands available

```bash
# Run the app in the development mode
yarn start

# Launch the test runner in the interactive watch mode
yarn test

# Build the app for production to the `build` folder
yarn build
```
