import React from "react";
import FullGridPage from "../../components/containers/FullGridPage";
import {useHistory} from "react-router";
import Routes from "../../constants/Routes";
import {googleClient} from "../../services/googleClient";
import GoogleIcon from 'remixicon-react/GoogleFillIcon'
import VersionTag from "../../components/VersionTag";
import {useMutation} from "react-query";
import FeedbackDisplay from "../../components/displays/FeedbackDisplay";
import {Box, Button} from "@mui/material";


const LoginPage: React.FC = () => {
    const history = useHistory();

    const signInAction = useMutation('signIn', googleClient.signIn, {
        onSettled: (data, error) => {
            if (!error) history.push(Routes.home)
        },
    });
    const handleLoginClick = async () => {
        signInAction.mutate();
    }


    return (
        <FullGridPage>

            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 16,
            }}>
                <img src={'logo.png'} alt='logo' width='100%'/>
                Login to visualize your time
            </Box>

            <div style={{flex: 1}}>
                <Button
                    sx={(theme) => ({
                        marginBottom: theme.spacing(2),
                        padding: theme.spacing(2, 4),
                        fontSize: 18,
                        fontWeight: 500,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.common.white,
                        }
                    })}
                    variant="outlined"
                    onClick={handleLoginClick}
                >
                    <GoogleIcon style={{marginRight: 16}}/>
                    Sign in with Google
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

