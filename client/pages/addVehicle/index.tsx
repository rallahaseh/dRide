import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import router from 'next/router';
import { BigNumber } from 'ethers';
// MUI Components
import {
    Box,
    Grid,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Avatar
} from '@mui/material';
import DirectionsCarFilledTwoToneIcon from '@mui/icons-material/DirectionsCarFilledTwoTone';
// Components
import { Feature } from '../../components/geocoder/result';
import { AlertDialog } from '../../components';
// Pages
import SearchLocation from './search';
import MintVehicle, { VehicleData } from './mint';
import ListVehicle from './list';

const IndexPage: NextPage = () => {
    const steps = [
        {
            id: 0,
            title: 'Enter your location'
        },
        {
            id: 1,
            title: 'Create vehicle entity'
        },
        {
            id: 2,
            title: 'Add the vehicle to the list'
        }
    ]
    const [activeStep, setActiveStep] = useState(0);
    const [address, setAddress] = useState<Feature | null>(null);
    const [metadata, setMetaData] = useState<VehicleData>();

    useEffect(() => { address && setActiveStep(1); }, [address])
    useEffect(() => { metadata && setActiveStep(2); }, [metadata])

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <Grid
                        container
                        spacing={1}
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                    >

                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <DirectionsCarFilledTwoToneIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Add Vehicle
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((step) => (
                            <Step key={step.id}>
                                <StepLabel>{step.title}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Grid>
                <Grid item xs={12}>
                    {activeStep === 0 && <SearchLocation onSelectLocationHandler={(location) => {
                        setAddress(location);
                    }} />}
                    {activeStep === 1 && <MintVehicle userLocation={address!} onCompletion={(response) => {
                        console.log('Data: ', response);
                        setMetaData(response);
                    }} />}
                    {activeStep === 2 && <ListVehicle metadata={metadata!} onComplete={() => {
                        router.push('/');
                    }} />}
                </Grid>
            </Grid>
        </Box>
    );
}

export default IndexPage;