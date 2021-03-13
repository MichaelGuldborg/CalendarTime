# [Calendar Time](https://github.com/MichaelGuldborg/CalendarTime)
> This is the repository of the opensource web application Calendar Time

The primary functionality of this application is to provide the user with insight into google calendar events.
This insight can be used to create timesheets or evaluate priorities for different activities.

## Features

| Name                   | Description                                                       	|  Done   |
| ---------------------  | ---------------------------------------------------------------- 	| :-----: |
| Sign in with google    |																		| &#9745; |
| Sign in with microsoft |																		| &#9744; |
| --- Show/Export 		 |																		| 		  |
| Preview events 		 |																		| &#9745; |
| Export to csv 		 |																		| &#9745; |
| Export to pdf 		 |																		| &#9745; |
| Export to html 		 |																		| &#9744; |
| Export to Excel 2007 	 |																		| &#9744; |
| --- Filter/Sort 		 |																		| 		  |
| Date interval	 		 |																		| &#9745; |
| Additional fields 	 |																		| &#9745; |
| All day events 		 |																		| &#9745; |
| Text search	 		 | Search title, description and location for specific keywords			| &#9745; |
| Add #hashtags 	 	 | Add #hashtags from description and title as a unique fields			| &#9744; |
| --- Dev/Ops 			 |																		| 		  |
| Pre-push lint check 	 | Add local lint and type check before push to deploy branches			| &#9745; |
| Auto-versioning	 	 | Automatically increase version number before push to deploy branches	| &#9745; |
| CI/CD 				 | Continous deployment flow to netlify									| &#9745; |


## Installation

In order to run the application for development you must add an environment file to the root directory with valid google API credentials.

The file should be name `.end.development` and contain the following values
```shell script
REACT_APP_GOOGLE_CLIENT_ID=xxxxxxxx
REACT_APP_GOOGLE_API_KEY=xxxxxxxx
```

## Development

The following is a list of commands available

```bash
# Run the app in the development mode
yarn start

# Check if eslint or typescript compile contains errors/warnings
yarn lint:check

# Launch the test runner in the interactive watch mode
yarn test

# Build the app for production to the `build` folder
yarn build
```


