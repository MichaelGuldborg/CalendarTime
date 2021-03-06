import React from 'react';
import { useHistory } from "react-router-dom";
import {Button} from "@material-ui/core";
import Routes from "../../constants/Routes";

const NotFoundPage: React.FC = () => {
    const history = useHistory();
    const onBackClick = () => history.push(Routes.home);
    return (
        <div style={{
            width: '100%',
            height: '100%',
            backgroundRepeat: 'no-repeat',
            background: "linear-gradient(45deg, rgba(148,45,196,1) 0%, rgba(8,126,225,1) 100%)",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100wv',
                height: '100vh',
            }}>
                <div>
                    <h2 style={{color: 'white'}}>404. Siden findes ikke</h2>
                    <p style={{color: 'white'}}>Vi kunne desværre ikke finde den side, du ledte efter.</p>
                    <Button style={{color: 'white'}} onClick={onBackClick}>
                        Tilbage
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
