import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ErrorPage from "./pages/error/ErrorPage";
import NotFoundPage from "./pages/error/NotFoundPage";
import LoginPage from "./pages/auth/LoginPage";
import Routes from "./constants/Routes";
import HomePage from "./pages/home/HomePage";
import {QueryClient, QueryClientProvider} from "react-query";
import {theme} from "./constants/theme";
import ReactGA from 'react-ga';
import {ThemeProvider} from "@mui/material";
import {LocalizationProvider} from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';

const queryClient = new QueryClient();

const App = () => {

    useEffect(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
    });

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={DateAdapter}>
                    <Router>
                        <Switch>
                            <Route exact path={Routes.landing} component={LoginPage}/>
                            <Route exact path={Routes.home} component={HomePage}/>


                            {/*ERROR*/}
                            <Route path={Routes.error} component={ErrorPage}/>
                            <Route path="*" component={NotFoundPage}/>
                        </Switch>
                    </Router>
                </LocalizationProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
