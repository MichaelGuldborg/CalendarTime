import React from "react";
import FullGridPage from "../../components/containers/FullGridPage";
import {Button} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useHistory} from "react-router";
import Routes from "../../constants/Routes";
import {googleClient} from "../../services/googleClient";
import GoogleIcon from 'remixicon-react/GoogleFillIcon'
import VersionTag from "../../components/VersionTag";
import {useMutation} from "react-query";
import FeedbackDisplay from "../../components/displays/FeedbackDisplay";

const useStyles = makeStyles((theme) => ({
    title: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
    },
    button: {
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2, 4),
        fontSize: 18,
        fontWeight: 500,
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
        }
    }
}))


const LoginPage: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();

    const signInAction = useMutation('signIn', googleClient.signIn, {
        onSettled: (data, error, variables) => {
            if (!error) history.push(Routes.home)
        },
    });
    const handleLoginClick = async () => {
        signInAction.mutate();
    }


    return (
        <FullGridPage>

            <div className={classes.title}>
                <img src={'logo.png'} alt='logo' width='100%'/>
                Login to visualize your time
            </div>

            <div style={{flex: 1}}>
                <Button
                    className={classes.button}
                    variant="outlined"
                    onClick={handleLoginClick}
                >
                    <GoogleIcon style={{marginRight: 16}}/>
                    Sing in with Google
                </Button>
                <FeedbackDisplay
                    error={(signInAction.error as any)?.error}
                    onDismiss={signInAction.reset}
                />
            </div>

            <VersionTag/>
        </FullGridPage>
    )
}

export default LoginPage;

