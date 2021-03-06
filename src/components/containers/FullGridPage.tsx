import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Grid} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import VersionTag from "../VersionTag";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundRepeat: 'no-repeat',
        background: "linear-gradient(45deg, rgba(148,45,196,1) 0%, rgba(8,126,225,1) 100%)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

    },
    content: {
        padding: theme.spacing(6, 6),
    },
    imgWrapper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: '20%',
        height: '20%',
        backgroundRepeat: 'no-repeat',
        // backgroundImage: `url("${LogoIcon}")`,
        backgroundSize: 'contain',
    }
}));

const FullGridPage: React.FC = ({children}) => {
    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} sm={8} md={5} lg={4}>
                <Paper elevation={12} square className={classes.paper}>
                    {children}
                </Paper>
            </Grid>
            <Grid item xs={false} sm={4} md={7} lg={8} className={classes.image}>
                <div className={classes.imgWrapper}>
                    <div className={classes.img}/>
                </div>
            </Grid>
        </Grid>
    );
}


export default FullGridPage;

