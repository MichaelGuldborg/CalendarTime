import React from "react";
import LogoPage from "../../components/containers/LogoPage";
import {Button} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useHistory} from "react-router";
import Routes from "../../constants/Routes";
import {googleClient} from "../../services/calendarClient";

const useStyles = makeStyles((theme) => ({
    button: {
        padding: theme.spacing(2, 4),
        fontSize: 16,
        fontWeight: 500,
    }
}))


const LoginPage: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();


    const handleLoginClick = async () => {
        await googleClient.signIn();
        history.push(Routes.home);
    }

    return (
        <LogoPage>
            <Button
                className={classes.button}
                variant="outlined"
                onClick={handleLoginClick}
            >
                Sing in with Google
            </Button>
        </LogoPage>
    )
}

export default LoginPage;

