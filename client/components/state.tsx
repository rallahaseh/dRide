import { FC, useState } from 'react';
import {
    Grid,
    Box,
    Paper,
    Avatar,
    Typography,

} from '@mui/material';
import CarCrashIcon from '@mui/icons-material/CarCrash';
import ErrorIcon from '@mui/icons-material/Error';
import emptyBackgroundImage from '../public/empty.jpg'
import errorBackgroundImage from '../public/error.jpg'

export enum StateType {
    empty,
    error
}

interface StateAlertProps {
    state: StateType
}

export const StateAlert: FC<StateAlertProps> = (props: StateAlertProps) => {
    const img = (props.state == StateType.empty) ? emptyBackgroundImage.src : errorBackgroundImage.src;

    return (
        <Grid container component="main" sx={{ height: '75vh' }}>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: `url(${img})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        m: 3,
                        pt: 3,
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar sx={{ m: 2, width: 100, height: 100 }}>
                        {props.state === StateType.empty && <CarCrashIcon sx={{ width: 75, height: 75 }} />}
                        {props.state === StateType.error && <ErrorIcon sx={{ width: 75, height: 75 }} />}
                    </Avatar>
                    <Typography component="h1" variant="h3">
                        {props.state === StateType.empty && "No results found"}
                        {props.state === StateType.error && "Error"}
                    </Typography>
                    <Typography component="h4" variant="h5">
                        {props.state === StateType.empty && "Seems like currently there is not any available vehicles, in the date or the locaiton you selected"}
                        {props.state === StateType.error && "We are sorry but seems like something wrong happened, please try again later"}
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    );
};