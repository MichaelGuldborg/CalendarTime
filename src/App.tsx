import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
// import {MuiPickersUtilsProvider} from "@material-ui/pickers";
// import DateFnsUtils from "@date-io/date-fns";
// import enLocale from "date-fns/locale/en";
import ErrorPage from "./pages/error/ErrorPage";
import NotFoundPage from "./pages/error/NotFoundPage";
import LoginPage from "./pages/auth/LoginPage";
import Routes from "./constants/Routes";
import HomePage from "./pages/home/HomePage";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {QueryClient, QueryClientProvider} from "react-query";


const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Router>
                    <Switch>
                        <Route exact path={Routes.landing} component={LoginPage}/>
                        <Route exact path={Routes.home} component={HomePage}/>


                        {/*ERROR*/}
                        <Route path={Routes.error} component={ErrorPage}/>
                        <Route path="*" component={NotFoundPage}/>
                    </Switch>
                </Router>
            </MuiPickersUtilsProvider>
        </QueryClientProvider>
    );
}

export default App;
