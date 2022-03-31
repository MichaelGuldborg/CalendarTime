import React from "react";
import {Box, Grid, Paper} from "@mui/material";


const FullGridPage: React.FC = ({children}) => {

    return (
        <Grid container sx={{
            height: '100vh',
        }}>
            <Grid item xs={12} sm={8} md={5} lg={4}>
                <Paper elevation={12} square sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {children}
                </Paper>
            </Grid>
            <Grid item xs={false} sm={4} md={7} lg={8} sx={{
                backgroundRepeat: 'no-repeat',
                background: "linear-gradient(45deg, rgba(148,45,196,1) 0%, rgba(8,126,225,1) 100%)",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Box sx={{
                        width: '20%',
                        height: '20%',
                        backgroundRepeat: 'no-repeat',
                        // backgroundImage: `url("${LogoIcon}")`,
                        backgroundSize: 'contain',
                    }}/>
                </Box>
            </Grid>
        </Grid>
    );
}


export default FullGridPage;

